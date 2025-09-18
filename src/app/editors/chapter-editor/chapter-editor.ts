import {Component, computed, input, output, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {InputText} from 'primeng/inputtext';
import {SelectButtonModule} from 'primeng/selectbutton';
import {RatingModule} from 'primeng/rating';
import {InputNumberModule} from 'primeng/inputnumber';
import {ToggleSwitchModule} from 'primeng/toggleswitch';
import {AvatarModule} from 'primeng/avatar';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {ButtonModule} from 'primeng/button';
import {TextareaModule} from 'primeng/textarea';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {TagModule} from 'primeng/tag';
import {SelectModule} from 'primeng/select';
import {TChapter} from '../../models/chapter.model';
import {EntityEditorBase} from '../../uni-components/entity-editor-base';

@Component({
  selector: 'app-chapter-editor',
  imports: [
    FormsModule,
    InputText,
    SelectButtonModule,
    RatingModule,
    InputNumberModule,
    ToggleSwitchModule,
    AvatarModule,
    ProgressSpinnerModule,
    ButtonModule,
    TextareaModule,
    AutoCompleteModule,
    TagModule,
    SelectModule
  ],
  templateUrl: './chapter-editor.html',
  styleUrl: './chapter-editor.css'
})
export class ChapterEditor extends EntityEditorBase<TChapter>{
  item = input.required<TChapter>();
  readonly patch = output<Partial<TChapter|null>>();

  uploading = signal<boolean>(false);

  constructor() {super()}

  statusOptions = [
    { label: 'Черновик', value: 'draft', icon: 'pi pi-file' },
    { label: 'В разработке', value: 'in-progress', icon: 'pi pi-cog' },
    { label: 'Тестирование', value: 'testing', icon: 'pi pi-bug' },
    { label: 'Завершено', value: 'completed', icon: 'pi pi-check' },
    { label: 'Архив', value: 'archived', icon: 'pi pi-box' }
  ];

  popularTags = [
    'битва', 'исследование', 'диалог', 'тайна', 'головоломка',
    'квест', 'босс', 'подземелье', 'город', 'путешествие'
  ];

  getDifficultyText = computed(() => {
    switch(this.sig['difficulty']()) {
      case 1: return 'Очень легко';
      case 2: return 'Легко';
      case 3: return 'Средне';
      case 4: return 'Сложно';
      case 5: return 'Очень сложно';
      default: return 'Не указано';
    }
  })

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        /*this.messageService.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Файл слишком большой. Максимальный размер: 5MB'
        });*/
        return;
      }

      this.uploading.set(true);

      // Имитация загрузки на сервер
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.sig['avatar'].set(e.target.result);
          this.uploading.set(false);
          /*this.messageService.add({
            severity: 'success',
            summary: 'Успешно',
            detail: 'Изображение загружено'
          });*/
        };
        reader.readAsDataURL(file);
      }, 1500);
    }
  }

  removeImage() {
    this.sig['avatar'].set('');
  }

  openImageLibrary() {
    /*this.messageService.add({
      severity: 'info',
      summary: 'Библиотека изображений',
      detail: 'Функция будет реализована в будущем'
    });*/
  }

  addTag(tag: string) {
    if (!this.sig['tags']().includes(tag)) {
      this.sig['tags'].update(x => [...x, tag]);
    }
  }

}
