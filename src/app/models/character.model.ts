// character.model.ts
export type Character = {
  id?: string;
  name: string;
  level: number;
  class: string;
  race: string;
  background: string;
  alignment: string;
  experiencePoints: number;

  // Основные характеристики
  abilities_strength: number;
  abilities_dexterity: number;
  abilities_constitution: number;
  abilities_intelligence: number;
  abilities_wisdom: number;
  abilities_charisma: number;


  // Боевые параметры
  combat: {
    armorClass: number;
    initiative: number;
    speed: number;
    hitPoints: {
      current: number;
      maximum: number;
      temporary: number;
    };
    hitDice: string;
  };

  // Навыки
  skills: Skill[];

  // Умения и особенности
  features: Feature[];

  // Снаряжение
  equipment: EquipmentItem[];

  // Заклинания (если есть)
  spells: Spell[];

  // Внешность и история
  description: {
    age: string;
    height: string;
    weight: string;
    eyes: string;
    skin: string;
    hair: string;
    appearance: string;
    backstory: string;
  };
}

export interface Skill {
  name: string;
  ability: string;
  proficient: boolean;
  expertise: boolean;
  bonus: number;
}

export interface Feature {
  name: string;
  description: string;
  source: string;
}

export interface EquipmentItem {
  name: string;
  quantity: number;
  weight: number;
  description: string;
  equipped: boolean;
}

export interface Spell {
  name: string;
  level: number;
  school: string;
  preparation: boolean;
  description: string;
}
