import {Component, computed, inject, input, output, resource, signal} from '@angular/core';
import {TAdventure} from '../../models/adventure.model';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {TextareaModule} from 'primeng/textarea';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {TagModule} from 'primeng/tag';
import {ToggleSwitchModule} from 'primeng/toggleswitch';
import {ProgressSpinnerModule} from 'primeng/progressspinner';
import {SelectModule} from 'primeng/select';
import {EntityEditorBase} from '../../uni-components/entity-editor-base';
import {MinioService} from '../../minio-service';

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
export class AdventureEditor extends EntityEditorBase<TAdventure>{
  readonly item = input.required<TAdventure>();
  readonly patch = output<Partial<TAdventure|null>>();
  filesService = inject(MinioService);
  uploading = signal<boolean>(false);
  imageObjectName = computed(() => this.item().id.id+'_image');
  image = resource<string|undefined, string>({
    params: () => this.item().id.id+'',
    loader: async ({params}) => {
      if (!params) return undefined;
      const file = await this.filesService.downloadFile('adventure', this.imageObjectName());
      if (!file) return undefined;
      const result = await MinioService.fileAsString(file);
      this.uploading.set(false);
      return result;
    }
  });
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

  constructor() {super()}

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        return;
      }
      this.uploading.set(true);
      await this.filesService.uploadFile('adventure', file, this.imageObjectName());
      this.image.reload();
    }
  }

  async removeImage() {
    await this.filesService.deleteFile('adventure',this.imageObjectName());
    this.image.reload();
  }

  addTag(tag: string) {
    if (!this.sig['tags']()?.includes(tag)) {
      this.sig['tags'].update(x => [...x, tag]);
    }
  }
}
