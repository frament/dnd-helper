import {TBaseEntity} from './base-entity.model';
import {RecordId} from 'surrealdb';

export type TAdventure = {
  owner: RecordId;
  status: string;
  description: string;
  tags: string[];
  isPublic: boolean;
} & TAdventureCreate & TBaseEntity;

export type TAdventureCreate = {
  name: string;
}
