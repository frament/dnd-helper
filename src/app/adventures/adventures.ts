import {Component, signal} from '@angular/core';
import {AvatarModule} from 'primeng/avatar';
import {RippleModule} from 'primeng/ripple';
import {ToastModule} from 'primeng/toast';

@Component({
  selector: 'app-adventures',
  imports: [AvatarModule, RippleModule, ToastModule],
  templateUrl: './adventures.html',
  styleUrl: './adventures.css'
})
export class Adventures {
  adventures = signal<any[]>([
    {name: 'Прикключение 1', colorFrom: 'blue-500', colorTo: 'indigo-600'},
    {name: 'Прикключение 2', colorFrom: 'amber-500', colorTo: 'orange-500'},
    {name: 'Прикключение 3', colorFrom: 'emerald-500', colorTo: 'teal-500'},
    {name: 'Прикключение 4', colorFrom: 'purple-500', colorTo: 'pink-500'},
    {name: 'Прикключение 5', colorFrom: 'red-500', colorTo: 'rose-600'},
  ]);
  selectItem(item: string) {
    console.log(item);
    // Здесь можно добавить навигацию по роутам
    // Например: this.router.navigate([item.toLowerCase()]);
  }
  addItem() {

  }
}
