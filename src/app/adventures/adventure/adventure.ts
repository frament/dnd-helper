import {Component, viewChild} from '@angular/core';
import {MenuItem} from 'primeng/api';
import {AccordionModule} from 'primeng/accordion';
import {Menu, MenuModule} from 'primeng/menu';
import {ButtonModule} from 'primeng/button';
import {NoteEditor} from '../../uni-components/note-editor/note-editor';

@Component({
  selector: 'app-adventure',
  imports: [
    AccordionModule,
    MenuModule,
    ButtonModule,
    MenuModule,
    NoteEditor,
  ],
  templateUrl: './adventure.html',
  styleUrl: './adventure.css'
})
export class Adventure {
  activeType: string | null = null;
  activeItem: string | null = null;
  activeContent: any = null;

  // Пример данных
  notes = [
    { id: 'note1', title: 'Основные идеи', content: 'Заметки о сюжетных линиях...' },
    { id: 'note2', title: 'Идеи для квестов', content: 'Возможные задания для игроков...' }
  ];

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

  constructor() {}

  selectItem(type: string, id: string) {
    this.activeType = type;
    this.activeItem = id;

    // Находим выбранный элемент
    switch(type) {
      case 'note':
        this.activeContent = this.notes.find(n => n.id === id);
        break;
      case 'map':
        this.activeContent = this.maps.find(m => m.id === id);
        break;
      case 'chapter':
        this.activeContent = this.chapters.find(c => c.id === id);
        break;
      case 'npc':
        this.activeContent = this.npcs.find(n => n.id === id);
        break;
      case 'event':
        this.activeContent = this.timelineEvents.find(e => e.id === id);
        break;
      case 'artifact':
        this.activeContent = this.artifacts.find(a => a.id === id);
        break;
    }
  }

  getActiveItemTitle(): string {
    if (!this.activeType || !this.activeItem) return 'Редактор приключений';

    switch(this.activeType) {
      case 'note':
        return this.notes.find(n => n.id === this.activeItem)?.title || 'Заметка';
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
        return 'Редактор приключений';
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

  addItem(type: string) {
    const newItem = {
      id: `${type}${Date.now()}`,
      title: `Новый ${this.getTypeName(type)}`,
      //name: `Новый ${this.getTypeName(type)}`,
      content: ""
    };

    switch(type) {
      case 'note':
        this.notes.push(newItem);
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

  getTypeName(type: string): string {
    switch(type) {
      case 'note': return 'элемент';
      case 'map': return 'карта';
      case 'chapter': return 'глава';
      case 'npc': return 'персонаж';
      case 'event': return 'событие';
      case 'artifact': return 'артефакт';
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

  protected readonly console = console;
}
