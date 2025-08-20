import {TBaseEntity} from './base-entity.model';
import {TUser} from '../user/user';

export type TAdventure = {
  owner: TUser;
  status: string;
} & TAdventureCreate & TBaseEntity;

export type TAdventureCreate = {
  name: string;
}
