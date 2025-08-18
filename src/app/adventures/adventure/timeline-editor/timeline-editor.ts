import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import {ButtonModule} from 'primeng/button';
import {DatePipe} from '@angular/common';
import {TagModule} from 'primeng/tag';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {DatePickerModule} from 'primeng/datepicker';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {RatingModule} from 'primeng/rating';
import {MultiSelectModule} from 'primeng/multiselect';
import {MenuModule} from 'primeng/menu';
import {Textarea} from 'primeng/textarea';

@Component({
  selector: 'app-timeline-editor',
  templateUrl: './timeline-editor.html',
  styleUrls: ['./timeline-editor.css'],
  imports: [
    ButtonModule,
    DatePipe,
    TagModule,
    FormsModule,
    InputText,
    DatePickerModule,
    AutoCompleteModule,
    RatingModule,
    MultiSelectModule,
    MenuModule,
    Textarea
  ]
})
export class TimelineEditorComponent {
  events = [
    {
      id: 'event1',
      title: 'Начало экспедиции',
      date: new Date(2023, 5, 15),
      description: 'Экспедиция отправляется из столицы в поисках древнего артефакта',
      tags: ['экспедиция', 'начало'],
      importance: 3,
      relatedItems: ['adv1', 'hero1']
    },
    {
      id: 'event2',
      title: 'Обнаружение храма',
      date: new Date(2023, 6, 3),
      description: 'Команда обнаруживает древний храм, скрытый в джунглях',
      tags: ['храм', 'артефакт'],
      importance: 4,
      relatedItems: ['map1', 'loc1']
    },
    {
      id: 'event3',
      title: 'Встреча с шаманом',
      date: new Date(2023, 6, 10),
      description: 'Местный шаман рассказывает легенду о проклятии артефакта',
      tags: ['NPC', 'легенда'],
      importance: 3,
      relatedItems: ['npc1']
    },
    {
      id: 'event4',
      title: 'Активация артефакта',
      date: new Date(2023, 6, 18),
      description: 'Герои активируют древний артефакт, пробуждая древнее зло',
      tags: ['артефакт', 'кульминация'],
      importance: 5,
      relatedItems: ['art1', 'adv1']
    }
  ];

  activeEventId: string | null = null;
  activeEvent: any = null;

  popularTags = [
    'битва', 'исследование', 'диалог', 'тайна', 'головоломка',
    'квест', 'босс', 'подземелье', 'город', 'путешествие'
  ];

  relatedItems = [
    { name: 'Приключение: Потерянные земли', id: 'adv1' },
    { name: 'Герой: Эльрион', id: 'hero1' },
    { name: 'Карта джунглей', id: 'map1' },
    { name: 'Храм обезьяньего бога', id: 'loc1' },
    { name: 'Шаман Тумек', id: 'npc1' },
    { name: 'Артефакт Солнца', id: 'art1' }
  ];

  menuItems: MenuItem[] = [];
  selectedEvent: any = null;

  constructor() {}

  selectEvent(eventId: string) {
    this.activeEventId = eventId;
    this.activeEvent = {...this.events.find(e => e.id === eventId)};
  }

  addEvent() {
    const newEvent = {
      id: `event${Date.now()}`,
      title: 'Новое событие',
      date: new Date(),
      description: '',
      tags: [],
      importance: 3,
      relatedItems: []
    };

    this.events.push(newEvent);
    this.selectEvent(newEvent.id);
  }

  saveEvent() {
    if (!this.activeEvent) return;

    const index = this.events.findIndex(e => e.id === this.activeEvent.id);
    if (index !== -1) {
      this.events[index] = {...this.activeEvent};
    }

    // Здесь должна быть логика сохранения в хранилище
    console.log('Событие сохранено:', this.activeEvent);
  }

  deleteEvent(eventId: string) {
    this.events = this.events.filter(e => e.id !== eventId);

    if (this.activeEventId === eventId) {
      this.activeEventId = null;
      this.activeEvent = null;
    }
  }

  openEventMenu(event: MouseEvent, timelineEvent: any) {
    event.stopPropagation();
    this.selectedEvent = timelineEvent;

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
            label: 'Переместить вверх',
            icon: 'pi pi-arrow-up',
            command: () => this.moveEvent(timelineEvent.id, -1)
          },
          {
            label: 'Переместить вниз',
            icon: 'pi pi-arrow-down',
            command: () => this.moveEvent(timelineEvent.id, 1)
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

    // this.eventMenu.toggle(event);
  }

  duplicateEvent(event: any) {
    const newEvent = {
      ...event,
      id: `event${Date.now()}`,
      title: event.title + ' (копия)'
    };

    this.events.push(newEvent);
    this.selectEvent(newEvent.id);
  }

  moveEvent(eventId: string, direction: number) {
    const index = this.events.findIndex(e => e.id === eventId);
    if (index === -1) return;

    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= this.events.length) return;

    // Перемещаем событие
    [this.events[index], this.events[newIndex]] = [this.events[newIndex], this.events[index]];

    // Если перемещали активное событие, обновляем его ID
    if (this.activeEventId === eventId) {
      this.activeEventId = eventId; // ID не меняется, просто перерисовываем
    }
  }

  addTag(tag: string) {
    if (!this.activeEvent) return;

    if (!this.activeEvent.tags.includes(tag)) {
      this.activeEvent.tags = [...this.activeEvent.tags, tag];
    }
  }
}
