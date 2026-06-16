/**
 * Scroll Animations & Counter Module
 */

class AnimationManager {
  constructor() {
    this.observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.1
    };
    
    this.counters = document.querySelectorAll('.counter');
    this.scrollReveals = document.querySelectorAll('.scroll-reveal');
    
    this.init();
  }

  init() {
    // Intersection Observer for scroll reveals
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, this.observerOptions);

    this.scrollReveals.forEach(el => revealObserver.observe(el));

    // Counter animation observer
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, this.observerOptions);

    this.counters.forEach(el => counterObserver.observe(el));
  }

  animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000; // 2 seconds
    const startTime = performance.now();
    const startValue = 0;

    const updateCounter = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out cubic)
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(startValue + (target - startValue) * easeOut);
      
      element.textContent = currentValue;

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target;
      }
    };

    requestAnimationFrame(updateCounter);
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  window.animations = new AnimationManager();
});