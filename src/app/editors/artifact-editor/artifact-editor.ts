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
import {SelectButtonModule} from 'primeng/selectbutton';
import {EditorModule} from 'primeng/editor';
import {SelectModule} from 'primeng/select';
import {EntityEditorBase} from '../../uni-components/entity-editor-base';
import {TArtifact} from '../../models/artifact.model';
import {MinioService} from '../../minio-service';

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
  filesService = inject(MinioService);
  uploading = signal<boolean>(false);
  imageObjectName = computed(() => this.item().id.id+'_image');
  image = resource<string|undefined, string>({
    params: () => this.item().id.id+'',
    loader: async ({params}) => {
      if (!params) return undefined;
      const file = await this.filesService.downloadFile('artifact', this.imageObjectName());
      if (!file) return undefined;
      const result = await MinioService.fileAsString(file);
      this.uploading.set(false);
      return result;
    }
  });

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

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        return;
      }
      this.uploading.set(true);
      await this.filesService.uploadFile('artifact', file, this.imageObjectName());
      this.image.reload();
    }
  }

  async removeImage() {
    await this.filesService.deleteFile('artifact',this.imageObjectName());
    this.image.reload();
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
