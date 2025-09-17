import {TBaseEntityWithOwner} from './base-entity.model';

export type TArtifact = {
  type: string,
  rarity: string,
  attunement: string,
  weight: number,
  value: number,
  description: string,
  properties: string,
  charges_current: number,
  charges_max: number,
  charges_recharge: string,
  curse: string,
  specialAbilities: any[],
  history_creation: string,
  history_owners: any[],
  history_significantEvents: string,
  history_currentLocation: string,
  history_legend: string,
  goals: string[],
  imageUrl: string
} & TArtifactCreate & TBaseEntityWithOwner;

export type TArtifactCreate = {
  name: string,
}
