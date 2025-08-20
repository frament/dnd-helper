import {TBaseEntity} from './base-entity.model';
import {TUser} from '../user/user';

export const adventureQuery: string = 'select *, owner.{id, name, email} from adventures';

export type TAdventure = {
  owner: TUser;
  status: string;
  description: string;
} & TAdventureCreate & TBaseEntity;

export type TAdventureCreate = {
  name: string;
}
