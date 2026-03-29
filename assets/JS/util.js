
class ModernApp {
  constructor(config) {
    this.config = config;
    this.elements = {
      body: document.body,
      navLinks: document.querySelectorAll('#nav a'),
      header: document.getElementById('header'),
      forms: document.querySelectorAll('form')
    };

    this.state = {
      isLocked: false,
      activeBreakpoints: new Set()
    };

    this.init();
  }

  init() {
    this.setupBreakpoints();
    this.setupSmoothScroll();
    this.setupScrollSpy();
    this.setupForms();
    this.setupMobilePanel();
    
    window.addEventListener('load', () => {
      setTimeout(() => this.elements.body.classList.remove('is-preload'), 100);
    });
  }

 
  setupBreakpoints() {
    Object.entries(this.config.breakpoints).forEach(([name, query]) => {
      const mql = window.matchMedia(query);
      const handler = (e) => {
        if (e.matches) this.state.activeBreakpoints.add(name);
        else this.state.activeBreakpoints.delete(name);
      };
      mql.addEventListener('change', handler);
      handler(mql); // Initial check
    });
  }

 
  setupSmoothScroll() {
    this.elements.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href.startsWith('#')) return;

        e.preventDefault();
        this.state.isLocked = true; 

        this.elements.navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        document.querySelector(href)?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });

        setTimeout(() => this.state.isLocked = false, 1000);
      });
    });
  }


  setupScrollSpy() {
    const observerOptions = { threshold: 0.5, rootMargin: '-10% 0px' };

    const observer = new IntersectionObserver((entries) => {
      if (this.state.isLocked) return;

      entries.forEach(entry => {
        const id = entry.target.getAttribute('id');
        const link = document.querySelector(`#nav a[href="#${id}"]`);

        if (entry.isIntersecting) {
          entry.target.classList.remove('inactive');
          this.elements.navLinks.forEach(l => l.classList.remove('active'));
          link?.classList.add('active');
        } else {
          entry.target.classList.add('inactive');
        }
      });
    }, observerOptions);

    this.elements.navLinks.forEach(link => {
      const section = document.querySelector(link.getAttribute('href'));
      if (section) observer.observe(section);
    });
  }


  setupMobilePanel() {
    const header = this.elements.header;
    if (!header) return;

    const toggle = document.createElement('div');
    toggle.id = 'headerToggle';
    toggle.innerHTML = '<a href="#header" class="toggle"></a>';
    this.elements.body.appendChild(toggle);

    toggle.addEventListener('click', () => {
      this.elements.body.classList.toggle('header-visible');
    });

    document.addEventListener('click', (e) => {
      if (this.elements.body.classList.contains('header-visible') && 
          !header.contains(e.target) && !toggle.contains(e.target)) {
        this.elements.body.classList.remove('header-visible');
      }
    });
  }

  setupForms() {
    this.elements.forms.forEach(form => {
      form.querySelectorAll('input[type="password"]').forEach(field => {
        const toggle = field.parentElement.querySelector('.password-toggle');
        toggle?.addEventListener('click', () => {
          field.type = field.type === 'password' ? 'text' : 'password';
        });
      });
    });
  }
}

const myApp = new ModernApp({
  breakpoints: {
    mobile: '(max-width: 736px)',
    tablet: '(min-width: 737px) and (max-width: 1024px)',
    desktop: '(min-width: 1025px)'
  }
});
