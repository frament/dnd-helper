import {Component, computed, effect, inject, input, linkedSignal, resource, signal, viewChild} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {AccordionModule} from 'primeng/accordion';
import {Menu, MenuModule} from 'primeng/menu';
import {ButtonModule} from 'primeng/button';
import {NoteEditor} from '../../uni-components/note-editor/note-editor';
import {ChapterEditor} from './chapter-editor/chapter-editor';
import {MapEditorComponent} from './map-editor/map-editor';
import {NpcEditor} from './npc-editor/npc-editor';
import {ArtifactEditorComponent} from './artifact-editor/artifact-editor';
import {TimelineEditorComponent} from './timeline-editor/timeline-editor';
import {Database} from '../../database';
import {TAdventure} from '../../models/adventure.model';
import {AdventureEditor} from './adventure-editor/adventure-editor';
import {DividerModule} from 'primeng/divider';
import {TBaseEntity} from '../../models/base-entity.model';
import {RecordId} from 'surrealdb';
import {deepClone} from '../../helpers/clone-helper';
import {Note} from '../../uni-components/note-editor/note';

type TActiveType = null|'note'|'map'|'chapter'|'npc'|'event'|'artifact';

@Component({
  selector: 'app-adventure',
  imports: [
    AccordionModule,
    MenuModule,
    ButtonModule,
    MenuModule,
    NoteEditor,
    MapEditorComponent,
    NpcEditor,
    ArtifactEditorComponent,
    TimelineEditorComponent,
    ChapterEditor,
    AdventureEditor,
    DividerModule
  ],
  templateUrl: './adventure.html',
  styleUrl: './adventure.css'
})
export class Adventure {
  id = input<string>('', {alias:'id'});
  readonly db = inject(Database).db;
  readonly adventure = resource<TAdventure, string>({
    params: () => this.id(),
    loader: async ({params}) => this.db.select<TAdventure>(new RecordId('adventures', params))
  });
  readonly notes = resource<Note[], string>({
    params: () => this.id(),
    loader: async ({params}) => {
      const [[links]] = await this.db.query<[any[]]>(
        'select ->adventure_note->notes.* from adventures:'+params
      );
      return links?.['->adventure_note']?.['->notes'] ?? [];
    },
    defaultValue: []
  })

  constructor() {
    effect(() => {
      console.log(this.notes.value());
    });
  }

  readonly activeType = signal<TActiveType>(null);
  readonly activeItemTitle = computed<string>(() => {
    if (!this.activeType() || !this.activeItem) return 'Редактор приключения';
    switch(this.activeType()) {
      case 'note':
        return this.notes.value().find(n => n.id === this.activeItem)?.title || 'Заметка';
      case 'map':
        return this.maps.find(m => m.id === this.activeItem)?.title || 'Карта';
      case 'chapter':
        return this.chapters.find(c => c.id === this.activeItem)?.title || 'Глава';
      case 'npc':
        return this.npcs.find(n => n.id === this.activeItem)?.title || 'Персонаж';
      case 'event':
        return this.timelineEvents.find(e => e.id === this.activeItem)?.title || 'Событие';
      case 'artifact':
        return this.artifacts.find(a => a.id === this.activeItem)?.title || 'Артефакт';
      default:
        return 'Редактор приключения';
    }
  });
  activeItem: string | null = null;
  readonly activeContent = linkedSignal<any>(() => this.adventure.value());
  readonly activeContentPatch = signal<any>(null);

  maps = [
    { id: 'map1', title: 'Карта джунглей', content: "" },
    { id: 'map2', title: 'План храма', content: "" }
  ];

  chapters = [
    { id: 'chapter1', title: 'Введение в джунгли', content: "" },
    { id: 'chapter2', title: 'Храм обезьяньего бога', content: "" }
  ];

  npcs = [
    { id: 'npc1', title: 'Старый шаман', content: "" },
    { id: 'npc2', title: 'Капитан экспедиции', content: "" }
  ];

  timelineEvents = [
    { id: 'event1', title: 'Начало экспедиции', content: "" },
    { id: 'event2', title: 'Открытие храма', content: "" }
  ];

  artifacts = [
    { id: 'artifact1', title: 'Золотой идол', content: "" },
    { id: 'artifact2', title: 'Карта сокровищ', content: "" }
  ];

  contextMenuItems: MenuItem[] = [];
  contextMenuType: string | null = null;
  contextMenuItem: any = null;

