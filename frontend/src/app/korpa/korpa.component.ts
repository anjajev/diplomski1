import { Component } from '@angular/core';
import { Artikal } from '../models/artikal';
import { KorisnikService } from '../korisnik.service';
import jwt_decode from 'jwt-decode';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NarudzbineService } from '../narudzbine.service';

@Component({
  selector: 'app-korpa',
  templateUrl: './korpa.component.html',
  styleUrls: ['./korpa.component.css']
})
export class KorpaComponent {
  korpaArtikli: Artikal[] = [];   // artikli u korpi
  korpa: string[] = [];           // ID-jevi artikala u korpi
  userId: string = '';
  ukupnaCena: number = 0;
  isModalOpen: boolean = false;
  purchaseForm: FormGroup;
  kupovinaUspesna: boolean = false;

  constructor(
    private korisnikService: KorisnikService,
    private ordersService: NarudzbineService,
    private fb: FormBuilder
  ) {
    this.purchaseForm = this.fb.group({
      ime: ['', Validators.required],
      prezime: ['', Validators.required],
      adresa: ['', Validators.required],
      kontakt: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwt_decode(token);
      this.userId = decodedToken.id;
      this.fetchKorpa();
    }
  }

  // Dohvati artikle iz korpe korisnika
  fetchKorpa() {
    this.korisnikService.getCart(this.userId).subscribe(
      (response) => {
        this.korpaArtikli = response.cart;
        this.korpa = this.korpaArtikli.map((artikal: Artikal) => artikal._id);
        this.izracunajUkupnuCenu();
      },
      (error) => {
        console.error('Greška pri dohvatanju artikala iz korpe:', error);
      }
    );
  }

  // Funkcija za dohvatanje slike artikla (prima string ILI string[])
  getArtikalImage(imagePath: string | string[] | undefined): string {
    if (!imagePath) {
      return 'assets/no-image.png'; // fallback placeholder
    }

    const path =
      Array.isArray(imagePath) && imagePath.length > 0
        ? imagePath[0]
        : (imagePath as string);

    if (!path) {
      return 'assets/no-image.png';
    }

    return `http://localhost:4000/${path}`;
  }

  // Ukloni artikal iz korpe
  removeFromCart(artikalId: string) {
    this.korisnikService.removeFromCart(this.userId, artikalId).subscribe(
      () => {
        this.korpaArtikli = this.korpaArtikli.filter(
          (artikal) => artikal._id !== artikalId
        );
        this.korisnikService.getCartCount(this.userId).subscribe();
        this.izracunajUkupnuCenu();
      },
      (error) => {
        console.error('Greška pri uklanjanju artikla iz korpe:', error);
      }
    );
  }

  // Izračunaj ukupnu cenu artikala u korpi
  izracunajUkupnuCenu() {
    this.ukupnaCena = this.korpaArtikli.reduce(
      (acc, artikal) => acc + artikal.cena,
      0
    );
  }

  // Otvaranje modalnog prozora za kupovinu
  openPurchaseModal() {
    this.isModalOpen = true;
  }

  // Zatvaranje modalnog prozora
  closePurchaseModal() {
    this.isModalOpen = false;
  }

  // Potvrdi kupovinu
  onSubmitPurchase() {
    const prodavnicaId =
      this.korpaArtikli.length > 0 ? this.korpaArtikli[0].prodavnica : null;

    if (!prodavnicaId) {
      console.error('Prodavnica nije pronađena.');
      return;
    }

    const artikliIds = this.korpaArtikli.map((artikal) => artikal._id);
    const ukupnaCena = this.ukupnaCena;

    const purchaseData = {
      kupacId: this.userId,
      prodavnicaId: prodavnicaId,
      artikli: artikliIds,
      ukupnaCena,
      imeKupca: this.purchaseForm.value.ime,
      prezimeKupca: this.purchaseForm.value.prezime,
      adresaDostave: this.purchaseForm.value.adresa,
      kontaktTelefon: this.purchaseForm.value.kontakt
    };

    this.ordersService.kreirajNarudzbinu(purchaseData).subscribe(
      () => {
        this.korisnikService.getCartCount(this.userId).subscribe();
        this.korpaArtikli = [];
        this.korpa = [];
        this.ukupnaCena = 0;
        this.kupovinaUspesna = true;
        this.isModalOpen = false;
      },
      (error) => {
        console.error('Greška pri potvrdi kupovine:', error);
      }
    );
  }
}
