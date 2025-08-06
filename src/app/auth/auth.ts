import {Component, inject, signal} from '@angular/core';
import {UserService} from '../user/user-service';
import {Router} from '@angular/router';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {FormsModule} from '@angular/forms';
import {PasswordModule} from 'primeng/password';
import {SelectButtonModule} from 'primeng/selectbutton';

@Component({
  selector: 'app-auth',
  imports: [
    CardModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    SelectButtonModule
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class Auth {
  userService = inject(UserService);
  router = inject(Router);
  mode = signal<'signin'|'signup'>('signin');
  user = signal<string>('');
  pass = signal<string>('');
  mail = signal<string>('');
  error = signal<string>('');

  modes: any[] = [
    { label: 'войти', value: 'signin' },
    { label: 'зарегистрироваться', value: 'signup' },
  ];

  async signin():Promise<void> {
    try {
      await this.userService.signin(this.mail(), this.pass());
    } catch (e: any) {
      this.error.set(e.message);
    }
    if (!this.error()) await this.router.navigateByUrl('/');
  }

  async signup():Promise<void> {
    try {
      await this.userService.signup(this.user(), this.pass(), this.mail());
    } catch (e: any) {
      this.error.set(e.message);
    }
    if (!this.error()) await this.router.navigateByUrl('/');
  }

  async sign(){
    if (this.mode() === 'signin'){
      await this.signin();
    } else if (this.mode() === 'signup'){
      await this.signup();
    }
  }

  returnToLogin(){
    this.mode.set('signin');
  }
}
