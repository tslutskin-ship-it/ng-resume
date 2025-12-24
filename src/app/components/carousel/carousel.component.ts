import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.css'
})
export class CarouselComponent {
  public currentIndex = 0;

  public slides = [
    {
      type: 'React',
      title: 'Project Manager App',
      description: 'Built with React, Zustand, and Tailwind CSS.',
      visual: '/assets/images/placeholder-react.png',
      liveLink: '#',
      codeLink: '#'
    },
    {
      type: 'Webflow',
      title: 'E-commerce Store',
      description: 'A live Webflow site for a local business.',
      visual: '/assets/images/placeholder-webflow.png',
      liveLink: '#',
    },
    {
      type: 'Behance',
      title: 'Brand Identity Redesign',
      description: 'Logo and branding guide for a startup.',
      visual: '/assets/images/placeholder-behance.png',
      liveLink: '#',
    }
  ];

  goToPrevious(): void {
    const isFirstSlide = this.currentIndex === 0;
    const newIndex = isFirstSlide ? this.slides.length - 1 : this.currentIndex - 1;
    this.currentIndex = newIndex;
  }

  goToNext(): void {
    const isLastSlide = this.currentIndex === this.slides.length - 1;
    const newIndex = isLastSlide ? 0 : this.currentIndex + 1;
    this.currentIndex = newIndex;
  }

  goToSlide(slideIndex: number): void {
    this.currentIndex = slideIndex;
  }
}
