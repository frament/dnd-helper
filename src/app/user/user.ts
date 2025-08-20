import {RecordId} from 'surrealdb';

export type TUser = {
  id:RecordId,
  email:string,
  name:string,
};