  contextMenu = viewChild<Menu>('contextMenu');

  selectItem(type: TActiveType, id: string) {
    this.activeType.set(type);
    this.activeItem = id;
    // Находим выбранный элемент
    switch(type) {
      case 'note':
        this.activeContent.set(this.notes.value().find(n => n.id === id));
        break;
      case 'map':
        this.activeContent.set(this.maps.find(m => m.id === id));
        break;
      case 'chapter':
        this.activeContent.set(this.chapters.find(c => c.id === id));
        break;
      case 'npc':
        this.activeContent.set(this.npcs.find(n => n.id === id));
        break;
      case 'event':
        this.activeContent.set(this.timelineEvents.find(e => e.id === id));
        break;
      case 'artifact':
        this.activeContent.set(this.artifacts.find(a => a.id === id));
        break;
    }
  }

  openContextMenu(event: Event, type: string, item: any) {
    event.stopPropagation();
    this.contextMenuType = type;
    this.contextMenuItem = item;

    this.contextMenuItems = [
      {
        label: 'Переименовать',
        icon: 'pi pi-pencil',
        command: () => this.renameItem(type, item)
      },
      {
        label: 'Дублировать',
        icon: 'pi pi-copy',
        command: () => this.duplicateItem(type, item)
      },
      {
        separator: true
      },
      {
        label: 'Удалить',
        icon: 'pi pi-trash',
        styleClass: 'text-red-500',
        command: () => this.deleteItem(type, item)
      }
    ];

    this.contextMenu()?.toggle(event);
  }

  addItem(type: TActiveType) {
    const newItem = {
      id: `${type}${Date.now()}`,
      title: `${this.getTypeNew(type)} ${this.getTypeName(type)}`,
      //name: `Новый ${this.getTypeName(type)}`,
      content: ""
    };

    switch(type) {
      case 'note':
        // this.notes.push(newItem);
        this.selectItem('note', newItem.id);
        break;
      case 'map':
        this.maps.push(newItem);
        this.selectItem('map', newItem.id);
        break;
      case 'chapter':
        this.chapters.push(newItem);
        this.selectItem('chapter', newItem.id);
        break;
      case 'npc':
        this.npcs.push(newItem);
        this.selectItem('npc', newItem.id);
        break;
      case 'event':
        this.timelineEvents.push(newItem);
        this.selectItem('event', newItem.id);
        break;
      case 'artifact':
        this.artifacts.push(newItem);
        this.selectItem('artifact', newItem.id);
        break;
    }
  }

  getTypeNew(type: TActiveType): string {
    const gender = this.getTypeGender(type);
    switch (gender) {
      case 'm': return 'Новый';
      case 'f': return 'Новая';
      case "o": return 'Новое';
      default: return 'Новый';
    }
  }

  getTypeGender(type: TActiveType): 'm'|'f'|'o' {
    switch(type) {
      case 'note': return 'f';
      case 'map': return 'f';
      case 'chapter': return 'f';
      case 'npc': return 'm';
      case 'event': return 'o';
      case 'artifact': return 'm';
      default: return 'm';
    }
  }

  getTypeName(type: TActiveType): string {
    switch(type) {
      case 'note': return 'заметка';
      case 'map': return 'карта';
      case 'chapter': return 'глава';
      case 'npc': return 'персонаж';
      case 'event': return 'событие';
      case 'artifact': return 'артефакт';
      case null: return 'приключение';
      default: return 'элемент';
    }
  }

  renameItem(type: string, item: any) {
    // Реализация переименования
    console.log(`Переименовать ${type}:`, item);
  }

  duplicateItem(type: string, item: any) {
    // Реализация дублирования
    console.log(`Дублировать ${type}:`, item);
  }

  deleteItem(type: string, item: any) {
    // Реализация удаления
    console.log(`Удалить ${type}:`, item);
  }

  cancelPatch(){
    const ent: TBaseEntity = deepClone(this.activeContent());
    this.activeContentPatch.set(null);
    this.activeContent.set(undefined);
    this.activeContent.set(ent);
  }

  async applyPatch() {
    if (!this.activeContentPatch() || !this.activeContent()?.id) return;
    await this.db.merge(this.activeContent().id, this.activeContentPatch());
    this.activeContentPatch.set(null);
    const ent: TBaseEntity = this.activeContent();
    if ( ent.id.tb === 'adventure'){
      this.adventure.reload();
    }
  }
}
