import {Component, inject, signal} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {ButtonModule} from 'primeng/button';
import {MenuItem} from 'primeng/api';
import {RippleModule} from 'primeng/ripple';
import {AvatarModule} from 'primeng/avatar';
import {MenuModule} from 'primeng/menu';
import {UserService} from './user/user-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ButtonModule, RippleModule, AvatarModule, MenuModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('dnd-helper');
  userService = inject(UserService);
  activeTab = signal<string>('adventures');
  router =  inject(Router)
  userMenuItems: MenuItem[] = [
    {
      label: 'Профиль',
      icon: 'pi pi-user',
      command: () => this.openProfile()
    },
    {
      label: 'Настройки',
      icon: 'pi pi-cog',
      command: () => this.openSettings()
    },
    {
      separator: true
    },
    {
      label: 'Выйти',
      icon: 'pi pi-sign-out',
      command: () => this.logout()
    }
  ];
  async setActiveTab(tab: string) {
    this.activeTab.set(tab);
    // Здесь можно добавить навигацию по разделам
    await this.router.navigate([`/${tab}`]);
  }

  openProfile() {
    console.log('Открыть профиль');
    // this.router.navigate(['/profile']);
  }

  openSettings() {
    console.log('Открыть настройки');
    // this.router.navigate(['/settings']);
  }

  async logout() {
    console.log('Пользователь вышел');
    await this.router.navigate(['/auth']);
    await this.userService.logout();
  }
}
