import {
  ApplicationConfig,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection, isDevMode, inject
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withViewTransitions
} from '@angular/router';
import { routes } from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {providePrimeNG} from 'primeng/config';
import Aura from '@primeuix/themes/aura';
import { provideServiceWorker } from '@angular/service-worker';
import {Database} from './database';
import {UserService} from './user/user-service';
import {FileService} from './file-service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes,
      withComponentInputBinding(),
      withViewTransitions(),
    ),
    provideAnimationsAsync(),
    providePrimeNG({theme: {preset: Aura}}),
    provideAppInitializer(async () => {
      const fileService = inject(FileService);
      const database = inject(Database);
      const userService = inject(UserService);
      await fileService.init();
      await database.init();
      await userService.auth();
    }),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000'
    }),
  ]
};
