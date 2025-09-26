import {TBaseEntity} from './base-entity.model';

export type TTrait = {
  name: string;
  type: string;
  description: string;
} & TBaseEntity;
