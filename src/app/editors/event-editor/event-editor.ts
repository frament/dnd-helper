import {Component, input, output} from '@angular/core';
import {EntityEditorBase} from '../../uni-components/entity-editor-base';
import {TEvent} from '../../models/event.model';
import {AutoComplete} from 'primeng/autocomplete';
import {DatePicker} from 'primeng/datepicker';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {MultiSelect} from 'primeng/multiselect';
import {Rating} from 'primeng/rating';
import {Tag} from 'primeng/tag';
import {Textarea} from 'primeng/textarea';

@Component({
  selector: 'app-event-editor',
  imports: [
    AutoComplete,
    DatePicker,
    FormsModule,
    InputText,
    MultiSelect,
    Rating,
    Tag,
    Textarea
  ],
  templateUrl: './event-editor.html',
  styleUrl: './event-editor.css'
})
export class EventEditor extends EntityEditorBase<TEvent>{
  item = input.required<TEvent>();
  patch = output<Partial<TEvent|null>>();
  constructor() {super();}

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

  addTag(tag: string) {
    if (!this.sig["tags"]()?.includes(tag)) {
      this.sig["tags"].update(x => [...x, tag]);
    }
  }
}
