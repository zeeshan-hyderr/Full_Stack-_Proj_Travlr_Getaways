import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, tap } from "rxjs";
import { Router } from "@angular/router";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private tokenKey = "travlr_token";
  private _isLoggedIn = new BehaviorSubject<boolean>(!!localStorage.getItem(this.tokenKey));
  readonly isLoggedIn$ = this._isLoggedIn.asObservable();

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string): Observable<{ token: string }> {
    return this.http.post<{ token: string }>("/api/login", { email, password }).pipe(
      tap(res => {
        localStorage.setItem(this.tokenKey, res.token);
        this._isLoggedIn.next(true);
      })
    );
  }

  register(email: string, name: string, password: string): Observable<{ token?: string }> {
    return this.http.post<{ token?: string }>("/api/register", { email, name, password }).pipe(
      tap(res => {
        if (res.token) {
          localStorage.setItem(this.tokenKey, res.token);
          this._isLoggedIn.next(true);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem(this.tokenKey);
    this._isLoggedIn.next(false);
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }
}
