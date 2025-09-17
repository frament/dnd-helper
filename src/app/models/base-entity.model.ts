import {RecordId} from 'surrealdb';

export type TBaseEntity = {
  id:RecordId;
  createdAt: Date;
  updatedAt: Date;
}

export type TBaseEntityWithOwner = TBaseEntity & {owner: RecordId}
