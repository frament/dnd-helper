import {Component, input, model, output} from '@angular/core';
import {ABILITY_TYPES, ChargeValue, DICE_TYPES, DiceValue} from '../../models/named-property-model';
import {FormsModule} from '@angular/forms';
import {SelectButtonModule} from 'primeng/selectbutton';
import {InputNumberModule} from 'primeng/inputnumber';
import {CheckboxModule} from 'primeng/checkbox';
import {AutoCompleteModule} from 'primeng/autocomplete';

type ValueType = 'fixed' | 'proficiency' | 'ability';

@Component({
  selector: 'app-charge-dice-editor',
  imports: [
    FormsModule,
    SelectButtonModule,
    InputNumberModule,
    CheckboxModule,
    AutoCompleteModule
  ],
  templateUrl: './charge-dice-editor.html',
  styleUrl: './charge-dice-editor.css'
})
export class ChargeDiceEditor{
  label = input<string>('Значение');
  mode = input<'charge'|'dice'>('charge');
  minValue = input<number>(0);
  maxValue = input<number>(100);
  readonly value = model<ChargeValue>({type: 'fixed', value: 1});

  diceValue: DiceValue = {
    diceType: 'd6',
    count: 1,
    addProficiency: false
  };

  valueTypes = [
    { label: 'Фиксированное', value: 'fixed' },
    { label: 'Бонус владения', value: 'proficiency' },
    { label: 'Модификатор', value: 'ability' }
  ];

  abilityTypes = ABILITY_TYPES;
  diceTypes = DICE_TYPES;

  onTypeChange(type: "fixed" | "proficiency" | "ability"): void {
    switch (type){
      case 'fixed': this.patchValue({type, value: 1, ability:undefined, bonus: undefined}); break;
      case 'proficiency': this.patchValue({type, value: undefined, ability:undefined}); break;
      case 'ability': this.patchValue({type, value: undefined, ability:'strength'}); break;
    }
  }

  patchValue(patch:Partial<ChargeValue>): void {
    this.value.update(x => {
      let newValue = {...x, ...patch};
      if (this.mode() !== 'charge'){
        newValue = {...newValue, ...this.diceValue}
      }
      return newValue;
    })
  }

  getPreview(): string {
    if (this.mode() === 'charge') {
      return this.getChargePreview();
    } else {
      return this.getDicePreview();
    }
  }

  private getChargePreview(): string {
    switch (this.value().type) {
      case 'fixed':
        return this.value().value?.toString() || '0';
      case 'proficiency':
        const proficiency = this.value().addProficiency ? ' + Бонус владения' : '';
        const bonus = this.value().bonus ? ` + ${this.value().bonus}` : '';
        return `Бонус владения${proficiency}${bonus}`;
      case 'ability':
        const ability = this.abilityTypes.find(a => a.value === this.value().ability)?.label || '';
        const abilityBonus = this.value().bonus ? ` + ${this.value().bonus}` : '';
        return `Модификатор ${ability}${abilityBonus}`;
      default:
        return '';
    }
  }

  private getDicePreview(): string {
    const dicePart = `${this.diceValue.count}${this.diceValue.diceType.toUpperCase()}`;

    let bonusParts: string[] = [];

    if (this.diceValue.addProficiency) {
      bonusParts.push('Бонус владения');
    }

    if (this.value().type === 'ability' && this.value().ability) {
      const ability = this.abilityTypes.find(a => a.value === this.value().ability)?.label || '';
      bonusParts.push(`Модификатор ${ability}`);
    }

    if (this.value().bonus) {
      // @ts-ignore
      bonusParts.push(`${this.value().bonus > 0 ? '+' : ''}${this.value().bonus}`);
    }

    const bonusString = bonusParts.length > 0 ? ` + ${bonusParts.join(' + ')}` : '';

    return `${dicePart}${bonusString}`;
  }

  // ControlValueAccessor implementation
  writeValue(value: any): void {
    if (value) {
      if (this.mode() === 'charge') {
        this.patchValue({...value})
      } else {
        this.diceValue = { ...this.diceValue, ...value };
        this.value.set({
          type: value.type || 'fixed',
          ability: value.ability,
          bonus: value.bonus
        })
      }
    }
  }
}
