import {Component, effect, inject, resource, signal} from '@angular/core';
import {AvatarModule} from 'primeng/avatar';
import {MenuItem} from 'primeng/api';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CardModule} from 'primeng/card';
import {TagModule} from 'primeng/tag';
import {ButtonModule} from 'primeng/button';
import {MenuModule} from 'primeng/menu';
import {ProgressBarModule} from 'primeng/progressbar';
import {PaginatorModule} from 'primeng/paginator';
import {InputTextModule} from 'primeng/inputtext';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import {Database} from '../database';
import {PopoverModule} from 'primeng/popover';
import {TAdventure} from '../models/adventure.model';

@Component({
  selector: 'app-adventures',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    AvatarModule,
    TagModule,
    ButtonModule,
    MenuModule,
    ProgressBarModule,
    PaginatorModule,
    InputTextModule,
    InputGroupModule,
    InputGroupAddonModule,
    PopoverModule
  ],
  templateUrl: './adventures.html',
  styleUrl: './adventures.css'
})
export class Adventures {
  _adventures = [
    {
      id: 1,
      title: 'Потерянные земли Амазонии',
      avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/amyelsner.png',
      author: 'Мастер Иван',
      status: 'Активно',
      description: 'Исследуйте древние джунгли в поисках потерянного города золота.',
      chapters: [
        { id: 1, title: 'Введение в джунгли', available: true, progress: 75 },
        { id: 2, title: 'Храм обезьяньего бога', available: true, progress: 40 },
        { id: 3, title: 'Река забвения', available: false, progress: 0 },
        { id: 4, title: 'Город золота', available: false, progress: 0 }
      ]
    },
    {
      id: 2,
      title: 'Проклятие фараона',
      avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/asiyajavayant.png',
      author: 'Мастер Елена',
      status: 'Завершено',
      description: 'Раскройте тайны древней пирамиды и снимите тысячелетнее проклятие.',
      chapters: [
        { id: 1, title: 'Вход в пирамиду', available: true, progress: 100 },
        { id: 2, title: 'Лабиринт смерти', available: true, progress: 100 },
        { id: 3, title: 'Гробница фараона', available: true, progress: 100 }
      ]
    },
    {
      id: 3,
      title: 'Логово дракона',
      avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/onyamalimba.png',
      author: 'Мастер Алексей',
      status: 'В разработке',
      description: 'Спасите королевство от древнего дракона, пробудившегося ото сна.',
      chapters: [
        { id: 1, title: 'Сборы в поход', available: true, progress: 25 },
        { id: 2, title: 'Перевал дракона', available: false, progress: 0 },
        { id: 3, title: 'Логово', available: false, progress: 0 }
      ]
    },
    {
      id: 4,
      title: 'Тайна ледяного замка',
      avatar: 'https://primefaces.org/cdn/primeng/images/demo/avatar/ionibowcher.png',
      author: 'Мастер Ольга',
      status: 'Активно',
      description: 'Раскройте тайну вечной зимы, сковавшей северное королевство.',
      chapters: [
        { id: 1, title: 'Путь на север', available: true, progress: 100 },
        { id: 2, title: 'Ледяные пещеры', available: true, progress: 60 },
        { id: 3, title: 'Замок Ледяной королевы', available: false, progress: 0 }
      ]
    }
  ];

  statusOptions = [
    { name: 'Все', value: 'all' },
    { name: 'Активно', value: 'active' },
    { name: 'Завершено', value: 'completed' },
    { name: 'В разработке', value: 'in-progress' }
  ];

  menuItems: MenuItem[] = [
    {
      label: 'Действия',
      items: [
        {
          label: 'Дублировать',
          icon: 'pi pi-copy'
        },
        {
          label: 'Архивировать',
          icon: 'pi pi-box'
        },
        {
          label: 'Экспортировать',
          icon: 'pi pi-download'
        },
        {
          separator: true
        },
        {
          label: 'Удалить',
          icon: 'pi pi-trash',
          styleClass: 'text-red-500'
        }
      ]
    }
  ];

  getStatusSeverity(status: string) {
    switch (status) {
      case 'Активно':
        return 'success';
      case 'Завершено':
        return 'info';
      case 'В разработке':
        return 'warning';
      default:
        return null;
    }
  }
  db = inject(Database).db;
  adventures = resource({
    loader: async () => {
      const [result] = await this.db.query<TAdventure[]>(
        'select id, name, owner.id, owner.name, owner.email from adventures'
      );
      return result;
    },
  })
  constructor() {
    effect(() => {
      console.table(this.adventures.value());
    });
  }
  async createAdventure(input:HTMLInputElement){
    const name = input.value;
    await this.db.insert('adventures', {name});
    this.adventures.reload();
    input.value = '';
  }
}
