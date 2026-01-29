document.addEventListener('DOMContentLoaded', () => {
    // Service Worker Registration
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js')
            .then(() => console.log('Service Worker Registered'))
            .catch(err => console.error('Service Worker Registration Failed', err));
    }

    // PWA Install Logic
    let deferredPrompt;
    const installBtn = document.getElementById('install-btn');

    window.addEventListener('beforeinstallprompt', (e) => {
        // Prevent Chrome 67 and earlier from automatically showing the prompt
        e.preventDefault();
        // Stash the event so it can be triggered later.
        deferredPrompt = e;
        // Update UI to notify the user they can add to home screen
        if (installBtn) installBtn.style.display = 'inline-flex';
    });

    if (installBtn) {
        installBtn.addEventListener('click', () => {
            if (deferredPrompt) {
                // Show the prompt
                deferredPrompt.prompt();
                // Wait for the user to respond to the prompt
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('User accepted the install prompt');
                    } else {
                        console.log('User dismissed the install prompt');
                    }
                    deferredPrompt = null;
                    installBtn.style.display = 'none';
                });
            }
        });
    }

    // Background Particles
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            const size = Math.random() * 50 + 20;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.top = `${Math.random() * 100}vh`;
            particle.style.animationDelay = `${Math.random() * 20}s`;
            particle.style.animationDuration = `${Math.random() * 10 + 15}s`;
            particlesContainer.appendChild(particle);
        }
    }

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            menuToggle.querySelector('i').classList.toggle('fa-bars');
            menuToggle.querySelector('i').classList.toggle('fa-times');
        });
    }

    // Header Scroll Effect
    const header = document.querySelector('.header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Typing Effect for Hero Title
    const heroTitle = document.querySelector('.hero h1');
    if (heroTitle) {
        const text = heroTitle.innerText;
        heroTitle.innerText = '';
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'none';

        let i = 0;
        function typeWriter() {
            if (i < text.length) {
                heroTitle.innerHTML += text.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        }
        typeWriter();
    }

    // Enhanced Intersection Observer for Reveal Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');

                // Add staggered delay for children if needed
                if (entry.target.classList.contains('services-grid') || entry.target.classList.contains('tech-grid')) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        child.style.transitionDelay = `${index * 0.1}s`;
                        child.classList.add('visible');
                    });
                }

                if (entry.target.classList.contains('stat-item')) {
                    animateValue(entry.target.querySelector('.number'));
                }
            }
        });
    }, observerOptions);

    document.querySelectorAll('.fade-up, .reveal-left, .reveal-right, .reveal-up, .stat-item, .services-grid, .tech-grid, .reviews-grid, .floating-img').forEach(el => {
        observer.observe(el);
    });

    // Smooth Scroll for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                window.scrollTo({
                    top: target.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form Submission Handling (WhatsApp Redirect)
    const form = document.getElementById('appointment-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const mobile = document.getElementById('mobile').value;
            const message = document.getElementById('message').value;

            const doctorNumber = '966549048646';
            const whatsappText = `مرحباً د. غدير، لدي استفسار من الموقع:\n\n*الاسم:* ${name}\n*رقم الهاتف:* ${mobile}\n*الرسالة:* ${message}`;
            const encodedText = encodeURIComponent(whatsappText);

            const whatsappUrl = `https://wa.me/${doctorNumber}?text=${encodedText}`;

            // Open WhatsApp
            window.open(whatsappUrl, '_blank');

            // Visual feedback
            const btn = form.querySelector('button');
            const originalContent = btn.innerHTML;
            btn.innerHTML = 'تم التوجيه للواتساب...';
            btn.classList.add('success-btn');

            setTimeout(() => {
                btn.innerHTML = originalContent;
                btn.classList.remove('success-btn');
                form.reset();
            }, 3000);
        });
    }

    // Simple Number Animation
    function animateValue(obj) {
        if (!obj || obj.dataset.animated) return;

        const text = obj.innerText;
        const target = parseInt(text.replace(/\D/g, ''));
        const suffix = text.replace(/[0-9]/g, '');
        let start = 0;
        const duration = 2000;
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);

            // Ease out cubic
            const easeProgress = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(easeProgress * target);

            obj.innerText = suffix.startsWith('+') ? `+${current}` : `${current}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                obj.dataset.animated = "true";
            }
        }

        requestAnimationFrame(update);
    }
});

// Reviews Slider Logic
const initSlider = () => {
    const slider = document.querySelector('.reviews-slider');
    const items = document.querySelectorAll('.review-item');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.slider-dots');

    if (!slider || items.length === 0) return;

    let currentIndex = 0;

    // Create dots
    items.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    const goToSlide = (index) => {
        items[currentIndex].classList.remove('active');
        dots[currentIndex].classList.remove('active');

        currentIndex = index;
        if (currentIndex < 0) currentIndex = items.length - 1;
        if (currentIndex >= items.length) currentIndex = 0;

        items[currentIndex].classList.add('active');
        dots[currentIndex].classList.add('active');
    };

    if (prevBtn) prevBtn.addEventListener('click', () => goToSlide(currentIndex - 1));
    if (nextBtn) nextBtn.addEventListener('click', () => goToSlide(currentIndex + 1));

    // Auto slide
    setInterval(() => goToSlide(currentIndex + 1), 5000);

    // Set initial state
    items[0].classList.add('active');
};

initSlider();

// Hide Preloader on Window Load
window.addEventListener('load', () => {
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 800);
    }
});
