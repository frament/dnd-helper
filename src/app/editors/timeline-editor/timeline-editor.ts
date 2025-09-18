import {Component, inject, input, resource, signal} from '@angular/core';
import { MenuItem } from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {DatePipe} from '@angular/common';
import {TagModule} from 'primeng/tag';
import {FormsModule} from '@angular/forms';
import {DatePickerModule} from 'primeng/datepicker';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {RatingModule} from 'primeng/rating';
import {MultiSelectModule} from 'primeng/multiselect';
import {MenuModule} from 'primeng/menu';
import {Database} from '../../database';
import {TEvent} from '../../models/event.model';
import {EventEditor} from '../event-editor/event-editor';
import {deepClone} from '../../helpers/clone-helper';
import {Divider} from 'primeng/divider';

@Component({
  selector: 'app-timeline-editor',
  templateUrl: './timeline-editor.html',
  styleUrls: ['./timeline-editor.css'],
  imports: [
    ButtonModule,
    DatePipe,
    TagModule,
    FormsModule,
    DatePickerModule,
    AutoCompleteModule,
    RatingModule,
    MultiSelectModule,
    MenuModule,
    EventEditor,
    Divider
  ]
})
export class TimelineEditorComponent {
  adventureId = input.required<string>();
  readonly db = inject(Database);
  readonly events = resource<TEvent[], string>({
    params: () => this.adventureId(),
    loader: async ({params}) =>
      (await this.db.linked<TEvent>('adventures',['adventure_event','events'], [params]))
        .sort((a,b) => a.date.getTime() - b.date.getTime()),
    defaultValue: []
  })

  activeEventId = signal<string>('');
  activeEvent = signal<TEvent|undefined>(undefined);
  activeEventPatch = signal<Partial<TEvent>|null>(null);


  menuItems: MenuItem[] = [];

  selectEvent(eventId: string) {
    this.activeEventId.set(eventId);
    this.activeEvent.set(this.events.value().find(e => e.id.id === eventId));
  }

  async addEvent() {
    const [newItem] = await this.db.db.create<any, any>(
      'events',
      {title: 'Новое событие'}
    );
    await this.db.createLink(
      'adventures', this.adventureId(),
      'adventure_event',
      'events', newItem["id"].id+''
    )
    this.events.reload();
    this.selectEvent(newItem["id"].id+'');
  }

  cancelPatch(){
    const ent: TEvent = deepClone(this.activeEvent()!);
    this.activeEventPatch.set(null);
    this.activeEvent.set(undefined);
    this.activeEvent.set(ent);
  }

  async applyPatch() {
    if (!this.activeEventPatch() || !this.activeEvent()?.id) return;
    await this.db.db.merge(this.activeEvent()!.id, this.activeEventPatch()!);
    this.activeEventPatch.set(null);
    this.events.reload();
  }

  async deleteEvent(eventId:string) {
    await this.db.db.delete('events:'+eventId);
    this.events.reload();
  }

  openEventMenu(event: MouseEvent, timelineEvent: any) {
    event.stopPropagation();
    this.menuItems = [
      {
        label: 'Действия',
        items: [
          {
            label: 'Дублировать',
            icon: 'pi pi-copy',
            command: () => this.duplicateEvent(timelineEvent)
          },
          {
            separator: true
          },
          {
            label: 'Удалить',
            icon: 'pi pi-trash',
            styleClass: 'text-red-500',
            command: () => this.deleteEvent(timelineEvent.id)
          }
        ]
      }
    ];
  }

  duplicateEvent(event: any) {
    console.log('duplicate event', event);
  }
}
