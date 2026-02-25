import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

import { Trip } from '../models/trip';
import { TripDataService } from '../services/trip-data.service';
import { TripCardComponent } from '../trip-card/trip-card';

@Component({
  selector: 'app-trip-listing',
  standalone: true,
  imports: [CommonModule, TripCardComponent],
  templateUrl: './trip-listing.html',
  styleUrls: ['./trip-listing.css'],
  providers: [TripDataService] // optional because service is providedIn: 'root'
})
export class TripListingComponent implements OnInit {
  trips$: Observable<Trip[]> = of([]);
  message = '';

  constructor(
    private tripService: TripDataService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.trips$ = this.tripService.getTrips().pipe(
      tap((trips) => {
        this.message = trips.length > 0
          ? `There are ${trips.length} trips available.`
          : 'No trips found.';
        console.log(this.message);
      }),
      catchError((err) => {
        console.error('Error loading trips:', err);
        this.message = 'Could not load trips. Check API server.';
        return of([] as Trip[]);
      })
    );
  }

  addTrip(): void {
    this.router.navigate(['/add-trip']);
  }
}
