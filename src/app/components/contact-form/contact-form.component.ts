import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RecaptchaModule } from 'ng-recaptcha';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RecaptchaModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css',
})
export class ContactFormComponent {
  // CONFIGURATION: Replace these with your actual keys
  private readonly EMAILJS_SERVICE_ID = 'service_wy6z2nb';
  private readonly EMAILJS_TEMPLATE_ID = 'template_sjnvlgh';
  private readonly EMAILJS_PUBLIC_KEY = 'LDfx9y7uvuFDRSYy6';
  // SITE KEY: Get this from the Google Admin Console (v2 Checkbox)
  readonly RECAPTCHA_SITE_KEY = '6LfA9zUsAAAAANXo2uT8jjszn18U9357coo37YU9';

  formData = {
    name: '',
    email: '',
    message: '',
  };

  isSubmitting = false;
  captchaResolved = false;

  public handleCaptchaResolved(captchaResponse: string | null): void {
    this.captchaResolved = !!captchaResponse;
  }

  public async sendEmail(form: any) {
    if (form.invalid || !this.captchaResolved) {
      alert('Please fill out the form and verify the CAPTCHA.');
      return;
    }

    this.isSubmitting = true;

    try {
    
      const templateParams = {
        from_name: this.formData.name,
        from_email: this.formData.email,
        message: this.formData.message,
        to_name: 'Tanhum', // You can customize this
      };

      const response: EmailJSResponseStatus = await emailjs.send(
        this.EMAILJS_SERVICE_ID,
        this.EMAILJS_TEMPLATE_ID,
        templateParams,
        this.EMAILJS_PUBLIC_KEY
      );

      console.log('SUCCESS!', response.status, response.text);
      alert('Message sent successfully!');
      form.reset();
      this.formData = { name: '', email: '', message: '' };
      this.captchaResolved = false;
    } catch (error) {
      console.error('FAILED...', error);
      alert('Failed to send message. Please try again later.');
    } finally {
      this.isSubmitting = false;
    }
  }
}
