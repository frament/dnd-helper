// visibility.service.ts
import { Injectable } from '@angular/core';
import { Cell, Character, LightSource, Position } from './types';

@Injectable({ providedIn: 'root' })
export class VisibilityService {
  computeVisibleCells(
    map: Cell[][],
    characters: Character[],
    staticLights: LightSource[]
  ): boolean[][] {
    const height = map.length;
    const width = map[0]?.length || 0;
    const visible: boolean[][] = Array(height).fill(null).map(() => Array(width).fill(false));

    // Источники света: статические + персонажи с lightRadius
    const lightSources: LightSource[] = [...staticLights];
    characters.forEach(c => {
      if (c.lightRadius && c.lightRadius > 0) {
        lightSources.push({ position: c.position, radius: c.lightRadius });
      }
    });

    for (const light of lightSources) {
      this.castLight(light, map, visible);
    }

    return visible;
  }

  private castLight(light: LightSource, map: Cell[][], visible: boolean[][]) {
    const { x: lx, y: ly } = light.position;
    const radius = light.radius;

    for (let dy = -radius; dy <= radius; dy++) {
      for (let dx = -radius; dx <= radius; dx++) {
        const x = lx + dx;
        const y = ly + dy;
        if (!this.isInBounds(map, x, y)) continue;

        // Проверка расстояния (манхэттенское или евклидово — упростим, используем евклидово)
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > radius) continue;

        // Проверка прямой видимости
        if (this.hasLineOfSight(map, lx, ly, x, y)) {
          visible[y][x] = true;
        }
      }
    }
  }

  private hasLineOfSight(map: Cell[][], x0: number, y0: number, x1: number, y1: number): boolean {
    // Алгоритм Брезенхема для проверки клеток на линии
    const dx = Math.abs(x1 - x0);
    const dy = Math.abs(y1 - y0);
    const sx = x0 < x1 ? 1 : -1;
    const sy = y0 < y1 ? 1 : -1;
    let err = dx - dy;

    let x = x0;
    let y = y0;

    while (true) {
      // Если достигли целевой клетки — успех
      if (x === x1 && y === y1) break;

      // Проверяем текущую клетку (не считая исходную)
      if (x !== x0 || y !== y0) {
        const cell = map[y]?.[x];
        if (!cell) return false;
        // Стены и закрытые двери блокируют видимость
        if (cell.type === 'wall') return false;
        if (cell.type === 'door' && !cell.doorOpen) return false;
      }

      const e2 = 2 * err;
      if (e2 > -dy) {
        err -= dy;
        x += sx;
      }
      if (e2 < dx) {
        err += dx;
        y += sy;
      }
    }
    return true;
  }

  private isInBounds(map: Cell[][], x: number, y: number): boolean {
    return y >= 0 && y < map.length && x >= 0 && x < (map[0]?.length || 0);
  }
}
