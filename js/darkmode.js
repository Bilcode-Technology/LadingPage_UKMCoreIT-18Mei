/**
 * Dark Mode Toggle Module
 */

class DarkModeManager {
  constructor() {
    this.toggleBtn = document.getElementById('darkModeToggle');
    this.html = document.documentElement;
    this.storageKey = 'coreit_theme';
    this.init();
  }

  init() {
    // Check saved preference
    const savedTheme = localStorage.getItem(this.storageKey);
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && systemPrefersDark)) {
      this.enableDark();
    }

    // Toggle event
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.toggle());
    }

    // Listen for system changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem(this.storageKey)) {
        e.matches ? this.enableDark() : this.disableDark();
      }
    });
  }

  enableDark() {
    this.html.classList.add('dark');
    localStorage.setItem(this.storageKey, 'dark');
  }

  disableDark() {
    this.html.classList.remove('dark');
    localStorage.setItem(this.storageKey, 'light');
  }

  toggle() {
    if (this.html.classList.contains('dark')) {
      this.disableDark();
    } else {
      this.enableDark();
    }
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.darkMode = new DarkModeManager();
});