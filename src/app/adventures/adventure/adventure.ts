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
import {deepClone} from '../../helpers/clone-helper';
import {TNote, TNoteCreate} from '../../uni-components/note-editor/TNote';
import {TMap, TMapCreate} from '../../models/map.model';

type TActiveType = null|'notes'|'maps'|'chapters'|'npcs'|'events'|'artifacts';

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
  readonly db = inject(Database);
  readonly adventure = resource<TAdventure, string>({
    params: () => this.id(),
    loader: async ({params}) => await this.db.selectOne<TAdventure>('adventures', params)
  });
  readonly notes = resource<TNote[], string>({
    params: () => this.id(),
    loader: async ({params}) => this.db.linked<TNote>('adventures',['adventure_note','notes'], [params]),
    defaultValue: []
  })
  readonly maps = resource<TMap[], string>({
    params: () => this.id(),
    loader: async ({params}) => this.db.linked<TMap>('adventures',['adventure_map','maps'], [params]),
    defaultValue: []
  })

  constructor() {
    effect(() => {
      console.log(this.maps.value());
    });
  }

  readonly activeType = signal<TActiveType>(null);
  readonly activeItemTitle = computed<string>(() => {
    if (!this.activeType() || !this.activeItem) return 'Редактор приключения';
    switch(this.activeType()) {
      case 'notes':
        return this.notes.value().find(n => n.id.id === this.activeItem)?.title || 'Заметка';
      case 'maps':
        return this.maps.value().find(m => m.id.id === this.activeItem)?.title || 'Карта';
      case 'chapters':
        return this.chapters.find(c => c.id === this.activeItem)?.title || 'Глава';
      case 'npcs':
        return this.npcs.find(n => n.id === this.activeItem)?.title || 'Персонаж';
      case 'events':
        return this.timelineEvents.find(e => e.id === this.activeItem)?.title || 'Событие';
      case 'artifacts':
        return this.artifacts.find(a => a.id === this.activeItem)?.title || 'Артефакт';
      default:
        return 'Редактор приключения';
    }
  });
  activeItem: string | null = null;
  readonly activeContent = linkedSignal<any>(() => this.adventure.value());
  readonly activeContentPatch = signal<any>(null);

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

  contextMenu = viewChild<Menu>('contextMenu');

  selectItem(type: TActiveType, id: string) {
    this.activeType.set(type);
    this.activeItem = id;
    // Находим выбранный элемент
    switch(type) {
      case 'notes':
        this.activeContent.set(this.notes.value().find(n => n.id.id === id));
        break;
      case 'maps':
        this.activeContent.set(this.maps.value().find(m => m.id.id === id));
        break;
      case 'chapters':
        this.activeContent.set(this.chapters.find(c => c.id === id));
        break;
      case 'npcs':
        this.activeContent.set(this.npcs.find(n => n.id === id));
        break;
      case 'events':
        this.activeContent.set(this.timelineEvents.find(e => e.id === id));
        break;
      case 'artifacts':
        this.activeContent.set(this.artifacts.find(a => a.id === id));
        break;
    }
  }

  openContextMenu(event: Event, item: TBaseEntity & any) {
    event.stopPropagation();

    this.contextMenuItems = [
      {
        label: 'Дублировать',
        icon: 'pi pi-copy',
        command: () => this.duplicateItem(item)
      },
      {
        separator: true
      },
      {
        label: 'Удалить',
        icon: 'pi pi-trash',
        styleClass: 'text-red-500',
        command: () => this.deleteItem(item)
      }
    ];

    this.contextMenu()?.toggle(event);
  }

  async defCreate<T = any>(type: TActiveType, item: T, linksTable?:string){
    const [newItem] = await this.db.db.create<any, any>(type+'', item);
    if (linksTable) {
      await this.db.createLink(
        'adventures', this.adventure.value()?.id.id+'',
        linksTable,
        type+'', newItem["id"].id+''
      )
    }

    this.refreshByTb(type+'');
    this.selectItem('notes', newItem["id"].toString());
  }

  async addItem(type: TActiveType) {
    switch(type) {
      case 'notes':
        await this.defCreate<TNoteCreate>(
          type,
          {status: 'draft', title:'Новая заметка',content: '', tags:[], category:''},
          'adventure_note'
        );
        break;
      case 'maps':
        await this.defCreate<TMapCreate>(
          type,
          {title:'Новая карта', type:'world'},
          'adventure_map'
        );
        break;
     /* case 'map':
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
        break;*/
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
      case 'notes': return 'f';
      case 'maps': return 'f';
      case 'chapters': return 'f';
      case 'npcs': return 'm';
      case 'events': return 'o';
      case 'artifacts': return 'm';
      default: return 'm';
    }
  }

  getTypeName(type: TActiveType): string {
    switch(type) {
      case 'notes': return 'заметка';
      case 'maps': return 'карта';
      case 'chapters': return 'глава';
      case 'npcs': return 'персонаж';
      case 'events': return 'событие';
      case 'artifacts': return 'артефакт';
      case null: return 'приключение';
      default: return 'элемент';
    }
  }

  renameItem(type: string, item: any) {
    // Реализация переименования
    console.log(`Переименовать ${type}:`, item);
  }

  duplicateItem(item: TBaseEntity & any) {
    // Реализация дублирования
    console.log(`Дублировать ${item.id.tb}:`, item);
  }

  async deleteItem(item: TBaseEntity & any) {
    await this.db.db.delete(item.id);
    this.refreshByTb(item.id.tb);
    // Реализация удаления
    console.log(`Удалить ${item.id.tb}:`, item);
  }

  cancelPatch(){
    const ent: TBaseEntity = deepClone(this.activeContent());
    this.activeContentPatch.set(null);
    this.activeContent.set(undefined);
    this.activeContent.set(ent);
  }

  async applyPatch() {
    if (!this.activeContentPatch() || !this.activeContent()?.id) return;
    await this.db.db.merge(this.activeContent().id, this.activeContentPatch());
    this.activeContentPatch.set(null);
    const ent: TBaseEntity = this.activeContent();
    this.refreshByTb(ent.id.tb);

  }
  refreshByTb(tb:string){
    switch (tb) {
      case 'notes': this.notes.reload(); break;
      case 'maps': this.maps.reload(); break;
      case 'adventures': this.adventure.reload(); break;
    }
  }

}
