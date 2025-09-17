import {TBaseEntityWithOwner} from './base-entity.model';

export type TMap = {
  width: number,
  height: number,
  tags: string[],
  file: string,
  description: string,
} & TMapCreate & TBaseEntityWithOwner

export type TMapCreate = {
  title: string,
  type: string,
}
