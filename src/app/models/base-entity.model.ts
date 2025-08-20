import {RecordId} from 'surrealdb';

export type TBaseEntity = {
  id:RecordId;
  createdAt: Date;
}
