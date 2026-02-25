import { Injectable, Provider } from "@angular/core";
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HTTP_INTERCEPTORS } from "@angular/common/http";
import { Observable } from "rxjs";
import { AuthService } from "../services/auth.service";

/**
 * JwtInterceptor
 * - Attaches Authorization header with Bearer <token> for API calls that are NOT the auth endpoints.
 * - Uses AuthService.getToken() as the single source of truth for the JWT.
 */
@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const url = request.url || "";
    // Do not attach token to auth endpoints
    const isAuthApi =
      url.endsWith("/login") ||
      url.endsWith("/register") ||
      url.includes("/api/login") ||
      url.includes("/api/register");

    const token = this.authService.getToken ? this.authService.getToken() : null;
    if (token && !isAuthApi) {
      const authReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next.handle(authReq);
    }

    return next.handle(request);
  }
}

/**
 * Provider to register this interceptor app-wide.
 */
export const authInterceptProvider: Provider = {
  provide: HTTP_INTERCEPTORS,
  useClass: JwtInterceptor,
  multi: true
};
