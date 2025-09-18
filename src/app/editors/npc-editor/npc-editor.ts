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
import {AvatarModule} from 'primeng/avatar';
import {CheckboxModule} from 'primeng/checkbox';
import {EditorModule} from 'primeng/editor';
import {SelectModule} from 'primeng/select';
import {EntityEditorBase} from '../../uni-components/entity-editor-base';
import {TNPC} from '../../models/npc.model';

@Component({
  selector: 'app-npc-editor',
  templateUrl: './npc-editor.html',
  styleUrls: ['./npc-editor.css'],
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
    AvatarModule,
    CheckboxModule,
    EditorModule,
    SelectModule,
  ]
})
export class NpcEditor extends EntityEditorBase<TNPC>{
  item = input.required<TNPC>();
  patch = output<Partial<TNPC|null>>()
  constructor() {
    super();
  }

  uploading = signal<boolean>(false);

  races = [
    { label: 'Человек', value: 'human' },
    { label: 'Эльф', value: 'elf' },
    { label: 'Дварф', value: 'dwarf' },
    { label: 'Полуэльф', value: 'half-elf' },
    { label: 'Халфлинг', value: 'halfling' },
    { label: 'Гном', value: 'gnome' },
    { label: 'Драконорождённый', value: 'dragonborn' },
    { label: 'Тифлинг', value: 'tiefling' },
    { label: 'Полуорк', value: 'half-orc' }
  ];

  classes = [
    { label: 'Воин', value: 'fighter' },
    { label: 'Волшебник', value: 'wizard' },
    { label: 'Жрец', value: 'cleric' },
    { label: 'Плут', value: 'rogue' },
    { label: 'Варвар', value: 'barbarian' },
    { label: 'Бард', value: 'bard' },
    { label: 'Друид', value: 'druid' },
    { label: 'Монах', value: 'monk' },
    { label: 'Паладин', value: 'paladin' },
    { label: 'Следопыт', value: 'ranger' },
    { label: 'Чародей', value: 'sorcerer' },
    { label: 'Колдун', value: 'warlock' }
  ];

  alignments = [
    { label: 'Законно-добрый', value: 'lawful-good' },
    { label: 'Нейтрально-добрый', value: 'neutral-good' },
    { label: 'Хаотично-добрый', value: 'chaotic-good' },
    { label: 'Законно-нейтральный', value: 'lawful-neutral' },
    { label: 'Истинно нейтральный', value: 'true-neutral' },
    { label: 'Хаотично-нейтральный', value: 'chaotic-neutral' },
    { label: 'Законно-злой', value: 'lawful-evil' },
    { label: 'Нейтрально-злой', value: 'neutral-evil' },
    { label: 'Хаотично-злой', value: 'chaotic-evil' }
  ];

  sizes = [
    { label: 'Крошечный', value: 'tiny' },
    { label: 'Маленький', value: 'small' },
    { label: 'Средний', value: 'medium' },
    { label: 'Большой', value: 'large' },
    { label: 'Огромный', value: 'huge' },
    { label: 'Громадный', value: 'gargantuan' }
  ];

  creatureTypes = [
    'Аберрация', 'Зверь', 'Небожитель', 'Конструкт', 'Дракон',
    'Элементаль', 'Фея', 'Великан', 'Гуманоид', 'Чудовище',
    'Растение', 'Нежить', 'Исчадие'
  ];

  skills = [
    { name: 'athletics', label: 'Атлетика', ability: 'strength', proficient: false },
    { name: 'acrobatics', label: 'Акробатика', ability: 'dexterity', proficient: false },
    { name: 'sleightOfHand', label: 'Ловкость рук', ability: 'dexterity', proficient: false },
    { name: 'stealth', label: 'Скрытность', ability: 'dexterity', proficient: false },
    { name: 'arcana', label: 'Магия', ability: 'intelligence', proficient: false },
    { name: 'history', label: 'История', ability: 'intelligence', proficient: false },
    { name: 'investigation', label: 'Анализ', ability: 'intelligence', proficient: false },
    { name: 'nature', label: 'Природа', ability: 'intelligence', proficient: false },
    { name: 'religion', label: 'Религия', ability: 'intelligence', proficient: false },
    { name: 'animalHandling', label: 'Уход за животными', ability: 'wisdom', proficient: false },
    { name: 'insight', label: 'Проницательность', ability: 'wisdom', proficient: false },
    { name: 'medicine', label: 'Медицина', ability: 'wisdom', proficient: false },
    { name: 'perception', label: 'Восприятие', ability: 'wisdom', proficient: false },
    { name: 'survival', label: 'Выживание', ability: 'wisdom', proficient: false },
    { name: 'deception', label: 'Обман', ability: 'charisma', proficient: false },
    { name: 'intimidation', label: 'Запугивание', ability: 'charisma', proficient: false },
    { name: 'performance', label: 'Выступление', ability: 'charisma', proficient: false },
    { name: 'persuasion', label: 'Убеждение', ability: 'charisma', proficient: false }
  ];
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
/*        this.messageService.add({
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
 /*         this.messageService.add({
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
/*    this.messageService.add({
      severity: 'info',
      summary: 'Изображение удалено',
      detail: 'NPC больше не имеет изображения'
    });*/
  }

  openImageLibrary() {
/*    this.messageService.add({
      severity: 'info',
      summary: 'Библиотека изображений',
      detail: 'Функция будет реализована в будущем'
    });*/
  }

  calculateModifier(abilityScore: number): string {
    const modifier = Math.floor((abilityScore - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  }

  calculateSkillModifier(skill: any): string {
    const abilityScore = this.sig['stats_'+skill.ability]();
    const modifier = Math.floor((abilityScore - 10) / 2);
    const proficiencyBonus = skill.proficient ? 2 : 0;
    const total = modifier + proficiencyBonus;
    return total >= 0 ? `+${total}` : `${total}`;
  }
}
