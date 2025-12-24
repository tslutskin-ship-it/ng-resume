import { Component, HostListener, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent } from '../carousel/carousel.component';
import { ContactFormComponent } from '../contact-form/contact-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, CarouselComponent, ContactFormComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements AfterViewChecked {
  public expandedBox: 'tech' | 'security' | 'contact' | null = null;
  private targetBox: { id: 'tech' | 'security' | 'contact', element: HTMLElement } | null = null;
  private transitionState: 'start' | 'animating' | 'end' = 'end';
  private firstRect: DOMRect | null = null;

  constructor(private el: ElementRef) {}

  ngAfterViewChecked() {
    if (this.transitionState === 'start' && this.targetBox) {
      const targetElement = this.targetBox.element;
      this.transitionState = 'animating';

      // LAST
      const lastRect = targetElement.getBoundingClientRect();

      // INVERT
      if (this.firstRect) {
        const deltaX = this.firstRect.left - lastRect.left;
        const deltaY = this.firstRect.top - lastRect.top;
        const deltaW = this.firstRect.width / lastRect.width;
        const deltaH = this.firstRect.height / lastRect.height;

        // Disable transition instantly to snap to start position
        targetElement.style.transition = 'none';
        targetElement.style.transformOrigin = 'top left';
        targetElement.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(${deltaW}, ${deltaH})`;
        
        // Force Reflow
        void targetElement.offsetWidth;
      }
      
      // PLAY
      // Double requestAnimationFrame to ensure the 'Invert' state is rendered before animating
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          targetElement.style.transition = 'transform 0.6s cubic-bezier(0.2, 0, 0.2, 1)'; // Smoother, slightly longer ease
          targetElement.style.transform = 'none';
          
          targetElement.addEventListener('transitionend', () => {
            this.transitionState = 'end';
            targetElement.style.transition = '';
            targetElement.style.transform = '';
          }, { once: true });
        });
      });
    }
  }

  @HostListener('document:keyup.escape', ['$event'])
  onKeyupHandler(event: any) {
    if (this.expandedBox) {
      this.collapseBox();
    }
  }

  expandBox(boxId: 'tech' | 'security' | 'contact', element: HTMLElement) {
    if (this.transitionState !== 'end' || this.expandedBox) return;
    
    this.targetBox = { id: boxId, element };
    this.firstRect = this.targetBox.element.getBoundingClientRect();
    this.transitionState = 'start';
    this.expandedBox = boxId; // Trigger the state change
  }

  collapseBox() {
    if (this.transitionState !== 'end' || !this.expandedBox) return;

    // The currently expanded element is our target
    const currentElement = this.el.nativeElement.querySelector(`.bento-box[data-box-id="${this.expandedBox}"]`);
    if (currentElement) {
      this.targetBox = { id: this.expandedBox, element: currentElement };
      this.firstRect = this.targetBox.element.getBoundingClientRect();
      this.transitionState = 'start';
      this.expandedBox = null; // Trigger the state change
    }
  }
}
