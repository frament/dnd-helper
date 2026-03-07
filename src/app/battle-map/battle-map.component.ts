// battle-map.component.ts
import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Input,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { BattleMapService } from './battle-map.service';
import { VisibilityService } from './visibility.service';
import { Cell, Character, Role } from './types';

@Component({
  selector: 'app-battle-map',
  template: `
    <div class="battle-map-container">
      <canvas #canvas
              [style.width]="width + 'px'"
              [style.height]="height + 'px'"
              (click)="onCanvasClick($event)">
      </canvas>
    </div>
  `,
  styles: [`
    .battle-map-container {
      position: relative;
      display: inline-block;
    }
    canvas {
      display: block;
      border: 1px solid #ccc;
      background-color: #2a2a2a;
    }
  `]
})
export class BattleMapComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @Input() width = 800;
  @Input() height = 600;
  @Input() cellSize = 40;

  private ctx!: CanvasRenderingContext2D;
  private map: Cell[][] = [];
  private characters: Character[] = [];
  private role: Role = 'player';
  private visibleCells: boolean[][] = [];
  private subs: Subscription[] = [];

  private backgroundImage: HTMLImageElement | null = null;

  constructor(
    private battleMapService: BattleMapService,
    private visibilityService: VisibilityService
  ) {}

  ngAfterViewInit() {
    this.ctx = this.canvasRef.nativeElement.getContext('2d')!;

    // Подписка на изменения
    this.subs.push(
      this.battleMapService.map$.subscribe(map => {
        this.map = map;
        this.updateVisibleCells();
        this.draw();
      })
    );

    this.subs.push(
      this.battleMapService.characters$.subscribe(characters => {
        this.characters = characters;
        this.updateVisibleCells();
        this.draw();
      })
    );

    this.subs.push(
      this.battleMapService.role$.subscribe(role => {
        this.role = role;
        this.updateVisibleCells();
        this.draw();
      })
    );

    // Начальная загрузка
    this.map = this.battleMapService.getMap();
    this.characters = this.battleMapService.getCharacters();
    this.role = this.battleMapService.getRole();
    this.updateVisibleCells();
    this.draw();
  }

  private updateVisibleCells() {
    if (this.role === 'admin') {
      // Админ видит всё
      const height = this.map.length;
      const width = this.map[0]?.length || 0;
      this.visibleCells = Array(height).fill(null).map(() => Array(width).fill(true));
    } else {
      // Игрок видит только освещённое
      this.visibleCells = this.visibilityService.computeVisibleCells(
        this.map,
        this.characters,
        this.battleMapService.getLightSources()
      );
    }
  }

  private draw() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Рисуем фон (если есть)
    if (this.backgroundImage) {
      this.ctx.drawImage(this.backgroundImage, 0, 0, this.width, this.height);
    } else {
      this.ctx.fillStyle = '#3a3a3a';
      this.ctx.fillRect(0, 0, this.width, this.height);
    }

    // Рисуем клетки с учётом видимости
    this.drawCells();

    // Рисуем сетку
    this.drawGrid();

    // Рисуем персонажей (видимых)
    this.drawCharacters();
  }

  private drawCells() {
    const rows = this.map.length;
    const cols = this.map[0]?.length || 0;

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const cell = this.map[y][x];
        const visible = this.visibleCells[y]?.[x] || false;

        let fillStyle = '';
        if (cell.type === 'wall') {
          fillStyle = '#555';
        } else if (cell.type === 'door') {
          fillStyle = cell.doorOpen ? '#8b6b4d' : '#5d3a1a';
        } else {
          fillStyle = '#aaa';
        }

        this.ctx.fillStyle = fillStyle;
        this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);

        // Если клетка не видима для игрока, затемняем
        if (!visible && this.role === 'player') {
          this.ctx.fillStyle = 'rgba(0,0,0,0.7)';
          this.ctx.fillRect(x * this.cellSize, y * this.cellSize, this.cellSize, this.cellSize);
        }
      }
    }
  }

  private drawGrid() {
    this.ctx.strokeStyle = '#666';
    this.ctx.lineWidth = 1;

    const rows = this.map.length;
    const cols = this.map[0]?.length || 0;

    for (let i = 0; i <= cols; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(i * this.cellSize, 0);
      this.ctx.lineTo(i * this.cellSize, rows * this.cellSize);
      this.ctx.stroke();
    }

    for (let i = 0; i <= rows; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, i * this.cellSize);
      this.ctx.lineTo(cols * this.cellSize, i * this.cellSize);
      this.ctx.stroke();
    }
  }

  private drawCharacters() {
    for (const char of this.characters) {
      // Рисуем только если клетка видима (для игрока) или всегда для админа
      const visible = this.role === 'admin' || this.visibleCells[char.position.y]?.[char.position.x];
      if (!visible) continue;

      const x = char.position.x * this.cellSize + this.cellSize / 2;
      const y = char.position.y * this.cellSize + this.cellSize / 2;
      const radius = this.cellSize * 0.3;

      this.ctx.beginPath();
      this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
      this.ctx.fillStyle = char.playerControlled ? 'green' : 'red';
      this.ctx.fill();
      this.ctx.strokeStyle = 'white';
      this.ctx.lineWidth = 2;
      this.ctx.stroke();

      // Подпись
      this.ctx.fillStyle = 'white';
      this.ctx.font = '12px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.fillText(char.name, x, y - radius - 2);
    }
  }

  // Обработка кликов
  onCanvasClick(event: MouseEvent) {
    const rect = this.canvasRef.nativeElement.getBoundingClientRect();
    const scaleX = this.canvasRef.nativeElement.width / rect.width;
    const scaleY = this.canvasRef.nativeElement.height / rect.height;

    const mouseX = (event.clientX - rect.left) * scaleX;
    const mouseY = (event.clientY - rect.top) * scaleY;

    const cellX = Math.floor(mouseX / this.cellSize);
    const cellY = Math.floor(mouseY / this.cellSize);

    // Проверка границ
    if (!this.map[cellY]?.[cellX]) return;

    // В зависимости от роли и режима выполняем действие
    // Для примера: если админ, устанавливаем стену; если игрок, пробуем переместить персонажа
    if (this.role === 'admin') {
      // Переключение типа клетки (для демонстрации)
      const current = this.map[cellY][cellX].type;
      const newType: Cell['type'] = current === 'floor' ? 'wall' : (current === 'wall' ? 'door' : 'floor');
      this.battleMapService.setCellType(cellX, cellY, newType);
    } else {
      // Игрок: если выбран персонаж, перемещаем его
      // Для простоты допустим, что у нас всегда выбран первый подконтрольный игроку персонаж
      const playerChar = this.characters.find(c => c.playerControlled);
      if (playerChar) {
        this.battleMapService.moveCharacter(playerChar.id, { x: cellX, y: cellY });
      }
    }
  }

  // Загрузка фонового изображения
  setBackgroundImage(src: string) {
    const img = new Image();
    img.onload = () => {
      this.backgroundImage = img;
      this.draw();
    };
    img.src = src;
  }

  ngOnDestroy() {
    this.subs.forEach(s => s.unsubscribe());
  }
}
