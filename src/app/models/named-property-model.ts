export interface NamedProperty {
  id: string;
  name: string;
  description: string;
  charges: ChargeValue;
  tags: string[];
  recharge: RechargeType;
  dice?: DiceValue;
}

export interface ChargeValue {
  type: 'fixed' | 'proficiency' | 'ability';
  value?: number;
  ability?: AbilityType;
  bonus?: number;
  addProficiency?: boolean;
}

export interface DiceValue {
  diceType: DiceType;
  count: number;
  addProficiency: boolean;
  modifier?: AbilityType;
  bonus?: number;
}

export type RechargeType = 'long-rest' | 'short-rest' | 'none';

export type AbilityType = 'strength' | 'dexterity' | 'constitution' | 'intelligence' | 'wisdom' | 'charisma';

export type DiceType = 'd2' | 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20' | 'd100';

export const DICE_TYPES: { value: DiceType; label: string }[] = [
  { value: 'd2', label: 'к2' },
  { value: 'd4', label: 'к4' },
  { value: 'd6', label: 'к6' },
  { value: 'd8', label: 'к8' },
  { value: 'd10', label: 'к10' },
  { value: 'd12', label: 'к12' },
  { value: 'd20', label: 'к20' },
  { value: 'd100', label: 'к100' }
];

export const ABILITY_TYPES: { value: AbilityType; label: string }[] = [
  { value: 'strength', label: 'Сила' },
  { value: 'dexterity', label: 'Ловкость' },
  { value: 'constitution', label: 'Телосложение' },
  { value: 'intelligence', label: 'Интеллект' },
  { value: 'wisdom', label: 'Мудрость' },
  { value: 'charisma', label: 'Харизма' }
];

export const RECHARGE_TYPES: { value: RechargeType; label: string }[] = [
  { value: 'long-rest', label: 'Долгий отдых' },
  { value: 'short-rest', label: 'Короткий отдых' },
  { value: 'none', label: 'Не задано' }
];
