import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./trip-listing/trip-listing").then(m => m.TripListingComponent)
  },
  {
    path: "add-trip",
    loadComponent: () => import("./add-trip/add-trip").then(m => m.AddTripComponent)
  },
  {
    path: "edit-trip",
    loadComponent: () => import("./edit-trip/edit-trip").then(m => m.EditTripComponent)
  },
  {
    path: "login",
    loadComponent: () => import("./login/login").then(m => m.LoginComponent)
  }
];
