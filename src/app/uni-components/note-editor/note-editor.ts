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
import {deepClone} from '../../helpers/clone-helper';
import {deepCompare} from '../../helpers/obj-diff-helper';

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
export class NoteEditor {
  readonly note = input.required<TNote>();
  readonly patch = output<Partial<TNote|null>>();
  save = output<Partial<TNote>>();
  cancel = output<void>();

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

  constructor() {
    effect(() => {
      if(!this.note()) return;
      const note = deepClone(this.note());
      this._initial = note;
      this._title.set(note.title);
      this._content.set(note.content);
      this._tags.set(note.tags);
      this._category.set(note.category);
      this._status.set(note.status);
    });
    effect(() => {
      const patch = deepCompare(this.note(), {...this._initial,...this._note()});
      this.patch.emit(patch);
    });
  }

  _title = signal<string>('');
  _content = signal<string>('');
  _tags = signal<string[]>([]);
  _category = signal<string>('');
  _status = signal<"draft" | "in-progress" | "completed" | "archived" | undefined>(undefined);
  _initial: TNote|undefined;

  _note = computed<Partial<TNote>>(() => ({
    title: this._title(),
    content: this._content(),
    category: this._category(),
    status: this._status(),
    tags: this._tags(),
  }))

  addTag(tag: string) {
    if (!this._tags()?.includes(tag)) {
      this._tags.update(x => [...x, tag]);
    }
  }

  countCharacters(): number {
    return this._content()?.replace(/<[^>]*>/g, '').length || 0;
  }

  countWords(): number {
    return this._content()?.replace(/<[^>]*>/g, '').trim().split(/\s+/).length || 0;
  }

  exportNote() {
    console.log('Экспорт заметки:', this.note);
    // Логика экспорта
  }

  duplicateNote() {
    console.log('Дублирование заметки:', this.note);
    // Логика дублирования
  }

  changeCategory() {
    console.log('Изменение категории заметки:', this.note);
    // Логика изменения категории
  }
}
