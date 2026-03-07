// battle-map.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {Cell, CellType, Character, Door, LightSource, Position, Role} from './types';

@Injectable({ providedIn: 'root' })
export class BattleMapService {
  private map: Cell[][] = [];
  private characters: Character[] = [];
  private doors: Door[] = [];
  private lightSources: LightSource[] = [];
  private role: Role = 'player';
  private selectedCharacterId: string | null = null;

  // Subjects для уведомления об изменениях
  private mapSubject = new BehaviorSubject<Cell[][]>(this.map);
  private charactersSubject = new BehaviorSubject<Character[]>(this.characters);
  private doorsSubject = new BehaviorSubject<Door[]>(this.doors);
  private lightSourcesSubject = new BehaviorSubject<LightSource[]>(this.lightSources);
  private roleSubject = new BehaviorSubject<Role>(this.role);

  // Публичные Observable
  map$ = this.mapSubject.asObservable();
  characters$ = this.charactersSubject.asObservable();
  doors$ = this.doorsSubject.asObservable();
  lightSources$ = this.lightSourcesSubject.asObservable();
  role$ = this.roleSubject.asObservable();

  // Инициализация карты (пример)
  initMap(width: number, height: number) {
    this.map = Array(height).fill(null).map(() =>
      Array(width).fill(null).map(() => ({ type: 'floor' }))
    );
    this.mapSubject.next(this.map);
  }

  // Установка типа клетки (админ)
  setCellType(x: number, y: number, type: CellType, doorOpen = false) {
    if (this.role !== 'admin') return;
    if (!this.map[y]?.[x]) return;
    this.map[y][x] = { type, doorOpen: type === 'door' ? doorOpen : undefined };
    this.mapSubject.next(this.map);
  }

  // Добавление персонажа (админ)
  addCharacter(character: Character) {
    if (this.role !== 'admin') return;
    this.characters = [...this.characters, character];
    this.charactersSubject.next(this.characters);
  }

  // Перемещение персонажа (админ или владелец)
  moveCharacter(characterId: string, newPos: Position): boolean {
    const character = this.characters.find(c => c.id === characterId);
    if (!character) return false;
    // Проверка прав: админ может перемещать любого, игрок только своего
    if (this.role === 'player' && !character.playerControlled) return false;

    // Проверка, что клетка свободна и проходима
    if (!this.isWalkable(newPos.x, newPos.y)) return false;

    character.position = newPos;
    this.charactersSubject.next(this.characters);
    return true;
  }

  // Переключение состояния двери (админ или игрок, если дверь доступна)
  toggleDoor(x: number, y: number) {
    const cell = this.map[y]?.[x];
    if (cell?.type !== 'door') return;
    // Игрок может переключать только видимые двери (упрощённо разрешим)
    cell.doorOpen = !cell.doorOpen;
    this.mapSubject.next(this.map);
  }

  // Проверка проходимости
  private isWalkable(x: number, y: number): boolean {
    const cell = this.map[y]?.[x];
    if (!cell) return false;
    if (cell.type === 'wall') return false;
    if (cell.type === 'door' && !cell.doorOpen) return false;
    // Также проверим, нет ли другого персонажа
    return !this.characters.some(c => c.position.x === x && c.position.y === y);
  }

  // Смена роли
  setRole(role: Role) {
    this.role = role;
    this.roleSubject.next(role);
  }

  // Получение текущей роли
  getRole(): Role {
    return this.role;
  }

  // Для вычисления видимости нужен доступ к данным
  getMap(): Cell[][] {
    return this.map;
  }

  getCharacters(): Character[] {
    return this.characters;
  }

  getDoors(): Door[] {
    return this.doors;
  }

  getLightSources(): LightSource[] {
    return this.lightSources;
  }
}
