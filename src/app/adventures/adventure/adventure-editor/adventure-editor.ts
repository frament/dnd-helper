import {Component, effect, input, OnInit, output} from '@angular/core';
import {TAdventure} from '../../../models/adventure.model';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {TagModule} from 'primeng/tag';
import {ToggleSwitchModule} from 'primeng/toggleswitch';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {SelectModule} from 'primeng/select';
import {deepCompare} from '../../../helpers/obj-diff-helper';
import {deepClone} from '../../../helpers/clone-helper';

@Component({
  selector: 'app-adventure-editor',
  imports: [
    FormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    AutoCompleteModule,
    TagModule,
    ToggleSwitchModule,
    ProgressSpinnerModule,
    SelectModule
  ],
  templateUrl: './adventure-editor.html',
  styleUrl: './adventure-editor.css'
})
export class AdventureEditor {
  readonly adventure = input.required<TAdventure>();
  _adventure!: TAdventure;
  readonly patch = output<Partial<TAdventure|null>>();
  save = output<Partial<TAdventure>>();
  cancel = output<void>();
  uploading = false;
  popularTags = [
    'подземелье', 'исследование', 'битва', 'тайна', 'политика',
    'выживание', 'квест', 'город', 'путешествие', 'магия'
  ];
  adventureTypeOptions = [
    { label: 'Однодневное приключение', value: 'one-shot' },
    { label: 'Кампания', value: 'campaign' },
    { label: 'Эпизод', value: 'episode' },
    { label: 'Сценарий', value: 'scenario' },
    { label: 'Квест', value: 'quest' }
  ];
  constructor() {
    effect(() => {
      if (!this.adventure()) return;
      this._adventure = deepClone(this.adventure());
    });
  }

  getPatch(){
    const patch = deepCompare(this.adventure(), this._adventure);
    console.log(patch);
    this.patch.emit(patch);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        /*this.messageService.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Файл слишком большой. Максимальный размер: 10MB'
        });*/
        return;
      }

      this.uploading = true;

      // Имитация загрузки на сервер
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          // this._adventure.coverImage = e.target.result;
          this.uploading = false;
          /*this.messageService.add({
            severity: 'success',
            summary: 'Успешно',
            detail: 'Обложка загружена'
          });*/
        };
        reader.readAsDataURL(file);
      }, 1500);
    }
  }

  removeImage() {
    // this.adventure.coverImage = null;
   /* this.messageService.add({
      severity: 'info',
      summary: 'Обложка удалена',
      detail: 'Приключение больше не имеет обложки'
    });*/
  }

  openImageLibrary() {
    /*this.messageService.add({
      severity: 'info',
      summary: 'Библиотека изображений',
      detail: 'Функция будет реализована в будущем'
    });*/
  }

  addTag(tag: string) {
    if (!this._adventure.tags?.includes(tag)) {
      if (!this._adventure.tags) this._adventure.tags = [];
      this._adventure.tags.push(tag);
      this.getPatch()
    }
  }

  saveSettings() {
    if (!this._adventure.name) {
      /*this.messageService.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Введите название приключения'
      });*/
      return;
    }

    /*this.messageService.add({
      severity: 'success',
      summary: 'Сохранено',
      detail: 'Настройки приключения сохранены'
    });*/

    this.save.emit(this._adventure);
  }

  cancelChanges() {
    /*this.messageService.add({
      severity: 'info',
      summary: 'Изменения отменены',
      detail: 'Все несохраненные изменения отменены'
    });*/

    this.cancel.emit();
  }
}
