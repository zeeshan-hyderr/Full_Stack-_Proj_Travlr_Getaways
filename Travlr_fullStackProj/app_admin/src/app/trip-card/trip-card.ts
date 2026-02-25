import { Component, Input, OnDestroy } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { Trip } from "../models/trip";
import { AuthService } from "../services/auth.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-trip-card",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./trip-card.html",
  styleUrls: ["./trip-card.css"]
})
export class TripCardComponent implements OnDestroy {
  @Input() trip!: Trip;
  isLoggedIn = false;
  private sub?: Subscription;

  constructor(private router: Router, private auth: AuthService) {
    this.isLoggedIn = this.auth.isLoggedIn();
    this.sub = this.auth.isLoggedIn$.subscribe(s => this.isLoggedIn = s);
  }

  editTrip() {
    const code = (this.trip as any).code || "";
    localStorage.setItem("tripCode", code);
    this.router.navigate(["/edit-trip"]);
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
