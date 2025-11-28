import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Chart, registerables } from 'chart.js'; // Uvezi registerables
import { NarudzbineService } from '../narudzbine.service';

// Registruj sve potrebne komponente
Chart.register(...registerables);

@Component({
  selector: 'app-statistika',
  templateUrl: './statistika.component.html',
  styleUrls: ['./statistika.component.css']
})
export class StatistikaComponent {
  salesChart: Chart | undefined;

  constructor(private http: HttpClient, private ordersService: NarudzbineService) {}

  ngOnInit(): void {
    this.fetchSalesData();
  }

  fetchSalesData() {
    this.ordersService.getStatistika() // Poziv na getStatistika
    .subscribe(data => {
      this.createChart(data); // Prosledi podatke za kreiranje grafikona
    }, error => {
      console.error('Greška prilikom dohvatanja podataka:', error);
    });
  }

  createChart(data: { items: number; price: number }[]) {
    const ctx = document.getElementById('salesChart') as HTMLCanvasElement;

    this.salesChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'],
        datasets: [{
          label: 'Broj prodatih artikala',
          data: data.map(stat => stat.items), // Mapiraj items za prikaz
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Ukupna cena',
          data: data.map(stat => stat.price), // Mapiraj price za prikaz
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
