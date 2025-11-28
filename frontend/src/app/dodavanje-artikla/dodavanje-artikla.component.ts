import { Component, OnInit } from '@angular/core';
import { ProdavnicaService } from '../prodavnica.service';
import jwt_decode from 'jwt-decode';
import { ArtikalService } from '../artikal.service';

@Component({
  selector: 'app-dodavanje-artikla',
  templateUrl: './dodavanje-artikla.component.html',
  styleUrls: ['./dodavanje-artikla.component.css']
})
export class DodavanjeArtiklaComponent implements OnInit {
  artikli: any[] = [];
  email: string = '';
  errors: string[] = [];
  successMessage: string | null = null;

  constructor(
    private prodavnicaService: ProdavnicaService,
    private artikalService: ArtikalService
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwt_decode(token);
      this.email = decodedToken.email;
    }
  }

  removeArtikal(index: number): void {
    this.artikli.splice(index, 1);
    this.errors.splice(index, 1);
  }

  onFileChange(event: any) {
    const files: FileList = event.target.files;
    if (!files || files.length === 0) {
      return;
    }

    // Svaki upload = NOVI ARTIKAL
    const artikalIndex = this.artikli.length;

    const artikal: any = {
      images: [] as { file: File; preview: string }[],
      currentImageIndex: 0,
      tip: '',
      kategorija: '',
      velicina: '',
      boja: '',
      cena: '',
      opis: '',
      aiLoading: true,
      aiError: ''
    };

    this.artikli.push(artikal);
    this.errors.push('');

    // Učitavanje svih slika u preview za ovaj artikal
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();

      reader.onload = (e: any) => {
        artikal.images.push({
          file: file,
          preview: e.target.result
        });
      };

      reader.readAsDataURL(file);
    }

    // AI samo nad prvom slikom
    const firstFile = files[0];
    this.callAIForArtikal(artikalIndex, firstFile);

    // reset inputa da bi isti fajl mogao ponovo da se izabere ako treba
    event.target.value = '';
  }

  // Poziv AI klasifikacije ka backendu
  callAIForArtikal(index: number, fileForAI?: File) {
    const artikal = this.artikli[index];
    if (!artikal) return;

    const file = fileForAI || artikal.images?.[0]?.file;
    if (!file) {
      artikal.aiLoading = false;
      artikal.aiError = 'Nema slike za AI klasifikaciju.';
      return;
    }

    this.artikalService.classifyArtikal(file).subscribe(
      (res) => {
        // očekujemo { tip, kategorija, boja }
        artikal.tip = res.tip;
        artikal.kategorija = res.kategorija;
        artikal.boja = res.boja;
        artikal.aiLoading = false;
        artikal.aiError = '';
      },
      (err) => {
        console.error('AI klasifikacija nije uspela', err);
        artikal.aiLoading = false;
        artikal.aiError = 'AI nije uspeo da prepozna artikal, popunite ručno.';
      }
    );
  }

  // Ručno menjanje slika u carousel-u
  nextImage(artikalIndex: number) {
    const artikal = this.artikli[artikalIndex];
    if (!artikal || !artikal.images || artikal.images.length === 0) return;

    artikal.currentImageIndex =
      (artikal.currentImageIndex + 1) % artikal.images.length;
  }

  prevImage(artikalIndex: number) {
    const artikal = this.artikli[artikalIndex];
    if (!artikal || !artikal.images || artikal.images.length === 0) return;

    artikal.currentImageIndex =
      (artikal.currentImageIndex - 1 + artikal.images.length) %
      artikal.images.length;
  }

  goToImage(artikalIndex: number, imageIndex: number) {
    const artikal = this.artikli[artikalIndex];
    if (!artikal || !artikal.images || artikal.images.length === 0) return;

    artikal.currentImageIndex = imageIndex;
  }

  // Validacija: obavezno veličina i cena
  validateField(artikal: any, index: number) {
    if (!artikal.velicina || !artikal.cena) {
      this.errors[index] = 'Veličina i cena su obavezne.';
    } else {
      this.errors[index] = '';
    }
  }

  onSubmit() {
    let hasErrors = false;
    let savedCount = 0;

    this.artikli.forEach((artikal, index) => {
      if (!artikal.velicina || !artikal.cena) {
        this.errors[index] = 'Veličina i cena su obavezne.';
        hasErrors = true;
      } else {
        this.errors[index] = '';
      }
    });

    if (hasErrors) {
      return;
    }

    this.artikli.forEach((artikal, index) => {
      const formData = new FormData();

      // više slika za jedan artikal
      artikal.images.forEach((img: any) => {
        formData.append('images', img.file); // promeni key po potrebi
      });

      formData.append('tip', artikal.tip || 'Nepoznato');
      formData.append('kategorija', artikal.kategorija || 'Nepoznato');
      formData.append('velicina', artikal.velicina);
      formData.append('boja', artikal.boja || 'Nepoznata');
      formData.append('cena', artikal.cena);
      formData.append('opis', artikal.opis || '');
      formData.append('email', this.email);

      this.artikalService.saveArtikal(formData).subscribe(
        () => {
          savedCount++;
          if (savedCount === this.artikli.length) {
            this.successMessage = 'Svi artikli su uspešno sačuvani!';
            this.artikli = [];
            setTimeout(() => (this.successMessage = null), 5000);
          }
        },
        (error) => {
          console.error(`Greška pri čuvanju artikla ${index + 1}.`, error);
        }
      );
    });
  }
}
