import { Component } from '@angular/core';
import jwt_decode from 'jwt-decode'; // Uvezi jwt-decode

@Component({
  selector: 'app-profilkorisnik',
  templateUrl: './profilkorisnik.component.html',
  styleUrls: ['./profilkorisnik.component.css']
})
export class ProfilkorisnikComponent  {
  userName: string | null = null;

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      // Manualno dekodiraj payload iz JWT tokena
      const decodedToken: any = jwt_decode(token);
      this.userName = decodedToken.ime; // Pretpostavka da token sadrži "ime"
    }
  }

  
}