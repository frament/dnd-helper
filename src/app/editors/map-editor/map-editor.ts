import {Component, computed, inject, input, output, resource, signal} from '@angular/core';
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
import {TMap} from '../../models/map.model';
import {EntityEditorBase} from '../../uni-components/entity-editor-base';
import {MinioService} from '../../minio-service';

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
export class MapEditorComponent extends EntityEditorBase<TMap>{
  readonly item = input.required<TMap>();
  readonly patch = output<Partial<TMap|null>>();
  constructor() {
    super()
  }

  save = output<any>();
  delete = output<void>();
  export = output<void>();
  filesService = inject(MinioService);
  uploading = signal<boolean>(false);
  imageObjectName = computed(() => this.item().id.id+'_image');
  image = resource<string|undefined, string>({
    params: () => this.item().id.id+'',
    loader: async ({params}) => {
      if (!params) return undefined;
      const file = await this.filesService.downloadFile('map', this.imageObjectName());
      if (!file) return undefined;
      const result = await MinioService.fileAsString(file);
      this.uploading.set(false);
      return result;
    }
  });
  selectedLayer = signal<any>(undefined);

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

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        return;
      }

      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        return;
      }
      this.uploading.set(true);
      await this.filesService.uploadFile('map', file, this.imageObjectName());
      this.image.reload();
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'copy';
    }
  }

  async onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      const file = event.dataTransfer.files[0];
      const fakeEvent = { target: { files: [file] } };
      await this.onFileSelected(fakeEvent as any);
    }
  }

  async removeImage() {
    await this.filesService.deleteFile('map',this.imageObjectName());
    this.image.reload();
  }
}
