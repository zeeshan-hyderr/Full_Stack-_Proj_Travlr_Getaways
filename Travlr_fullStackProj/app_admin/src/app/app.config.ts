import { ApplicationConfig, provideBrowserGlobalErrorListeners, importProvidersFrom } from "@angular/core";
import { provideRouter } from "@angular/router";
import { HttpClientModule } from "@angular/common/http";

import { routes } from "./app.routes";
import { authInterceptProvider } from "./utils/jwt.interceptor";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    importProvidersFrom(HttpClientModule),
    // JWT interceptor provider
    authInterceptProvider
  ]
};
