import {Component, input, output} from '@angular/core';
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
import {SelectModule} from 'primeng/select';

@Component({
  selector: 'app-map-editor',
  templateUrl: './map-editor.html',
  styleUrls: ['./map-editor.css'],
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
    SelectModule
  ]
})
export class MapEditorComponent {
  map = input<any>({
    id: '',
    title: 'Новая карта',
    type: 'region',
    scale: 1000,
    width: 500,
    height: 400,
    description: '',
    tags: [],
    imageUrl: null
  });

  save = output<any>();
  delete = output<void>();
  export = output<void>();

  uploading = false;
  uploadProgress = 0;
  selectedLayer: any;

  mapTypes = [
    { label: 'Регион', value: 'region' },
    { label: 'Город', value: 'city' },
    { label: 'Подземелье', value: 'dungeon' },
    { label: 'Здание', value: 'building' },
    { label: 'План сражения', value: 'battle' },
    { label: 'Мировая карта', value: 'world' }
  ];

  layers = [
    { id: 1, name: 'Основной слой', icon: 'pi pi-map', visible: true },
    { id: 2, name: 'Метки', icon: 'pi pi-tag', visible: true },
    { id: 3, name: 'Секретные зоны', icon: 'pi pi-lock', visible: false },
    { id: 4, name: 'Ловушки', icon: 'pi pi-bolt', visible: true },
    { id: 5, name: 'Сокровища', icon: 'pi pi-star', visible: true },
    { id: 6, name: 'NPC', icon: 'pi pi-user', visible: true }
  ];

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        // this.messageService.add({
        //   severity: 'error',
        //   summary: 'Ошибка',
        //   detail: 'Файл слишком большой. Максимальный размер: 10MB'
        // });
        return;
      }

      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        /*this.messageService.add({
          severity: 'error',
          summary: 'Ошибка',
          detail: 'Неподдерживаемый формат изображения'
        });*/
        return;
      }

      this.uploading = true;
      this.uploadProgress = 0;

      // Имитация загрузки с прогрессом
      const interval = setInterval(() => {
        this.uploadProgress += 10;
        if (this.uploadProgress >= 100) {
          clearInterval(interval);
          this.processImage(file);
        }
      }, 200);
    }
  }

  processImage(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.map().imageUrl = e.target.result;
      this.uploading = false;
      /*this.messageService.add({
        severity: 'success',
        summary: 'Успешно',
        detail: 'Изображение загружено'
      });*/
    };
    reader.readAsDataURL(file);
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      const fakeEvent = { target: { files: [file] } };
      this.onFileSelected(fakeEvent as any);
    }
  }

  removeImage() {
    this.map().imageUrl = null;
    /*this.messageService.add({
      severity: 'info',
      summary: 'Изображение удалено',
      detail: 'Карта больше не содержит изображения'
    });*/
  }

  openImageLibrary() {
    /*this.messageService.add({
      severity: 'info',
      summary: 'Библиотека изображений',
      detail: 'Функция будет реализована в следующем обновлении'
    });*/
  }

  saveMap() {
    if (!this.map().title) {
      /*this.messageService.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: 'Введите название карты'
      });*/
      return;
    }

    /*this.messageService.add({
      severity: 'success',
      summary: 'Сохранено',
      detail: 'Карта успешно сохранена'
    });*/

    this.save.emit(this.map);
  }

  deleteMap() {
    /*this.messageService.add({
      severity: 'warn',
      summary: 'Удаление',
      detail: 'Карта будет удалена. Вы уверены?',
      life: 5000,
      sticky: true,
      data: {
        confirm: () => {
          this.delete.emit();
          this.messageService.clear();
        },
        cancel: () => this.messageService.clear()
      }
    });*/
  }

  exportMap() {
    /*this.messageService.add({
      severity: 'info',
      summary: 'Экспорт карты',
      detail: 'Функция экспорта в разработке'
    });*/
    this.export.emit();
  }
}
