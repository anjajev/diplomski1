import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KorisnikService } from '../korisnik.service';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode'; // Uvezi jwt-decode
import { ProdavnicaService } from '../prodavnica.service';


@Component({
  selector: 'app-prijava',
  templateUrl: './prijava.component.html',
  styleUrls: ['./prijava.component.css']
})
export class PrijavaComponent {
  loginForm: FormGroup;
  submitted = false;

  resetPasswordModalVisible = false; // Kontrola vidljivosti modala
  resetEmail: string = ''; // Za email koji se koristi za resetovanje lozinke
  emailError: string | null = null;
  loginError: string | null = null;
  resetError: string | null = null;
  resetSuccess: string | null = null;

  constructor(private fb: FormBuilder, private korisnikService: KorisnikService, private router: Router, private prodavnicaService: ProdavnicaService) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      lozinka: ['', Validators.required],
      tipPrijave: ['', Validators.required]  // Dodali smo tip prijave
    });
  }

  ngOnInit(): void {}

  onSubmit() {
    this.submitted = true;
    if (this.loginForm.valid) {
      const email = this.loginForm.get('email')?.value;
      const lozinka = this.loginForm.get('lozinka')?.value;
      const tipPrijave = this.loginForm.get('tipPrijave')?.value; // Dohvatamo tip profila

      // Reset errors
      this.emailError = null;
      this.loginError = null;

      if(tipPrijave == 'kupac') {
        this.korisnikService.login(email, lozinka).subscribe(
          (response: any) => {
            if (response && response.token) {
              // Uspešna prijava - snimanje JWT tokena u localStorage
  
              // Preusmeravanje na početnu stranicu ili dashboard
              const decodedToken: any = jwt_decode(response.token);
              const tipProfila = decodedToken.tip; // Pretpostavljamo da u JWT postoji polje "tipProfila"
  
              // Preusmeravanje na odgovarajući profil
             this.router.navigate(['/']);
            }  else {
              this.loginError = 'Neuspešna prijava. Proverite email i lozinku.';
            }
          },
          (error) => {
            this.loginError = 'Greška pri prijavi. Proverite email i lozinku.';
          }
        );
      }
    else {
      this.prodavnicaService.login(email, lozinka).subscribe(
        (response: any) => {
          if (response && response.token) {
            localStorage.setItem('token', response.token);

            const decodedToken: any = jwt_decode(response.token);
            const tipProfila = decodedToken.tip; // Pretpostavljamo da u JWT postoji polje "tipProfila"

            // Preusmeravanje na odgovarajući profil
           this.router.navigate(['/']);
          }  else {
            this.loginError = 'Neuspešna prijava. Proverite email i lozinku.';
          }
        },
        (error) => {
          this.loginError = 'Greška pri prijavi. Proverite email i lozinku.';
        }
      );
    }

    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  getEmailErrorMessage() {
    const emailControl = this.loginForm.get('email');
    if (emailControl?.hasError('required')) {
      return 'Email je obavezan';
    } else if (emailControl?.hasError('email')) {
      return 'Neispravan email';
    }
    return '';
  }

  getPasswordErrorMessage() {
    const lozinkaControl = this.loginForm.get('lozinka');
    if (lozinkaControl?.hasError('required')) {
      return 'Lozinka je obavezna';
    }
    return '';
  }

  getLoginError() {
    return this.loginError;
  }

  openResetPasswordModal(event: Event) {
    event.preventDefault(); // Sprečava podrazumevano ponašanje linka
    this.resetPasswordModalVisible = true; // Prikazujemo modal
}

closeResetPasswordModal() {
    this.resetPasswordModalVisible = false; // Sakrivanje modala
    this.resetEmail = ''; // Čišćenje email polja
}

onResetPassword() {
  this.korisnikService.resetPassword(this.resetEmail).subscribe(
    (response) => {
      this.resetSuccess = 'Proverite svoj email za dalja uputstva.';
      this.resetEmail = ''; // Očisti polje
    },
    (error) => {
      this.resetError = 'Dogodila se greška. Proverite da li je email ispravan.';
    }
  );
}
}

