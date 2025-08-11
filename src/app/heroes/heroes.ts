import {Component, signal} from '@angular/core';
import {Avatar} from 'primeng/avatar';
import {Ripple} from 'primeng/ripple';

@Component({
  selector: 'app-heroes',
  imports: [
    Avatar,
    Ripple
  ],
  templateUrl: './heroes.html',
  styleUrl: './heroes.css'
})
export class Heroes {
  heroes = signal<any[]>([
    {name: 'Герой 1', colorFrom: 'blue-500', colorTo: 'indigo-600'},
    {name: 'Герой 2', colorFrom: 'amber-500', colorTo: 'orange-500'},
    {name: 'Герой 3', colorFrom: 'emerald-500', colorTo: 'teal-500'},
    {name: 'Герой 4', colorFrom: 'purple-500', colorTo: 'pink-500'},
    {name: 'Герой 5', colorFrom: 'red-500', colorTo: 'rose-600'},
  ]);
  selectItem(item: string) {
    console.log(item);
    // Здесь можно добавить навигацию по роутам
    // Например: this.router.navigate([item.toLowerCase()]);
  }
  addItem() {

  }
}
