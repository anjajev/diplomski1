import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import { PrijavaComponent } from './prijava/prijava.component';
import { KorisnikService } from './korisnik.service';
import { AuthInterceptor } from './auth.interceptor';
import { ProfilkorisnikComponent } from './profilkorisnik/profilkorisnik.component';
import { ProfilprodavacComponent } from './profilprodavac/profilprodavac.component';
import { InfoprodavciComponent } from './infoprodavci/infoprodavci.component';
import { DodavanjeArtiklaComponent } from './dodavanje-artikla/dodavanje-artikla.component';
import { ZenskaodecaComponent } from './zenskaodeca/zenskaodeca.component';
import { OmiljenaOdecaComponent } from './omiljena-odeca/omiljena-odeca.component';
import { KorpaComponent } from './korpa/korpa.component';
import { ArtikalDetaljiComponent } from './artikal-detalji/artikal-detalji.component';
import { ProdavacComponent } from './prodavac/prodavac.component';
import { OmiljeneProdavniceComponent } from './omiljene-prodavnice/omiljene-prodavnice.component';
import { PrethodneKupovineComponent } from './prethodne-kupovine/prethodne-kupovine.component';
import { PoruceniArtikliComponent } from './poruceni-artikli/poruceni-artikli.component';
import { PoslatiArtikliComponent } from './poslati-artikli/poslati-artikli.component';
import { VestiKupacComponent } from './vesti-kupac/vesti-kupac.component';
import { StatistikaComponent } from './statistika/statistika.component';



@NgModule({
  declarations: [
    AppComponent,
    RegisterComponent,
    HomeComponent,
    PrijavaComponent,
    ProfilkorisnikComponent,
    ProfilprodavacComponent,
    InfoprodavciComponent,
    DodavanjeArtiklaComponent,
    ZenskaodecaComponent,
    OmiljenaOdecaComponent,
    KorpaComponent,
    ArtikalDetaljiComponent,
    ProdavacComponent,
    OmiljeneProdavniceComponent,
    PrethodneKupovineComponent,
    PoruceniArtikliComponent,
    PoslatiArtikliComponent,
    VestiKupacComponent,
    StatistikaComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
   
  ],
  providers: [
    KorisnikService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true // Omogućava korišćenje više interceptora ako je potrebno
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
