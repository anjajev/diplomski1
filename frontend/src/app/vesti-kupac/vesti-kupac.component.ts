import { Component } from '@angular/core';
import { ArtikalService } from '../artikal.service';
import jwt_decode from 'jwt-decode'; // Uvezi jwt-decode za token
import { KorisnikService } from '../korisnik.service';


@Component({
  selector: 'app-vesti-kupac',
  templateUrl: './vesti-kupac.component.html',
  styleUrls: ['./vesti-kupac.component.css']
})
export class VestiKupacComponent {
  noviArtikli: any[] = [];
  omiljeneProdavnice: any[] = [];
  userId: string = ''; // ID korisnika

  constructor(private artikliService: ArtikalService, private korisnikService: KorisnikService) {}

  ngOnInit() {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwt_decode(token);
      this.userId = decodedToken.id; 
      this.getNoviArtikli();
      this.getOmiljeneProdavnice();
    }
  }

  getNoviArtikli() {
    const korisnikId =  this.userId; // Zamenite ovde kako dobijate korisnik ID
    this.artikliService.getNoviArtikliZaKorisnika(korisnikId).subscribe(
      
      (data) => {
        this.noviArtikli = data.noviArtikli;
        
      },
      (error) => {
        console.error('Greška pri dohvatanju novih artikala:', error);
      }
       
    );
  }

  getOmiljeneProdavnice() {
    const korisnikId =  this.userId; // Zamenite ovde kako dobijate korisnik ID

    this.korisnikService.getFavoritesStores(korisnikId).subscribe(
      (response) => {
        this.omiljeneProdavnice = response.omiljeneProdavnice;
      },
      (error) => {
        console.error('Greška pri dohvatanju omiljenih prodavnica:', error);
      }
    );
  }

  toggleFavourite(artikalId: string) {
    // Logika za dodavanje/uklanjanje omiljenog artikla
  }

  isFavourite(artikalId: string): boolean {
    // Logika za proveru da li je artikal omiljen
    return false; // Zamenite sa pravom logikom
  }

  getArtikalImage(imagePath: string): string {
    return `http://localhost:4000/${imagePath}`;
  }
}
