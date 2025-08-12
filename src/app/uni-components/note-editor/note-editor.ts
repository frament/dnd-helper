import {Component, input, OnInit, output} from '@angular/core';
import {Note} from './note';
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
import {DatePipe} from '@angular/common';
import {AutoCompleteModule} from 'primeng/autocomplete';

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
    DatePipe,
    AutoCompleteModule
  ],
  templateUrl: './note-editor.html',
  styleUrl: './note-editor.css'
})
export class NoteEditor implements OnInit {
  content = input<any>();
  save = output<Note>();

  note: Note = {
    id: '',
    title: '',
    content: '',
    tags: [],
    category: '',
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  lastSaved = new Date();
  saveInterval: any;

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

  ngOnInit() {
    if (this.content()) {
      this.note = {...this.content()};
    }

    // Автосохранение каждые 2 минуты
    this.saveInterval = setInterval(() => {
      this.autoSave();
    }, 120000);
  }

  ngOnDestroy() {
    if (this.saveInterval) {
      clearInterval(this.saveInterval);
    }
  }

  addTag(tag: string) {
    if (!this.note.tags.includes(tag)) {
      this.note.tags = [...this.note.tags, tag];
    }
  }

  countCharacters(): number {
    return this.note.content ?
      this.note.content.replace(/<[^>]*>/g, '').length : 0;
  }

  countWords(): number {
    return this.note.content ?
      this.note.content.replace(/<[^>]*>/g, '').trim().split(/\s+/).length : 0;
  }

  saveNote() {
    this.note.updatedAt = new Date();
    this.lastSaved = new Date();
    this.save.emit(this.note);
  }

  autoSave() {
    if (this.note.title || this.note.content) {
      this.note.updatedAt = new Date();
      this.lastSaved = new Date();
      console.log('Автосохранение заметки:', this.note);
      // Здесь должна быть логика сохранения в хранилище
    }
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
