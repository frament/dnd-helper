import {Component, computed, inject, input, output, signal} from '@angular/core';
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
import {ImageSignalHelper} from '../../helpers/image-signal.helper';

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
  imageObjectName = computed(() => this.item().id.id+'_image');
  image = new ImageSignalHelper(
    'map', this.imageObjectName, this.filesService,
    {maxSize:  10 * 1024 * 1024, allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp']}
  );
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
      await this.image.onFileSelected(fakeEvent as any);
    }
  }
}
