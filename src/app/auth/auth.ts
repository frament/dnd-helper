import {Component, inject, signal} from '@angular/core';
import {UserService} from '../user/user-service';
import {Router} from '@angular/router';
import {CardModule} from 'primeng/card';
import {ButtonModule} from 'primeng/button';
import {InputTextModule} from 'primeng/inputtext';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {PasswordModule} from 'primeng/password';
import {SelectButtonModule} from 'primeng/selectbutton';
import {CheckboxModule} from 'primeng/checkbox';
import {TabsModule} from 'primeng/tabs';

@Component({
  selector: 'app-auth',
  imports: [
    CardModule,
    ButtonModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    SelectButtonModule,
    ReactiveFormsModule,
    CheckboxModule,
    TabsModule
  ],
  templateUrl: './auth.html',
  styleUrl: './auth.css'
})
export class Auth {
  userService = inject(UserService);
  router = inject(Router);
  fb = inject(FormBuilder);
  activeTabIndex = signal<number>(0);
  isLoading = signal<boolean>(false);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required],
    rememberMe: [false]
  });
  registerForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    confirmPassword: ['', Validators.required],
  }, { validators: this.passwordMatchValidator });
  passwordMatchValidator(form: FormGroup) {
    return form.get('password')?.value === form.get('confirmPassword')?.value
      ? null : { mismatch: true };
  }
  error = signal<string>('');
  async onLogin():Promise<void> {
    console.log(this.loginForm)
    if (this.loginForm.invalid) return;

    this.isLoading.set(true);
    try {
      await this.userService.signin(
        this.loginForm.get("email")?.value,
        this.loginForm.get("password")?.value,
      );
    } catch (e: any) {
      this.error.set(e.message);
      console.error(e);
    }
    this.isLoading.set(false);
    if (!this.error()) await this.router.navigateByUrl('/');
  }

  async onRegister():Promise<void> {
    if (this.registerForm.invalid) return;

    this.isLoading.set(true);
    try {
      await this.userService.signup(
        this.registerForm.get("name")?.value,
        this.registerForm.get("password")?.value,
        this.registerForm.get("email")?.value,
      );
    } catch (e: any) {
      this.error.set(e.message);
      console.error(e);
    }
    this.activeTabIndex.set(0); // Переключаем на вкладку входа
    this.registerForm.reset();
    if (!this.error()) await this.router.navigateByUrl('/');
  }

  /*async sign(){
    if (this.mode() === 'signin'){
      await this.signin();
    } else if (this.mode() === 'signup'){
      await this.signup();
    }
  }

  returnToLogin(){
    this.mode.set('signin');
  }*/
}
