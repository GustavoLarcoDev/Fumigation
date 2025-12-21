document.addEventListener('DOMContentLoaded', function() {
    // Preloader
    const preloader = document.querySelector('.preloader');
    
    // Hide preloader when page is fully loaded
    window.addEventListener('load', function() {
        preloader.classList.add('fade-out');
        setTimeout(() => {
            preloader.style.display = 'none';
        }, 500);
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu');
    const nav = document.querySelector('.nav');
    const navLinks = document.querySelectorAll('.nav ul li a');

    mobileMenuBtn.addEventListener('click', function() {
        nav.classList.toggle('active');
        this.querySelector('i').classList.toggle('fa-times');
        this.querySelector('i').classList.toggle('fa-bars');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            nav.classList.remove('active');
            mobileMenuBtn.querySelector('i').classList.remove('fa-times');
            mobileMenuBtn.querySelector('i').classList.add('fa-bars');
        });
    });

    // Sticky Header on Scroll
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scrolled');
            return;
        }
        
        if (currentScroll > lastScroll && !header.classList.contains('scrolled')) {
            // Scrolling down
            header.classList.add('scrolled');
        } else if (currentScroll < lastScroll && header.classList.contains('scrolled')) {
            // Scrolling up
            header.classList.remove('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Price Calculator
    const calculatorForm = document.querySelector('.calculator-form');
    const montoElement = document.getElementById('monto');
    const precioHectareaElement = document.getElementById('precio-hectarea');
    
    // Base price per hectare (this would typically come from a backend)
    const PRECIO_BASE = 50; // USD per hectare
    
    if (calculatorForm) {
        calculatorForm.addEventListener('change', calculateQuote);
        calculatorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculateQuote();
        });
        
        // Initial calculation
        calculateQuote();
    }
    
    function calculateQuote() {
        // Get form values
        const terreno = parseFloat(document.getElementById('terreno').value);
        const tamano = parseFloat(document.getElementById('tamano').value) || 0;
        const frecuencia = parseFloat(document.getElementById('frecuencia').value);
        const tipoPlaga = parseFloat(document.getElementById('tipo-plaga').value);
        
        // Calculate price per hectare
        let precioPorHectarea = PRECIO_BASE * terreno * tipoPlaga;
        
        // Calculate total price
        let total = precioPorHectarea * tamano * frecuencia;
        
        // Apply frequency discount
        if (frecuencia !== 1) {
            total = total * 0.9; // 10% discount for recurring services
        }
        
        // Update the UI
        montoElement.textContent = total.toFixed(2);
        precioHectareaElement.textContent = precioPorHectarea.toFixed(2);
    }

    // Contact Form Submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const formObject = {};
            formData.forEach((value, key) => {
                formObject[key] = value;
            });
            
            // Here you would typically send the form data to a server
            console.log('Form submitted:', formObject);
            
            // Show success message
            alert('¡Gracias por su mensaje! Nos pondremos en contacto con usted pronto.');
            this.reset();
        });
    }

    // Animate elements on scroll
    const animateOnScroll = function() {
        const elements = document.querySelectorAll('.service-card, .feature, .calculator-container, .contact-form');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }
        });
    };
    
    // Set initial styles for animation
    document.addEventListener('DOMContentLoaded', function() {
        const elements = document.querySelectorAll('.service-card, .feature, .calculator-container, .contact-form');
        elements.forEach(element => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        });
        
        // Initial check in case elements are already in view
        animateOnScroll();
    });
    
    // Check for animation on scroll
    window.addEventListener('scroll', animateOnScroll);

    // Testimonial Slider
    let currentSlide = 0;
    const testimonials = document.querySelectorAll('.testimonial');
    
    function showSlide(index) {
        testimonials.forEach((testimonial, i) => {
            testimonial.style.display = i === index ? 'block' : 'none';
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % testimonials.length;
        showSlide(currentSlide);
    }
    
    // Auto-advance testimonials every 5 seconds
    if (testimonials.length > 1) {
        showSlide(currentSlide);
        setInterval(nextSlide, 5000);
    }

    // Add active class to current section in navigation
    const sections = document.querySelectorAll('section');
    
    function highlightNavigation() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', highlightNavigation);
    
    // Initialize AOS (Animate On Scroll) for elements
    function initAOS() {
        const elements = document.querySelectorAll('[data-aos]');
        
        elements.forEach(element => {
            const position = element.getBoundingClientRect();
            
            // If element is in viewport
            if (position.top < window.innerHeight && position.bottom >= 0) {
                element.classList.add('aos-animate');
            }
        });
    }
    
    // Run AOS check on load and scroll
    window.addEventListener('load', initAOS);
    window.addEventListener('scroll', initAOS);
    
    // Add animation to hero content
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        heroContent.style.opacity = '0';
        heroContent.style.transform = 'translateY(30px)';
        heroContent.style.transition = 'opacity 1s ease-out, transform 1s ease-out';
        
        setTimeout(() => {
            heroContent.style.opacity = '1';
            heroContent.style.transform = 'translateY(0)';
        }, 500);
    }
    
    // Add parallax effect to hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        window.addEventListener('scroll', function() {
            const scrollPosition = window.pageYOffset;
            hero.style.backgroundPositionY = scrollPosition * 0.5 + 'px';
        });
    }
    
    // Add hover effect to service cards
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px)';
            this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.4)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 10px 20px rgba(0, 0, 0, 0.2)';
        });
    });
    
    // Add loading animation to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            this.classList.add('loading');
            
            // Simulate loading for demo purposes
            setTimeout(() => {
                this.classList.remove('loading');
            }, 1500);
        });
    });
    
    // Initialize tooltips
    const tooltips = document.querySelectorAll('[data-tooltip]');
    tooltips.forEach(tooltip => {
        tooltip.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltipElement = document.createElement('div');
            tooltipElement.className = 'tooltip';
            tooltipElement.textContent = tooltipText;
            document.body.appendChild(tooltipElement);
            
            const rect = this.getBoundingClientRect();
            tooltipElement.style.top = `${rect.top - tooltipElement.offsetHeight - 10}px`;
            tooltipElement.style.left = `${rect.left + (this.offsetWidth - tooltipElement.offsetWidth) / 2}px`;
            
            this.addEventListener('mouseleave', function() {
                document.body.removeChild(tooltipElement);
            }, { once: true });
        });
    });
    
    // Add animation to technology section
    const techImage = document.querySelector('.tech-image');
    if (techImage) {
        window.addEventListener('scroll', function() {
            const techSection = document.querySelector('.technology');
            const techSectionTop = techSection.offsetTop;
            const techSectionHeight = techSection.offsetHeight;
            const scrollPosition = window.pageYOffset;
            
            if (scrollPosition > techSectionTop - window.innerHeight + 100 && 
                scrollPosition < techSectionTop + techSectionHeight) {
                techImage.style.transform = 'translateY(0) rotate(0deg)';
                techImage.style.opacity = '1';
            }
        });
    }
    
    // Add animation to calculator section
    const calculatorContainer = document.querySelector('.calculator-container');
    if (calculatorContainer) {
        calculatorContainer.style.opacity = '0';
        calculatorContainer.style.transform = 'translateY(30px)';
        calculatorContainer.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    calculatorContainer.style.opacity = '1';
                    calculatorContainer.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(calculatorContainer);
    }
    
    // Add animation to contact form
    const contactFormElement = document.querySelector('.contact-form');
    if (contactFormElement) {
        contactFormElement.style.opacity = '0';
        contactFormElement.style.transform = 'translateX(50px)';
        contactFormElement.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    contactFormElement.style.opacity = '1';
                    contactFormElement.style.transform = 'translateX(0)';
                }
            });
        }, { threshold: 0.1 });
        
        observer.observe(contactFormElement);
    }
    
    // Add smooth scrolling to all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Add animation to service cards on scroll
    const serviceCardsElements = document.querySelectorAll('.service-card');
    serviceCardsElements.forEach((card, index) => {
        card.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Add animation to features on scroll
    const features = document.querySelectorAll('.feature');
    features.forEach((feature, index) => {
        feature.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Initialize scroll reveal for elements
    function initScrollReveal() {
        const elements = document.querySelectorAll('.service-card, .feature, .calculator-container, .contact-form, .tech-image, .tech-content');
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const screenPosition = window.innerHeight / 1.3;
            
            if (elementPosition < screenPosition) {
                element.style.opacity = '1';
                element.style.transform = 'translate(0)';
            }
        });
    }
    
    // Run scroll reveal on load and scroll
    window.addEventListener('load', initScrollReveal);
    window.addEventListener('scroll', initScrollReveal);
    
    // Add loading animation to form submission
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function() {
            const submitButton = this.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
                
                // Reset button after 3 seconds (simulating form submission)
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = 'Enviar Mensaje';
                }, 3000);
            }
        });
    });
    
    // Add animation to social links
    const socialLinks = document.querySelectorAll('.social-links a');
    socialLinks.forEach((link, index) => {
        link.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Add animation to contact methods
    const contactMethods = document.querySelectorAll('.contact-method');
    contactMethods.forEach((method, index) => {
        method.style.transitionDelay = `${index * 0.1}s`;
    });
    
    // Initialize video autoplay for hero section
    const heroVideo = document.getElementById('hero-video');
    if (heroVideo) {
        // Mute video for autoplay
        heroVideo.muted = true;
        
        // Play video when it's loaded
        heroVideo.addEventListener('loadedmetadata', function() {
            const playPromise = heroVideo.play();
            
            // Handle autoplay restrictions
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.log('Autoplay was prevented:', error);
                    // Show play button or other UI to let user start the video
                });
            }
        });
    }

    // Video Gallery: hover to enable sound + scale
    const videoCards = document.querySelectorAll('.video-card');
    const videoModal = document.getElementById('video-modal');
    const modalPlayer = document.getElementById('modal-player');
    const modalClose = document.querySelector('.video-modal-close');
    const modalBackdrop = document.querySelector('.video-modal-backdrop');

    // Only used when gallery uses image thumbs (not current setup)
    function createVideoThumbnail(videoSrc, imgEl) {
        if (!imgEl || imgEl.tagName !== 'IMG') return; // guard for current markup
        try {
            const video = document.createElement('video');
            video.src = videoSrc;
            video.muted = true;
            video.preload = 'auto';
            video.crossOrigin = 'anonymous';
            const captureFrame = () => {
                const canvas = document.createElement('canvas');
                const w = video.videoWidth || 640;
                const h = video.videoHeight || 360;
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(video, 0, 0, w, h);
                try { imgEl.src = canvas.toDataURL('image/jpeg'); } catch (_) {}
            };
            video.addEventListener('loadedmetadata', () => {
                const t = Math.min(1, (video.duration && video.duration / 3) || 0.1);
                const onSeeked = () => { captureFrame(); video.removeEventListener('seeked', onSeeked); };
                video.addEventListener('seeked', onSeeked);
                try { video.currentTime = t; } catch (_) { captureFrame(); }
            });
        } catch (_) {}
    }

    // Hover/touch sound behavior for inline gallery videos
    if (videoCards && videoCards.length) {
        const muteAllExcept = (keepEl) => {
            videoCards.forEach(c => {
                const v = c.querySelector('video.video-thumb');
                if (v && v !== keepEl) {
                    v.muted = true;
                    v.volume = 0.0;
                }
            });
        };

        videoCards.forEach(card => {
            const inlineVideo = card.querySelector('video.video-thumb');
            const imgThumb = card.querySelector('img.video-thumb');

            if (imgThumb) {
                const src = card.getAttribute('data-video');
                if (src) createVideoThumbnail(src, imgThumb);
            }

            if (inlineVideo) {
                // Ensure autoplay loop muted by default
                inlineVideo.muted = true;
                inlineVideo.loop = true;
                inlineVideo.playsInline = true;
                const playPromise = inlineVideo.play();
                if (playPromise && playPromise.catch) playPromise.catch(() => {});

                card.addEventListener('mouseenter', () => {
                    muteAllExcept(inlineVideo);
                    inlineVideo.muted = false;
                    inlineVideo.volume = 0.9;
                    const p = inlineVideo.play();
                    if (p && p.catch) p.catch(() => {});
                });

                card.addEventListener('mouseleave', () => {
                    inlineVideo.muted = true;
                    inlineVideo.volume = 0.0;
                });

                // Accessibility: focus/blur for keyboard users
                card.addEventListener('focusin', () => {
                    muteAllExcept(inlineVideo);
                    inlineVideo.muted = false;
                    inlineVideo.volume = 0.9;
                });
                card.addEventListener('focusout', () => {
                    inlineVideo.muted = true;
                    inlineVideo.volume = 0.0;
                });

                // Touch support (iPad): unmute on touchstart, remute on touchend/second tap
                card.addEventListener('touchstart', () => {
                    muteAllExcept(inlineVideo);
                    inlineVideo.muted = false;
                    inlineVideo.volume = 1.0;
                    const p = inlineVideo.play();
                    if (p && p.catch) p.catch(() => {});
                }, { passive: true });
                card.addEventListener('touchend', () => {
                    // Keep sound briefly to avoid abrupt cut; then mute after delay
                    setTimeout(() => {
                        inlineVideo.muted = true;
                        inlineVideo.volume = 0.0;
                    }, 800);
                });
            }
        });
    }

    // If modal elements exist (legacy), keep listeners harmless
    if (modalClose) modalClose.addEventListener('click', () => {
        if (modalPlayer) try { modalPlayer.pause(); } catch(_) {}
        if (videoModal) videoModal.classList.remove('active');
    });
    if (modalBackdrop) modalBackdrop.addEventListener('click', () => {
        if (modalPlayer) try { modalPlayer.pause(); } catch(_) {}
        if (videoModal) videoModal.classList.remove('active');
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal && videoModal.classList.contains('active')) {
            if (modalPlayer) try { modalPlayer.pause(); } catch(_) {}
            videoModal.classList.remove('active');
        }
    });
});
