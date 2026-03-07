// types.ts
export type CellType = 'floor' | 'wall' | 'door';

export interface Cell {
  type: CellType;
  // для двери: состояние открыта/закрыта
  doorOpen?: boolean;
}

export interface Position {
  x: number;
  y: number;
}

export interface Character {
  id: string;
  name: string;
  position: Position;
  playerControlled: boolean; // true для персонажей игроков
  lightRadius?: number;      // радиус источника света (если есть)
}

export interface LightSource {
  position: Position;
  radius: number;
}

export interface Door {
  position: Position;
  open: boolean;
}

export type Role = 'admin' | 'player';
