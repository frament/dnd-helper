import {Component, computed, effect, input, output, signal} from '@angular/core';
import {TNote} from './TNote';
import {FormsModule} from '@angular/forms';
import { EditorModule } from 'primeng/editor';
import { SelectButtonModule } from 'primeng/selectbutton';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import {RippleModule} from 'primeng/ripple';
import {DatePickerModule} from 'primeng/datepicker';
import {SelectModule} from 'primeng/select';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {EntityEditorBase} from '../entity-editor-base';

@Component({
  selector: 'app-note-editor',
  imports: [
    FormsModule,
    EditorModule,
    SelectButtonModule,
    TagModule,
    ButtonModule,
    InputTextModule,
    MenuModule,
    RippleModule,
    DatePickerModule,
    SelectModule,
    AutoCompleteModule
  ],
  templateUrl: './note-editor.html',
  styleUrl: './note-editor.css'
})
export class NoteEditor extends EntityEditorBase<TNote>{
  readonly item = input.required<TNote>();
  readonly patch = output<Partial<TNote|null>>();
  statusOptions = [
    { label: 'Черновик', value: 'draft' },
    { label: 'В работе', value: 'in-progress' },
    { label: 'Завершено', value: 'completed' },
    { label: 'Архив', value: 'archived' }
  ];

  categories = [
    'Сюжет', 'Персонажи', 'Локации', 'Квесты', 'Артефакты', 'История', 'Идеи'
  ];

  popularTags = [
    'важно', 'идея', 'сюжет', 'NPC', 'игрок', 'магия', 'предмет', 'тайна', 'битва', 'диалог'
  ];

  constructor() {super()}

  countCharacters = computed(() => this.sig["content"]()?.replace(/<[^>]*>/g, '').length || 0);
  countWords = computed(() => this.sig["content"]()?.replace(/<[^>]*>/g, '').trim().split(/\s+/).length || 0);

  addTag(tag: string) {
    if (!this.sig["tags"]()?.includes(tag)) {
      this.sig["tags"].update(x => [...x, tag]);
    }
  }

  exportNote() {
    console.log('Экспорт заметки:', this.item());
    // Логика экспорта
  }

  duplicateNote() {
    console.log('Дублирование заметки:', this.item());
    // Логика дублирования
  }

  changeCategory() {
    console.log('Изменение категории заметки:', this.item());
    // Логика изменения категории
  }
}
