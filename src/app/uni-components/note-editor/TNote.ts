import {RecordId} from 'surrealdb';
import {TBaseEntity} from '../../models/base-entity.model';

export type TNote = {
  owner: RecordId,
  updatedAt: Date;
} & TNoteCreate & TBaseEntity;

export type TNoteCreate = {
  title: string;
  content: string;
  tags: string[];
  category: string;
  status: 'draft' | 'in-progress' | 'completed' | 'archived';
}
