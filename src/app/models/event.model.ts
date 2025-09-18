import {TBaseEntityWithOwner} from './base-entity.model';
import {RecordId} from 'surrealdb';

export type TEvent = {
  date: Date;
  description: string;
  tags: string[];
  importance: number;
  relatedItems: RecordId[];
} & TEventCreate & TBaseEntityWithOwner;

export type TEventCreate = {
  title: string;
}
