import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
  templateUrl: './contact.component.html',
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;
  isSubmitting = false;
  submitSuccess = false;
  submitError = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      facebook: [''],
      zalo: [''],
      message: ['', Validators.required],
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.contactForm.invalid || this.isSubmitting) return;
    this.isSubmitting = true;
    this.submitSuccess = false;
    this.submitError = '';

    this.http.post('/api/accounts/contact', this.contactForm.value).subscribe({
      next: () => {
        this.submitSuccess = true;
        this.contactForm.reset();
        this.isSubmitting = false;
      },
      error: (err) => {
        console.error('Contact submit error', err);
        this.submitError = 'Failed to submit contact form. Please try again.';
        this.isSubmitting = false;
      },
    });
  }
}
