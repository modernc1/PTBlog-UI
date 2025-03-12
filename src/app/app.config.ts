import { ApplicationConfig, provideZoneChangeDetection, SecurityContext } from '@angular/core';
import { provideRouter, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideMarkdown } from 'ngx-markdown';


import { MARKED_OPTIONS, MarkedOptions, MarkedRenderer } from 'ngx-markdown';
import { provideAnimations } from '@angular/platform-browser/animations';
import { authInterceptor } from '../core/interceptors/auth.interceptor';
import { refreshTokenInterceptor } from '../core/interceptors/refresh-token.interceptor';
import { enableDebugTools } from '@angular/platform-browser';

// function that returns `MarkedOptions` with renderer override



export const appConfig: ApplicationConfig = {
  providers: [
      provideZoneChangeDetection({ eventCoalescing: true }),
      provideRouter(routes),
      provideHttpClient(withInterceptors([authInterceptor, refreshTokenInterceptor])),
      provideMarkdown(), //see documentation to configure prismjs inside angular.json
    ]
};
