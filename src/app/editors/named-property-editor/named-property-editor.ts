import {Component, ElementRef, input, output, ViewChild} from '@angular/core';
import {NamedProperty, RECHARGE_TYPES} from '../../models/named-property-model';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-named-property-editor',
  imports: [
    FormsModule
  ],
  templateUrl: './named-property-editor.html',
  styleUrl: './named-property-editor.css'
})
export class NamedPropertyEditor {
  property = input<NamedProperty>({
    id: '',
    name: '',
    description: '',
    charges: {
      type: 'fixed',
      value: 1
    },
    tags: [],
    recharge: 'none'
  });

  save = output<NamedProperty>();
  cancel = output<void>();

  @ViewChild('editor') editorRef!: ElementRef;

  showDiceEditor: boolean = false;
  showDiceDialog: boolean = false;

  popularTags = [
    'магическое', 'физическое', 'умение', 'заклинание', 'способность',
    'атака', 'защита', 'утилита', 'бафф', 'дебафф'
  ];

  rechargeTypes = RECHARGE_TYPES;

  ngOnInit(): void {
    this.showDiceEditor = !!this.property().dice;
  }

  addTag(tag: string): void {
    if (!this.property().tags.includes(tag)) {
      this.property().tags = [...this.property().tags, tag];
    }
  }

  addDice(): void {
    this.property().dice = {
      diceType: 'd6',
      count: 1,
      addProficiency: false
    };
    this.showDiceEditor = true;
  }

  removeDice(): void {
    this.property().dice = undefined;
    this.showDiceEditor = false;
  }

  insertDiceReference(): void {
    this.showDiceDialog = true;
  }

  insertDice(): void {
    if (this.property().dice) {
      const dicePreview = this.getDicePreview();
      const diceHtml = `<span class="dice-reference" data-dice="${JSON.stringify(this.property().dice)}">${dicePreview}</span>`;

      // Здесь должна быть логика вставки в редактор
      // Это упрощенная версия - в реальном приложении нужно использовать API редактора
      this.property().description += diceHtml;
    }
    this.showDiceDialog = false;
  }

  insertTooltip(): void {
    const tooltipHtml = `<span class="tooltip" data-tooltip="Текст подсказки">текст с подсказкой</span>`;
    this.property().description += tooltipHtml;
  }

  getRechargeLabel(): string {
    return this.rechargeTypes.find(r => r.value === this.property().recharge)?.label || 'Не задано';
  }

  getChargesPreview(): string {
    const charges = this.property().charges;
    switch (charges.type) {
      case 'fixed':
        return charges.value?.toString() || '0';
      case 'proficiency':
        return `Бонус владения${charges.bonus ? ` + ${charges.bonus}` : ''}`;
      case 'ability':
        const ability = this.getAbilityLabel(charges.ability);
        return `Модификатор ${ability}${charges.bonus ? ` + ${charges.bonus}` : ''}`;
      default:
        return 'Не задано';
    }
  }

  getDicePreview(): string {
    if (!this.property().dice) return 'Не задано';

    const dice = this.property().dice || {} as any;
    const dicePart = `${dice.count}${dice.diceType.toUpperCase()}`;

    let bonusParts: string[] = [];

    if (dice.addProficiency) {
      bonusParts.push('БВ');
    }

    if (dice.modifier) {
      const ability = this.getAbilityLabel(dice.modifier);
      bonusParts.push(ability);
    }

    if (dice.bonus) {
      bonusParts.push(`${dice.bonus > 0 ? '+' : ''}${dice.bonus}`);
    }

    const bonusString = bonusParts.length > 0 ? ` + ${bonusParts.join(' + ')}` : '';

    return `${dicePart}${bonusString}`;
  }

  private getAbilityLabel(ability?: string): string {
    const abilities: { [key: string]: string } = {
      strength: 'Сил',
      dexterity: 'Лов',
      constitution: 'Тел',
      intelligence: 'Инт',
      wisdom: 'Мдр',
      charisma: 'Хар'
    };
    return ability ? abilities[ability] || ability : '';
  }

  saveMe(): void {
    this.save.emit(this.property());
  }

  cancelEdit(): void {
    this.cancel.emit();
  }
}
