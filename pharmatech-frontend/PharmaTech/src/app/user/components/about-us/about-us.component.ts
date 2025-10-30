import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface AdminInfo {
  name: string;
  email: string;
  phone: string;
  message: string;
  facebook?: string;
  zalo?: string;
}

@Component({
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './about-us.component.html',
})
export class AboutUsComponent implements OnInit {
  aboutInfo: AdminInfo | null = null;
  error = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadAbout();
  }

  private loadAbout() {
    this.http.get<AdminInfo>('/api/accounts/about').subscribe({
      next: (res) => (this.aboutInfo = res),
      error: (err) => {
        console.error('Failed to load about info', err);
        this.error = 'Failed to load about information.';
      },
    });
  }
}
