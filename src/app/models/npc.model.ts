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
