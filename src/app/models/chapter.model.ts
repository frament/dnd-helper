import {TBaseEntityWithOwner} from './base-entity.model';

export type TChapter = {
  avatar: string;
  difficulty: number;
  recommendedLevel: number;
  isPublic: boolean;
  tags: string[];
  description: string;
} & TChapterCreate & TBaseEntityWithOwner;

export type TChapterCreate = {
  title: string;
  status: 'draft' | 'in-progress' | 'testing' | 'completed' | 'archived';
}
