import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KorisnikService } from '../korisnik.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { ProdavnicaService } from '../prodavnica.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registrationForm!: FormGroup; // Koristimo formu, ali je dinamički kreiramo
  submitted = false;
  tipProfila: string = '';  // Varijabla za čuvanje tipa profila

  usernameError: string | null = null;
  emailError: string | null = null;

  constructor(private fb: FormBuilder, private korisnikService: KorisnikService, private router: Router, private prodavnicaService: ProdavnicaService, private http: HttpClient) {}

  ngOnInit(): void {}

  // Menja prikaz forme u zavisnosti od tipa profila i kreira odgovarajuću formu
  onTipProfilaChange(tip: string) {
    this.tipProfila = tip;

    if (tip === 'kupac') {
      this.registrationForm = this.fb.group({
        Korime: ['', Validators.required],
        ime: ['', Validators.required],
        prezime: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        lozinka: ['', Validators.required],
        lozinkaOpet: ['', Validators.required],
      }, { validator: this.passwordMatchValidator });
    } else if (tip === 'prodavac') {
      this.registrationForm = this.fb.group({
        ime: ['', Validators.required],  // Ime prodavnice
        address: ['', Validators.required],
        workingHoursStart: ['', Validators.required], // Početak radnog vremena
        workingHoursEnd: ['', Validators.required], // Kraj radnog vremena
        contactInfo: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        lozinka: ['', Validators.required],
        lozinkaOpet: ['', Validators.required]
      }, { validator: this.passwordMatchValidator });
    }
  }

  passwordMatchValidator(form: FormGroup) {
    const lozinka = form.get('lozinka');
    const lozinkaOpet = form.get('lozinkaOpet');
    return lozinka && lozinkaOpet && lozinka.value === lozinkaOpet.value ? null : { mismatch: true };
  }

  onSubmit() {
    this.submitted = true;
    console.log('Tip profila prilikom submit-a:', this.tipProfila); // Praćenje tipa profila

    if (this.registrationForm.valid && this.tipProfila=='kupac') {
      const username = this.registrationForm.get('Korime')?.value;
      const email = this.registrationForm.get('email')?.value;

      // Reset errors
      this.usernameError = null;
      this.emailError = null;

      // Kreiranje observables za proveru korisničkog imena i email-a
      const checkUsername$ = this.korisnikService.checkUserName(username);
      const checkEmail$ = this.korisnikService.checkEmail(email);

      // Pokrećemo obe provere istovremeno
      forkJoin([checkUsername$, checkEmail$]).subscribe(
        ([usernameResponse, emailResponse]: [any, any]) => {
          let hasError = false;

          // Provera korisničkog imena
          if (usernameResponse && usernameResponse._id) {
            this.usernameError = 'Korisničko ime je zauzeto.';
            this.registrationForm.get('Korime')?.setErrors({ taken: true });
            hasError = true;
          }

          // Provera email-a
          if (emailResponse && emailResponse._id) {
            this.emailError = 'Email je već u upotrebi.';
            this.registrationForm.get('email')?.setErrors({ taken: true });
            hasError = true;
          }

          // Ako nema grešaka, šaljemo zahtev za registraciju
          if (!hasError) {
            this.registerUser();
          }
        },
        (error) => {
          this.usernameError = 'Greška pri proveri korisničkog imena i email-a.';
        }
      );
    }else if(this.registrationForm.valid && this.tipProfila=='prodavac') {
      const email = this.registrationForm.get('email')?.value;
      this.emailError = null;

      this.prodavnicaService.checkEmail(email).subscribe(
        (response : any) => {
          if(response && response._id) {
            this.emailError = 'Email je već u upotrebi.';
            this.registrationForm.get('email')?.setErrors({ taken: true });
          }
          else{
            this.registerProdavnica();
          }
        },
        (error) => {
          this.usernameError = 'Greška pri proveri email-a.';
        }
      );
    }
       else {
      this.registrationForm.markAllAsTouched();
    }
  }

  registerUser() {
    if (this.registrationForm.valid) {
      const korisnikData = {
        username: this.registrationForm.get('Korime')?.value,
        password: this.registrationForm.get('lozinka')?.value,
        ime: this.registrationForm.get('ime')?.value,
        prezime: this.registrationForm.get('prezime')?.value,
        email: this.registrationForm.get('email')?.value,
        tipProfila: this.tipProfila // Dohvata tip profila
      };

      this.korisnikService.register(korisnikData.username, korisnikData.password, korisnikData.ime, korisnikData.prezime, korisnikData.email, korisnikData.tipProfila).subscribe(
        (response) => {
          alert('Uspešna registracija!');
          this.router.navigate(['/']);
        },
        (error) => {
          alert('Greška pri registraciji.');
        }
      );
    }
  }

  registerProdavnica() {
    const radnoVreme = `${this.registrationForm.get('workingHoursStart')?.value} - ${this.registrationForm.get('workingHoursEnd')?.value}`;
    if (this.registrationForm.valid) {
      const prodavnicaData = {
        password: this.registrationForm.get('lozinka')?.value,
        ime: this.registrationForm.get('ime')?.value,
        prezime: this.registrationForm.get('prezime')?.value,
        email: this.registrationForm.get('email')?.value,
        tipProfila: this.tipProfila, // Dohvata tip profila,
        address: this.registrationForm.get('address')?.value,
        workingHours: radnoVreme,
        contactInfo: this.registrationForm.get('contactInfo')?.value
      };

      this.prodavnicaService.register(prodavnicaData.ime, prodavnicaData.email, prodavnicaData.address, prodavnicaData.workingHours, prodavnicaData.contactInfo, prodavnicaData.password, prodavnicaData.tipProfila).subscribe(
        (response) => {
          const imagePath = '../assets/logo.jpg'; // Putanja do slike u assets
          this.http.get(imagePath, { responseType: 'blob' }).subscribe(
            (blob) => {
              // Konvertuj Blob u File objekat
              const file = new File([blob], 'logo.jpg', { type: blob.type });
      
              // Sada možeš poslati ovaj fajl na backend kao da je izabran sa inputa
              this.prodavnicaService.uploadProfileImage(prodavnicaData.email, file).subscribe(
                (response) => {
                  console.log('Slika uspešno uploadovana:', response);
                },
                (error) => {
                  console.error('Greška pri uploadu slike:', error);
                }
              );
            },
            (error) => {
              console.error('Greška pri učitavanju slike iz assets:', error);
            }
          );
          alert('Uspešna registracija!');
          this.router.navigate(['/']);
        },
        (error) => {
          alert('Greška pri registraciji.');
        }
      );


    // Prvo učitavamo sliku iz assets koristeći HttpClient
      
    }
  }
  getEmailErrorMessage() {
    const emailControl = this.registrationForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'Email je obavezan';
    } else if (emailControl?.hasError('email')) {
      return 'Neispravan email';
    } else if (emailControl?.hasError('taken')) {
      return 'Email je već u upotrebi.';
    }
    return '';
  }

  getConfirmPasswordErrorMessage() {
    const lozinkaOpetControl = this.registrationForm.get('lozinkaOpet');
    if (lozinkaOpetControl?.hasError('required')) {
      return 'Potvrda lozinke je obavezna';
    } else if (this.registrationForm.hasError('mismatch')) {
      return 'Lozinke se ne poklapaju';
    }
    return '';
  }

  getUsernameErrorMessage() {
    const usernameControl = this.registrationForm.get('Korime');
    if (usernameControl?.hasError('required')) {
      return 'Korisničko ime je obavezno';
    } else if (usernameControl?.hasError('taken')) {
      return 'Korisničko ime je zauzeto.';
    }
    return '';
  }

  
}
