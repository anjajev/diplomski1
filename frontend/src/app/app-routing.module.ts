import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { PrijavaComponent } from './prijava/prijava.component';
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



const routes: Routes = [
  { path: '', component: HomeComponent }, // Početna stranica
  { path: 'register', component: RegisterComponent }, // Nova stranica za registraciju
  { path: 'login', component: PrijavaComponent }, // Nova stranica za registraciju
  { path: 'profilkorisnik', component: ProfilkorisnikComponent ,  children: [
    { path: 'favouriteclothes', component: OmiljenaOdecaComponent },
    {path: 'korpa', component: KorpaComponent},
    {path: 'omiljeneprodavnice', component: OmiljeneProdavniceComponent},
    {path : 'prethodnekupovine', component: PrethodneKupovineComponent},
    {path : 'vesti-kupac', component: VestiKupacComponent},


  ]}, // Nova stranica za registraciju
  { path: 'profilprodavac', component: ProfilprodavacComponent,  children: [
    { path: '', redirectTo: 'info', pathMatch: 'full' },
    { path: 'info', component: InfoprodavciComponent },
    { path: 'artikli', component: DodavanjeArtiklaComponent },
    {path: 'poruceniartikli', component: PoruceniArtikliComponent},
    {path: 'poslatiartikli', component: PoslatiArtikliComponent},
    {path: 'statistikaProdaje', component: StatistikaComponent},

    // Dodaj sve ostale child rute za prodavca ovde
  ]
 }, // Nova stranica za registraciju
 { path: 'zenska-odeca', component: ZenskaodecaComponent },
 { path: 'artikal/:id', component: ArtikalDetaljiComponent },
 { path: 'prodavac/:id', component: ProdavacComponent }



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
