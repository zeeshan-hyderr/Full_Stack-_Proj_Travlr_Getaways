import { Component } from "@angular/core";
import { RouterOutlet, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { AuthService } from "./services/auth.service";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: "./app.html",
  styleUrls: ["./app.css"]
})
export class App {
  title = "Travlr Admin";
  constructor(public auth: AuthService) {}

  logout() {
    this.auth.logout();
  }
}
