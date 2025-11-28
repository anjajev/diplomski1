import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProdavnicaService } from '../prodavnica.service';
import jwt_decode from 'jwt-decode';
import { Prodavnica } from '../models/prodavnica';
import { Artikal } from '../models/artikal';

@Component({
  selector: 'app-infoprodavci',
  templateUrl: './infoprodavci.component.html',
  styleUrls: ['./infoprodavci.component.css']
})
export class InfoprodavciComponent implements OnInit {

  profilnaSlika: string | null = null;
  coverImageUrl: string | null = null;

  storeForm: FormGroup;
  email: string = '';
  isEditingProfile: boolean = false;

  stats = {
    artikli: 0,
    porudzbine: 0,
    rating: 4.9
  };

  // --- artikli na profilu ---
  artikli: Artikal[] = [];
  cardImageIndex: { [artikalId: string]: number } = {};

  // --- modal za izmenu artikla ---
  showEditModal: boolean = false;
  selectedArtikal: Artikal | null = null;
  editForm: FormGroup;
  selectedImageIndex: number = 0;      // koju sliku trenutno gledamo u modalu

  constructor(
    private fb: FormBuilder,
    private prodavnicaService: ProdavnicaService
  ) {
    // forma za prodavnicu
    this.storeForm = this.fb.group({
      ime: ['', Validators.required],
      adresa: ['', Validators.required],
      opis: [''],
      radnoVreme: ['', Validators.required],
      kontaktInfo: ['', Validators.required]
    });

    // forma u modalu za artikal
    this.editForm = this.fb.group({
      tip: ['', Validators.required],
      kategorija: ['', Validators.required],
      velicina: ['', Validators.required],
      boja: ['', Validators.required],
      cena: [0, [Validators.required, Validators.min(0)]]
    });
  }

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwt_decode(token);
      this.email = decodedToken.email;
      this.loadStoreData();
      this.loadStats();
    }
  }

  // Učitaj podatke o prodavnici + artikle
  loadStoreData() {
    this.prodavnicaService.dohvatiProdavnicu(this.email).subscribe(
      (prodavnica: Prodavnica & { artikli?: Artikal[] }) => {
        this.storeForm.patchValue({
          ime: prodavnica.ime,
          adresa: prodavnica.adresa,
          opis: prodavnica.opis,
          radnoVreme: prodavnica.radnoVreme,
          kontaktInfo: prodavnica.kontaktInfo
        });

        this.profilnaSlika = prodavnica.slika || null;

        if (prodavnica.artikli) {
          this.artikli = prodavnica.artikli;
          this.stats.artikli = this.artikli.length;
        }
      }
    );
  }

  // Snimi profil
  onSubmit() {
    if (this.storeForm.valid) {
      const updatedData = this.storeForm.value;

      this.prodavnicaService.azuriraj(this.email, updatedData).subscribe(
        () => {
          console.log('Profil ažuriran');
          this.isEditingProfile = false;
        },
        () => alert('Greška pri ažuriranju podataka.')
      );
    }
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const selectedFile = input.files[0];

      this.prodavnicaService.uploadProfileImage(this.email, selectedFile)
        .subscribe(
          (response) => {
            this.profilnaSlika = response.slika;
          },
          (error) => {
            console.error('Greška pri dodavanju profilne slike:', error);
          }
        );
    }
  }

  onCoverImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files[0]) {
      const selectedFile = input.files[0];
      console.log('Cover slika izabrana:', selectedFile.name);
    }
  }

  getProdavnicaImage(): string {
    if (this.profilnaSlika) {
      return `http://localhost:4000/${this.profilnaSlika}`;
    }
    return 'assets/default-profile.png';
  }

  loadStats() {
    this.stats = {
      artikli: this.stats.artikli || 44,
      porudzbine: 268,
      rating: 4.9
    };
  }

  toggleEdit(): void {
    this.isEditingProfile = !this.isEditingProfile;

    if (this.isEditingProfile) {
      setTimeout(() => {
        const el = document.getElementById('profile-edit-inline');
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 0);
    }
  }

  // ===== helperi za slike u gridu =====

  private buildImageUrl(path: string | undefined): string {
    if (!path) return 'assets/no-image.png';
    return `http://localhost:4000/${path}`;
  }

  // slika na kartici (koristi mainImageIndex ako postoji)
  getCardImage(artikal: Artikal): string {
    const slike: any = (artikal as any).slike;
    if (!slike) return 'assets/no-image.png';

    const defaultIndex = (artikal as any).mainImageIndex ?? 0;

    let index = this.cardImageIndex[artikal._id];
    if (index == null) {
      index = defaultIndex;
      this.cardImageIndex[artikal._id] = index;
    }

    if (Array.isArray(slike) && slike.length > 0) {
      if (index >= slike.length) index = 0;
      return this.buildImageUrl(slike[index]);
    }

    return this.buildImageUrl(slike as string);
  }

  nextCardImage(artikal: Artikal, event: MouseEvent) {
    event.stopPropagation();
    const slike: any = (artikal as any).slike;
    if (!Array.isArray(slike) || slike.length === 0) return;

    const current = this.cardImageIndex[artikal._id] ?? 0;
    this.cardImageIndex[artikal._id] = (current + 1) % slike.length;
  }

  prevCardImage(artikal: Artikal, event: MouseEvent) {
    event.stopPropagation();
    const slike: any = (artikal as any).slike;
    if (!Array.isArray(slike) || slike.length === 0) return;

    const current = this.cardImageIndex[artikal._id] ?? 0;
    this.cardImageIndex[artikal._id] =
      (current - 1 + slike.length) % slike.length;
  }

  // ===== MODAL ZA IZMENE ARTIKLA =====

  openEditModal(artikal: Artikal, event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();

    this.selectedArtikal = artikal;

    // index za modal – ako ima mainImageIndex, krećemo od njega
    const slike: any = (artikal as any).slike;
    const mainIndex = (artikal as any).mainImageIndex ?? 0;
    this.selectedImageIndex =
      Array.isArray(slike) && slike.length > 0 && mainIndex < slike.length
        ? mainIndex
        : 0;

    this.editForm.patchValue({
      tip: artikal.tip,
      kategorija: artikal.kategorija,
      velicina: artikal.velicina,
      boja: artikal.boja,
      cena: artikal.cena
    });

    this.showEditModal = true;
  }

  closeEditModal() {
    this.showEditModal = false;
    this.selectedArtikal = null;
  }

  // URL slike koja je trenutno izabrana u modalu
  getSelectedModalImage(): string {
    if (!this.selectedArtikal) return 'assets/no-image.png';
    const slike: any = (this.selectedArtikal as any).slike;

    if (Array.isArray(slike) && slike.length > 0) {
      const idx = Math.min(this.selectedImageIndex, slike.length - 1);
      return this.buildImageUrl(slike[idx]);
    }
    return this.buildImageUrl(slike as string);
  }

  // URL za thumbnail
  getModalThumb(path: string): string {
    return this.buildImageUrl(path);
  }

  selectImage(idx: number, event: MouseEvent) {
    event.stopPropagation();
    this.selectedImageIndex = idx;
  }

  nextModalImage(event: MouseEvent) {
    event.stopPropagation();
    if (!this.selectedArtikal) return;
    const slike: any = (this.selectedArtikal as any).slike;
    if (!Array.isArray(slike) || slike.length === 0) return;
    this.selectedImageIndex = (this.selectedImageIndex + 1) % slike.length;
  }

  prevModalImage(event: MouseEvent) {
    event.stopPropagation();
    if (!this.selectedArtikal) return;
    const slike: any = (this.selectedArtikal as any).slike;
    if (!Array.isArray(slike) || slike.length === 0) return;
    this.selectedImageIndex =
      (this.selectedImageIndex - 1 + slike.length) % slike.length;
  }

  saveArtikalChanges() {
    if (!this.selectedArtikal || this.editForm.invalid) {
      return;
    }

    const updated: any = {
      ...this.selectedArtikal,
      ...this.editForm.value,
      mainImageIndex: this.selectedImageIndex   // ovo je nova "naslovna" slika
    };

    console.log('Sačuvan artikal (za BE poziv):', updated);

    // TODO: ovde pozoveš ArtikalService.updateArtikal(updated)
    // this.artikalService.updateArtikal(updated).subscribe( ... )

    // lokalno osveži listu
    const idx = this.artikli.findIndex(a => a._id === this.selectedArtikal!._id);
    if (idx !== -1) {
      this.artikli[idx] = updated;
      this.cardImageIndex[updated._id] = this.selectedImageIndex;
    }

    this.closeEditModal();
  }
}
