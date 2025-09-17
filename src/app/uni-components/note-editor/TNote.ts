import {TBaseEntityWithOwner} from '../../models/base-entity.model';

export type TNote = TNoteCreate & TBaseEntityWithOwner;

export type TNoteCreate = {
  title: string;
  content: string;
  tags: string[];
  category: string;
  status: 'draft' | 'in-progress' | 'completed' | 'archived';
}
