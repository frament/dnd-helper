import {Component, computed, effect, inject, input, linkedSignal, resource, signal, viewChild} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {AccordionModule} from 'primeng/accordion';
import {Menu, MenuModule} from 'primeng/menu';
import {ButtonModule} from 'primeng/button';
import {NoteEditor} from '../../editors/note-editor/note-editor';
import {ChapterEditor} from '../../editors/chapter-editor/chapter-editor';
import {MapEditorComponent} from '../../editors/map-editor/map-editor';
import {NpcEditor} from '../../editors/npc-editor/npc-editor';
import {ArtifactEditorComponent} from '../../editors/artifact-editor/artifact-editor';
import {TimelineEditorComponent} from '../../editors/timeline-editor/timeline-editor';
import {Database} from '../../database';
import {TAdventure} from '../../models/adventure.model';
import {AdventureEditor} from '../../editors/adventure-editor/adventure-editor';
import {DividerModule} from 'primeng/divider';
import {TBaseEntity} from '../../models/base-entity.model';
import {deepClone} from '../../helpers/clone-helper';
import {TNote, TNoteCreate} from '../../editors/note-editor/TNote';
import {TMap, TMapCreate} from '../../models/map.model';
import {TChapter, TChapterCreate} from '../../models/chapter.model';
import {TNPC, TNPCreate} from '../../models/npc.model';
import {TArtifact, TArtifactCreate} from '../../models/artifact.model';

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
  readonly chapters = resource<TChapter[], string>({
    params: () => this.id(),
    loader: async ({params}) => this.db.linked<TChapter>('adventures',['adventure_chapter','chapters'], [params]),
    defaultValue: []
  })
  readonly npcs = resource<TNPC[], string>({
    params: () => this.id(),
    loader: async ({params}) => this.db.linked<TNPC>('adventures',['adventure_npc','npcs'], [params]),
    defaultValue: []
  })

  readonly artifacts = resource<TArtifact[], string>({
    params: () => this.id(),
    loader: async ({params}) => this.db.linked<TArtifact>('adventures',['adventure_artifact','artifacts'], [params]),
    defaultValue: []
  })

  readonly activeType = signal<TActiveType>(null);
  readonly activeItemTitle = computed<string>(() => {
    if (!this.activeType() || !this.activeItem) return 'Редактор приключения';
    switch(this.activeType()) {
      case 'notes':
        return this.notes.value().find(n => n.id.id === this.activeItem)?.title || 'Заметка';
      case 'maps':
        return this.maps.value().find(m => m.id.id === this.activeItem)?.title || 'Карта';
      case 'chapters':
        return this.chapters.value().find(c => c.id.id === this.activeItem)?.title || 'Глава';
      case 'npcs':
        return this.npcs.value().find(n => n.id.id === this.activeItem)?.name || 'Персонаж';
      case 'artifacts':
        return this.artifacts.value().find(a => a.id.id === this.activeItem)?.name || 'Артефакт';
      default:
        return 'Редактор приключения';
    }
  });
  activeItem: string | null = null;
  readonly activeContent = linkedSignal<any>(() => this.adventure.value());
  readonly activeContentPatch = signal<any>(null);

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
        this.activeContent.set(this.chapters.value().find(c => c.id.id === id));
        break;
      case 'npcs':
        this.activeContent.set(this.npcs.value().find(n => n.id.id === id));
        break;
      case 'artifacts':
        this.activeContent.set(this.artifacts.value().find(a => a.id.id === id));
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
    this.selectItem(type, newItem["id"].toString());
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
      case 'chapters':
        await this.defCreate<TChapterCreate>(
          type,
          {title:'Новая глава', status:'draft'},
          'adventure_chapter'
        );
        break;
      case 'npcs':
        await this.defCreate<TNPCreate>(
          type,
          {name:'Новый NPC', race:'human'},
          'adventure_npc'
        );
        break;
      case 'artifacts':
        await this.defCreate<TArtifactCreate>(
          type,
          {name:'Новый артефакт'},
          'adventure_artifact'
        );
        break;
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

  duplicateItem(item: TBaseEntity & any) {
    // Реализация дублирования
    console.log(`Дублировать ${item.id.tb}:`, item);
  }

  async deleteItem(item: TBaseEntity & any) {
    await this.db.db.delete(item.id);
    this.refreshByTb(item.id.tb);
  }

  exportItem(){
    const ent: TBaseEntity = deepClone(this.activeContent());
    console.log('export', ent);
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
      case 'chapters': this.chapters.reload(); break;
      case 'npcs': this.npcs.reload(); break;
      case 'artifacts': this.artifacts.reload(); break;
      case 'adventures': this.adventure.reload(); break;
    }
  }

}
