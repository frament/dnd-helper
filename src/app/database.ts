import { Injectable } from '@angular/core';
import {Surreal} from "surrealdb";
export type LiveActionType = "CREATE" | "UPDATE" | "DELETE" | "CLOSE";

@Injectable({
  providedIn: 'root'
})
export class Database {
  public db = new Surreal();
  async init():Promise<void>{
    await this.db.connect(`http://${location.hostname}:8000/rpc`, {namespace:'dnd', database: 'dnd'});
  }

  async select<T>(tableName:string, ids?:string[], options?: {fetch?:string[]}):Promise<T[]>{
    let sql = `SELECT * FROM ${tableName}`;
    if (ids) {
      sql += ':'+ids.join(`, ${tableName}:`);
    }
    if (options?.fetch?.length) {
      sql += ` FETCH ${options.fetch.join(',')}`;
    }
    const [result] = await this.db.query<[T[]]>(sql+';');
    return result;
  }

  async selectOne<T>(tableName:string, id:string, options?: {fetch?:string[]}):Promise<T>{
    return (await this.select<T>(tableName, [id], options))[0];
  }

  private _valByPath<T>(obj:any, path:string[]):T{
    let val:any = obj;
    for (const key of path) {
      val = val[key];
    }
    return val as T;
  }

  async linked<T>(tableName:string, path:string[], ids?:string[]):Promise<T[]>{
    let sql = `SELECT ->${path.join('->')}.* FROM ${tableName}`;
    if (ids) {
      sql += ':'+ids.join(`, ${tableName}:`);
    }
    let [result] = await this.db.query<[any[]]>(sql+';');
    const _path = path.map(x => '->'+x);
    const tmpResult:T[] = [];
    for (const item of result) {
      tmpResult.push(...this._valByPath<T[]>(item, _path));
    }
    return tmpResult;
  }

  async createLink(tableIn:string, idIn:string, linkTable:string , tableOut:string, idOut:string){
    await this.db.query<[any[]]>(`RELATE ${tableIn}:${idIn}->${linkTable}->${tableOut}:${idOut};`);
  }

  async _select<T>(query: string, vars?: Record<string, unknown>): Promise<T[]>{
    return (await this.db.query<[Array<T & Record<any, any>>]>(query, vars))[0] ?? [];
  }
  async _selectOne<T>(query: string, vars?: Record<string, unknown>): Promise<T|null>{
    return (await this._select<T>(query, vars))[0] ?? null;
  }
}
