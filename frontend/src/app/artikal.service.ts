import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Artikal } from './models/artikal';

@Injectable({
  providedIn: 'root'
})
export class ArtikalService {

  constructor(private http: HttpClient) { }

  private apiUrl = 'http://localhost:4000/artikal';
  

    // Function to save articles with associated data
  saveArtikal(formData: FormData): Observable<any> {
      return this.http.post(`${this.apiUrl}/dodaj`, formData);
  }

     // Get all articles for a store by email
  getArtikliByStoreEmail(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/store/${email}`);
  }

  // Update a specific article
  updateArtikal(id: string, artikal: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${id}`, artikal);
  }

  getArtikliByCategory(category: string) {
    return this.http.get<{ artikli: any[] }>(`${this.apiUrl}/category/${category}`);
  }
  
  getArtikalById(id: string): Observable<Artikal> {
    return this.http.get<Artikal>(`${this.apiUrl}/${id}`);
  }

  getArtikalWithProdavnica(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/artikal-with-prodavnica/${id}`);
  }

  getNoviArtikliZaKorisnika(korisnikId: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/novi-artikli`, { korisnikId });
  }

  classifyArtikal(file: File) {
  const formData = new FormData();
  formData.append('image', file);

  return this.http.post<{
    tip: string;
    kategorija: string;
    boja: string;
  }>('http://localhost:4000/api/classify-artikal', formData);
}

  
  
  
  
}
