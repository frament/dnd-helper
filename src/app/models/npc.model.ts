import {TBaseEntityWithOwner} from './base-entity.model';

export type TNPC = {
  class: string;
  level: number;
  alignment: string;
  size: string;
  creatureType: string;
  imageUrl: string;
  stats_strength: number;
  stats_dexterity: number;
  stats_constitution: number;
  stats_intelligence: number;
  stats_wisdom: number;
  stats_charisma: number;
  combat_armorClass: number;
  combat_speed: number;
  combat_hitPoints: number;
  appearance: string;
  personality: string;
  history: string;
  features: string;
  goals: string[];
} & TNPCreate & TBaseEntityWithOwner

export type TNPCreate = {
  name: string,
  race: string,
}


type t={
  name: 'Новый NPC',
  race: 'human',
  class: 'fighter',
  level: 1,
  alignment: 'neutral',
  size: 'medium',
  creatureType: 'humanoid',
  imageUrl: null,
  stats: {
    strength: 10,
    dexterity: 10,
    constitution: 10,
    intelligence: 10,
    wisdom: 10,
    charisma: 10
  },
  combat: {
    armorClass: 10,
    speed: 30,
    hitPoints: 10
  },
  description: {
    appearance: '',
    personality: '',
    history: ''
  },
  features: '',
  goals: []
}
