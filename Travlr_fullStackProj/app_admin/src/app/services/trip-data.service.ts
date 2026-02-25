import { Inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Trip } from "../models/trip";
import { User } from "../models/user";
import { AuthResponse } from "../models/auth-response";
import { BROWSER_STORAGE } from "../storage";

@Injectable({
  providedIn: "root"
})
export class TripDataService {
  // Use the proxy (or adjust to http://localhost:3000/api if you prefer)
  private baseUrl = "/api";

  constructor(
    private http: HttpClient,
    @Inject(BROWSER_STORAGE) private storage: Storage
  ) {}

  // Trips endpoints
  getTrips(): Observable<Trip[]> {
    return this.http.get<Trip[]>(`${this.baseUrl}/trips`);
  }

  // Grab a single trip by code
  getTrip(tripCode: string): Observable<Trip> {
    return this.http.get<Trip>(`${this.baseUrl}/trips/${tripCode}`);
  }

  addTrip(trip: Trip): Observable<Trip> {
    return this.http.post<Trip>(`${this.baseUrl}/trips`, trip);
  }

  // Update a single trip; trip.code is used in the URL
  updateTrip(trip: any): Observable<Trip> {
    const code = trip?.code ?? "";
    return this.http.put<Trip>(`${this.baseUrl}/trips/${code}`, trip);
  }

  // ---------- Authentication API helpers ----------

  // Call to our /login endpoint, returns JWT
  login(user: User, passwd: string): Observable<AuthResponse> {
    return this.handleAuthAPICall("login", user, passwd);
  }

  // Call to our /register endpoint, creates user and returns JWT
  register(user: User, passwd: string): Observable<AuthResponse> {
    return this.handleAuthAPICall("register", user, passwd);
  }

  // helper method to process both login and register methods
  private handleAuthAPICall(endpoint: string, user: User, passwd: string): Observable<AuthResponse> {
    const formData = {
      name: user.name,
      email: user.email,
      password: passwd
    };
    return this.http.post<AuthResponse>(`${this.baseUrl}/${endpoint}`, formData);
  }

  // Convenience helpers for local storage (guide uses key 'travlr-token')
  getStoredToken(key = "travlr-token"): string | null {
    return this.storage.getItem(key);
  }

  saveToken(token: string, key = "travlr-token"): void {
    this.storage.setItem(key, token);
  }

  removeToken(key = "travlr-token"): void {
    this.storage.removeItem(key);
  }
}
