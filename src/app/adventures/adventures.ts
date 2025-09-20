import {Component, inject, resource} from '@angular/core';
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
import {Router} from '@angular/router';
import {TUser} from '../user/user';

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

  statusOptions = [
    { name: 'Все', value: 'all' },
    { name: 'Активно', value: 'active' },
    { name: 'Завершено', value: 'completed' },
    { name: 'В разработке', value: 'in-progress' }
  ];

  currentMenuAdventure: TAdventure | undefined;

  menuItems: MenuItem[] = [
    {
      label: 'Действия',
      items: [
        /*{
          label: 'Архивировать',
          icon: 'pi pi-box'
        },
        {
          label: 'Экспортировать',
          icon: 'pi pi-download'
        },
        {
          separator: true
        },*/
        {
          label: 'Удалить',
          icon: 'pi pi-trash',
          styleClass: 'text-red-500',
          command: async () => {
            if (!this.currentMenuAdventure) return;
            await this.db.delete(this.currentMenuAdventure.id);
            this.adventures.reload();
          }
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
  router = inject(Router);
  owners:{[id:string]:TUser} = {}
  adventures = resource<TAdventure[], undefined>({
    loader: async () => {
      const result = await this.db.select<TAdventure>('adventures');
      for (const adventure of result) {
        const uid = adventure.owner.toString();
        if (this.owners[uid]) continue;
        this.owners[uid] = await this.db.select<TUser>(adventure.owner);
      }
      return result;
    },
  })
  async createAdventure(input:HTMLInputElement){
    const name = input.value;
    await this.db.insert('adventures', {name});
    this.adventures.reload();
    input.value = '';
  }

  async gotoAdventure(adventure: TAdventure){
    await this.router.navigate(['adventures',adventure.id.id]);
  }
}
