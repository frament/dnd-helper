import {Component, computed, inject, input, resource, signal, viewChild} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {AccordionModule} from 'primeng/accordion';
import {Menu, MenuModule} from 'primeng/menu';
import {ButtonModule} from 'primeng/button';
import {NoteEditor} from '../editors/note-editor/note-editor';
import {ChapterEditor} from '../editors/chapter-editor/chapter-editor';
import {MapEditorComponent} from '../editors/map-editor/map-editor';
import {NpcEditor} from '../editors/npc-editor/npc-editor';
import {ArtifactEditorComponent} from '../editors/artifact-editor/artifact-editor';
import {TimelineEditorComponent} from '../editors/timeline-editor/timeline-editor';
import {Database} from '../database';
import {TAdventure} from '../models/adventure.model';
import {AdventureEditor} from '../editors/adventure-editor/adventure-editor';
import {DividerModule} from 'primeng/divider';
import {TBaseEntity} from '../models/base-entity.model';
import {deepClone} from '../helpers/clone.helper';
import {TNote, TNoteCreate} from '../editors/note-editor/TNote';
import {TMap, TMapCreate} from '../models/map.model';
import {TChapter, TChapterCreate} from '../models/chapter.model';
import {TNPC, TNPCreate} from '../models/npc.model';
import {TArtifact, TArtifactCreate} from '../models/artifact.model';
import {Table} from 'surrealdb';

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
    loader: async ({params}) => (await this.db.linked<TNote>('adventures',['adventure_note','notes'], [params])),
      //.sort((a,b) => a.createdAt?.getTime() - b.createdAt?.getTime()),
    defaultValue: []
  })
  readonly maps = resource<TMap[], string>({
    params: () => this.id(),
    loader: async ({params}) => (await this.db.linked<TMap>('adventures',['adventure_map','maps'], [params])),
      //.sort((a,b) => a.createdAt?.getTime() - b.createdAt?.getTime()),
    defaultValue: []
  })
  readonly chapters = resource<TChapter[], string>({
    params: () => this.id(),
    loader: async ({params}) => (await this.db.linked<TChapter>('adventures',['adventure_chapter','chapters'], [params])),
      //.sort((a,b) => a.createdAt?.getTime() - b.createdAt?.getTime()),
    defaultValue: []
  })
  readonly npcs = resource<TNPC[], string>({
    params: () => this.id(),
    loader: async ({params}) => (await this.db.linked<TNPC>('adventures',['adventure_npc','npcs'], [params])),
      //.sort((a,b) => a.createdAt?.getTime() - b.createdAt?.getTime()),
    defaultValue: []
  })

  readonly artifacts = resource<TArtifact[], string>({
    params: () => this.id(),
    loader: async ({params}) => (await this.db.linked<TArtifact>('adventures',['adventure_artifact','artifacts'], [params])),
      //.sort((a,b) => a.createdAt?.getTime() - b.createdAt?.getTime()),
    defaultValue: []
  })

  readonly activeType = signal<TActiveType>(null);
  readonly activeItemTitle = computed<string>(() => {
    if (!this.activeType() || !this.activeItemId) return 'Редактор приключения';
    switch(this.activeType()) {
      case 'notes':
        return this.activeContent()?.title || 'Заметка';
      case 'maps':
        return this.activeContent()?.title || 'Карта';
      case 'chapters':
        return this.activeContent()?.title || 'Глава';
      case 'npcs':
        return this.activeContent()?.name || 'Персонаж';
      case 'artifacts':
        return this.activeContent()?.name || 'Артефакт';
      default:
        return 'Редактор приключения';
    }
  });
  activeItemId = signal<string | null>(null);
  readonly activeContent = computed<any>(() => {
    const id = this.activeItemId();
    const type = this.activeType();
    if (type && !id) return undefined;
    let resource: any[] = [];
    switch(type) {
      case 'notes': resource = this.notes.value(); break;
      case 'maps': resource = this.maps.value(); break;
      case 'chapters': resource = this.chapters.value(); break;
      case 'npcs': resource = this.npcs.value(); break;
      case 'artifacts': resource =  this.artifacts.value(); break;
      default: return this.adventure.value();
    }
    return resource.find(n => n.id.id === id);
  });
  readonly activeContentPatch = signal<any>(null);

  contextMenuItems: MenuItem[] = [];

  contextMenu = viewChild<Menu>('contextMenu');

  selectItem(type: TActiveType, id: string) {
    this.activeType.set(type);
    this.activeItemId.set(id);
  }

  openContextMenu(event: Event, item: TBaseEntity & any) {
    event.stopPropagation();

    this.contextMenuItems = [
      { label: 'Дублировать', icon: 'pi pi-copy',
        command: () => this.duplicateItem(item)
      },
      { separator: true },
      { label: 'Удалить', icon: 'pi pi-trash', styleClass: 'text-red-500',
        command: () => this.deleteItem(item)
      }
    ];

    this.contextMenu()?.toggle(event);
  }

  async defCreate<T = any>(type: TActiveType, item: T, linksTable?:string){
    const [newItem] = await this.db.db.insert<T>(new Table(type+''), item as any);
    if (linksTable) {
      await this.db.createLink(
        'adventures', this.adventure.value()?.id.id+'',
        linksTable,
        type+'', newItem["id"].id+''
      )
    }
    this.activeItemId.set(null);
    this.refreshByTb(type+'');
    this.selectItem(type, newItem.id.id.toString());
  }

  async addItem(type: TActiveType, item?:any) {
    switch(type) {
      case 'notes':
        await this.defCreate<TNoteCreate>(
          type,
          item ?? {status: 'draft', title:'Новая заметка',content: '', tags:[], category:''},
          'adventure_note'
        );
        break;
      case 'maps':
        await this.defCreate<TMapCreate>(
          type,
          item ?? {title:'Новая карта', type:'world'},
          'adventure_map'
        );
        break;
      case 'chapters':
        await this.defCreate<TChapterCreate>(
          type,
          item ?? {title:'Новая глава', status:'draft'},
          'adventure_chapter'
        );
        break;
      case 'npcs':
        await this.defCreate<TNPCreate>(
          type,
          item ?? {name:'Новый NPC', race:'human'},
          'adventure_npc'
        );
        break;
      case 'artifacts':
        await this.defCreate<TArtifactCreate>(
          type,
          item ?? {name:'Новый артефакт'},
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

  async duplicateItem(item: TBaseEntity & any) {
    const ent: TBaseEntity & any = deepClone(item);
    delete ent.id;
    delete ent.createdAt;
    delete ent.updatedAt;
    await this.addItem(item.id.tb, ent)
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
    this.refreshByTb(this.activeType());
  }

  async applyPatch() {
    if (!this.activeContentPatch() || !this.activeContent()?.id) return;
    await this.db.db.update(this.activeContent().id).merge(this.activeContentPatch());
    this.activeContentPatch.set(null);
    const ent: TBaseEntity = this.activeContent();
    this.refreshByTb(ent.id.table.toString());
  }

  refreshByTb(tb:string|null){
    switch (tb) {
      case 'notes': this.notes.reload(); break;
      case 'maps': this.maps.reload(); break;
      case 'chapters': this.chapters.reload(); break;
      case 'npcs': this.npcs.reload(); break;
      case 'artifacts': this.artifacts.reload(); break;
      case 'adventures': this.adventure.reload(); break;
      default: this.adventure.reload();
    }
  }

}
