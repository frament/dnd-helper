// app.component.ts
import { Component, OnInit, ViewChild } from '@angular/core';
import { BattleMapService } from './battle-map.service';
import { BattleMapComponent } from './battle-map.component';

@Component({
  selector: 'app-batle-test',
  imports: [
    BattleMapComponent
  ],
  template: `
    <div>
      <button (click)="setRole('admin')">Админ</button>
      <button (click)="setRole('player')">Игрок</button>
      <button (click)="addWall()">Добавить стену (админ)</button>
      <button (click)="toggleDoor()">Переключить дверь</button>
    </div>
    <app-battle-map #map [width]="800" [height]="600" [cellSize]="40"></app-battle-map>
  `
})
export class BaattleTestComponent implements OnInit {
  @ViewChild('map') mapComponent!: BattleMapComponent;

  constructor(private battleMapService: BattleMapService) {}

  ngOnInit() {
    // Инициализация карты 20x15 клеток
    this.battleMapService.initMap(20, 15);

    // Добавляем персонажей
    this.battleMapService.addCharacter({
      id: '1',
      name: 'Герой',
      position: { x: 2, y: 2 },
      playerControlled: true,
      lightRadius: 5
    });

    this.battleMapService.addCharacter({
      id: '2',
      name: 'Гоблин',
      position: { x: 10, y: 5 },
      playerControlled: false
    });

    // Устанавливаем фоновое изображение (пример)
    this.mapComponent?.setBackgroundImage('/assets/dungeon-floor.jpg');
  }

  setRole(role: 'admin' | 'player') {
    this.battleMapService.setRole(role);
  }

  addWall() {
    // Для демонстрации: админ может добавить стену в случайное место
    if (this.battleMapService.getRole() === 'admin') {
      this.battleMapService.setCellType(5, 5, 'wall');
    }
  }

  toggleDoor() {
    // Переключение двери (если есть)
    this.battleMapService.toggleDoor(3, 3);
  }
}
