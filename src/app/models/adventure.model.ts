import {TBaseEntityWithOwner} from './base-entity.model';
import {RecordId} from 'surrealdb';

export type TAdventure = {
  owner: RecordId;
  status: string;
  description: string;
  tags: string[];
  isPublic: boolean;
} & TAdventureCreate & TBaseEntityWithOwner;

export type TAdventureCreate = {
  name: string;
}
