import {Component, input, output, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {InputTextModule} from 'primeng/inputtext';
import {InputNumberModule} from 'primeng/inputnumber';
import {ListboxModule} from 'primeng/listbox';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {ButtonModule} from 'primeng/button';
import {TextareaModule} from 'primeng/textarea';
import {ToggleSwitchModule} from 'primeng/toggleswitch';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {TooltipModule} from 'primeng/tooltip';
import {SelectButtonModule} from 'primeng/selectbutton';
import {EditorModule} from 'primeng/editor';
import {SelectModule} from 'primeng/select';
import {EntityEditorBase} from '../../../uni-components/entity-editor-base';
import {TArtifact} from '../../../models/artifact.model';

@Component({
  selector: 'app-artifact-editor',
  templateUrl: './artifact-editor.html',
  styleUrls: ['./artifact-editor.css'],
  imports: [
    FormsModule,
    InputTextModule,
    InputNumberModule,
    ListboxModule,
    AutoCompleteModule,
    ButtonModule,
    TextareaModule,
    ToggleSwitchModule,
    ProgressSpinnerModule,
    TooltipModule,
    SelectButtonModule,
    EditorModule,
    SelectModule
  ],
})
export class ArtifactEditorComponent extends EntityEditorBase<TArtifact>{
  item = input.required<TArtifact>()
  patch = output<Partial<TArtifact|null>>()
  constructor() {
    super();
  }

  uploading = signal<boolean>(false);

  artifactTypes = [
    { label: 'Оружие', value: 'weapon' },
    { label: 'Доспех', value: 'armor' },
    { label: 'Кольцо', value: 'ring' },
    { label: 'Посох', value: 'staff' },
    { label: 'Жезл', value: 'wand' },
    { label: 'Свиток', value: 'scroll' },
    { label: 'Зелье', value: 'potion' },
    { label: 'Амулет', value: 'amulet' },
    { label: 'Инструмент', value: 'tool' },
    { label: 'Реликвия', value: 'relic' },
    { label: 'Книга', value: 'book' },
    { label: 'Артефакт', value: 'artifact' }
  ];

  rarities = [
    { label: 'Обычный', value: 'common' },
    { label: 'Необычный', value: 'uncommon' },
    { label: 'Редкий', value: 'rare' },
    { label: 'Очень редкий', value: 'very-rare' },
    { label: 'Легендарный', value: 'legendary' },
    { label: 'Артефакт', value: 'artifact' }
  ];

  attunementOptions = [
    { label: 'Не требуется', value: 'no' },
    { label: 'Требуется', value: 'yes' },
    { label: 'Требуется (спец.)', value: 'special' }
  ];

  rechargeOptions = [
    { label: 'Не восстанавливается', value: 'none' },
    { label: 'На рассвете', value: 'dawn' },
    { label: 'В полнолуние', value: 'full-moon' },
    { label: 'После длинного отдыха', value: 'long-rest' },
    { label: 'После короткого отдыха', value: 'short-rest' },
    { label: 'По желанию владельца', value: 'owner-will' }
  ];

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
          this.sig['imageUrl'].set(e.target.result);
          this.uploading.set(false);
          /*this.messageService.add({
            severity: 'success',
            summary: 'Успешно',
            detail: 'Изображение загружено'
          });*/
        };
        reader.readAsDataURL(file);
      }, 1000);
    }
  }

  removeImage() {
    this.sig['imageUrl'].set('');
    /*this.messageService.add({
      severity: 'info',
      summary: 'Изображение удалено',
      detail: 'Артефакт больше не имеет изображения'
    });*/
  }

  openImageLibrary() {
    /*this.messageService.add({
      severity: 'info',
      summary: 'Библиотека изображений',
      detail: 'Функция будет реализована в будущем'
    });*/
  }

  addAbility() {
    /*this.artifact().specialAbilities.push({
      name: '',
      description: ''
    });*/
  }

  removeAbility(_index: number) {
    // this.artifact().specialAbilities.splice(index, 1);
  }
}
