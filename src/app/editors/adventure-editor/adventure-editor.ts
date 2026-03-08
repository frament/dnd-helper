import {Component, computed, inject, input, output} from '@angular/core';
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
import {ImageSignalHelper} from '../../helpers/image-signal.helper';
import {FileSignalHelperNew} from '../../helpers/file-signal-new.helper';
import {Database} from '../../database';

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
  db = inject(Database);
  imageObjectName = computed(() => this.item().id.id+'_image');
  image = new FileSignalHelperNew('adventure', this.imageObjectName, this.db, {maxSize:10*1024*1024});
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

  addTag(tag: string) {
    if (!this.sig['tags']()?.includes(tag)) {
      this.sig['tags'].update(x => [...x, tag]);
    }
  }
}
