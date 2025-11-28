import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']  // Ovo treba da bude putanja do CSS fajla za ovu komponentu
})
export class HomeComponent {
  // Kod za komponentu

  constructor(private router: Router) {}

  navigateToShopGirls() {
    this.router.navigate(['/zenska-odeca']); // Replace with actual route
  }
}
