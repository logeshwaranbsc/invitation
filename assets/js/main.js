/* ==========================================================================
   Dineshkumar ♥ Madhumitha - Sky Blue & White Wedding Invitation JS Engine
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* --------------------------------------------------------------------------
       1. HERO SECTION SEQUENTIAL LOAD ANIMATION
       -------------------------------------------------------------------------- */
    function initHeroAnimations() {
        const heroElements = document.querySelectorAll('.reveal-hero');
        heroElements.forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('active');
            }, 300 + (index * 250)); // Staggered entry delay
        });
    }
    initHeroAnimations();

    /* --------------------------------------------------------------------------
       2. SCROLL INTERSECTION OBSERVER FOR SECTION ANIMATIONS
       -------------------------------------------------------------------------- */
    const revealOptions = {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const scrollObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, revealOptions);

    const revealSelectors = [
        '.scroll-reveal',
        '.scroll-slide-left',
        '.scroll-slide-right',
        '.scroll-scale-up',
        '.scroll-timeline-item'
    ];

    revealSelectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(el => scrollObserver.observe(el));
    });

    /* --------------------------------------------------------------------------
       3. DYNAMIC COUNTDOWN TIMER TO 17 SEPTEMBER 2026 09:00 AM
       -------------------------------------------------------------------------- */
    const targetDate = new Date('2026-09-17T09:00:00').getTime();

    const cdDays = document.getElementById('cd-days');
    const cdHours = document.getElementById('cd-hours');
    const cdMinutes = document.getElementById('cd-minutes');
    const cdSeconds = document.getElementById('cd-seconds');
    const countdownTimerContainer = document.getElementById('countdown-timer');
    const countdownFinishedMsg = document.getElementById('countdown-finished-msg');

    let prevValues = { days: '', hours: '', minutes: '', seconds: '' };

    function updateCountdown() {
        const now = new Date().getTime();
        const difference = targetDate - now;

        if (difference <= 0) {
            if (countdownTimerContainer) countdownTimerContainer.classList.add('hidden');
            if (countdownFinishedMsg) countdownFinishedMsg.classList.remove('hidden');
            return;
        }

        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        const currentValues = {
            days: String(days).padStart(2, '0'),
            hours: String(hours).padStart(2, '0'),
            minutes: String(minutes).padStart(2, '0'),
            seconds: String(seconds).padStart(2, '0')
        };

        updateUnit('cd-days', currentValues.days, prevValues.days);
        updateUnit('cd-hours', currentValues.hours, prevValues.hours);
        updateUnit('cd-minutes', currentValues.minutes, prevValues.minutes);
        updateUnit('cd-seconds', currentValues.seconds, prevValues.seconds);

        prevValues = currentValues;
    }

    function updateUnit(elementId, newVal, oldVal) {
        const el = document.getElementById(elementId);
        if (!el) return;
        if (newVal !== oldVal) {
            el.textContent = newVal;
            const parentBox = el.closest('.number-box');
            if (parentBox) {
                parentBox.classList.remove('tick-flip');
                void parentBox.offsetWidth;
                parentBox.classList.add('tick-flip');
            }
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);

    /* --------------------------------------------------------------------------
       4. VERTICAL TIMELINE SCROLL PROGRESS FILL
       -------------------------------------------------------------------------- */
    const timelineSection = document.getElementById('timeline');
    const timelineProgressBar = document.getElementById('timeline-progress-bar');
    const timelineItems = document.querySelectorAll('.timeline-item');

    function updateTimelineProgress() {
        if (!timelineSection || !timelineProgressBar) return;
        
        const rect = timelineSection.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        
        const totalHeight = rect.height;
        const currentTop = -rect.top + (viewportHeight * 0.5);
        
        let progress = (currentTop / totalHeight) * 100;
        progress = Math.max(0, Math.min(100, progress));
        
        timelineProgressBar.style.height = `${progress}%`;

        timelineItems.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            if (itemRect.top < viewportHeight * 0.65) {
                item.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', updateTimelineProgress);
    updateTimelineProgress();

    /* --------------------------------------------------------------------------
       5. TOP NAVBAR & FLOATING DOT INDICATOR ACTIVE HIGHLIGHT
       -------------------------------------------------------------------------- */
    const topNav = document.querySelector('.top-nav');
    const sections = document.querySelectorAll('section[id]');
    const navDots = document.querySelectorAll('.nav-dot');

    function handleScrollState() {
        if (window.scrollY > 80) {
            topNav.classList.add('scrolled');
        } else {
            topNav.classList.remove('scrolled');
        }

        let currentSectionId = '';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navDots.forEach(dot => {
            dot.classList.remove('active');
            if (dot.getAttribute('href') === `#${currentSectionId}`) {
                dot.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleScrollState);
    handleScrollState();

    /* --------------------------------------------------------------------------
       6. AUDIO MUSIC PLAYER & SOUND ENGINE
       -------------------------------------------------------------------------- */
    const musicBtn = document.getElementById('music-toggle-btn');
    const musicStatusText = document.getElementById('music-status');
    const weddingAudio = document.getElementById('wedding-audio');

    let isPlaying = false;
    let audioContext = null;

    function playAmbientSynth() {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
    }

    function toggleMusic() {
        if (!weddingAudio) return;

        if (isPlaying) {
            weddingAudio.pause();
            isPlaying = false;
            musicStatusText.textContent = 'Off';
            musicBtn.classList.add('paused');
        } else {
            weddingAudio.play().then(() => {
                isPlaying = true;
                musicStatusText.textContent = 'On';
                musicBtn.classList.remove('paused');
            }).catch(err => {
                console.log("Audio autoplay prevented, starting Web Audio synth fallback:", err);
                playAmbientSynth();
                isPlaying = true;
                musicStatusText.textContent = 'On';
                musicBtn.classList.remove('paused');
            });
        }
    }

    if (musicBtn) {
        musicBtn.addEventListener('click', toggleMusic);
    }

    /* --------------------------------------------------------------------------
       7. ADD TO CALENDAR (.ICS / GOOGLE CALENDAR GENERATOR)
       -------------------------------------------------------------------------- */
    const calendarBtns = document.querySelectorAll('.calendar-btn');

    calendarBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const title = btn.getAttribute('data-title');
            const startIso = btn.getAttribute('data-start');
            const location = btn.getAttribute('data-location');
            const details = "You are cordially invited to celebrate the wedding events of Dineshkumar & Madhumitha!";

            const startDateObj = new Date(startIso);
            const endDateObj = new Date(startDateObj.getTime() + (3 * 60 * 60 * 1000));

            const formatGCalDate = (d) => d.toISOString().replace(/-|:|\.\d\d\d/g, "");

            const gCalUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${formatGCalDate(startDateObj)}/${formatGCalDate(endDateObj)}&details=${encodeURIComponent(details)}&location=${encodeURIComponent(location)}`;

            window.open(gCalUrl, '_blank');
        });
    });

    /* --------------------------------------------------------------------------
       8. QUICK SHARE INVITATION BUTTON
       -------------------------------------------------------------------------- */
    const shareBtn = document.getElementById('share-invitation-btn');

    if (shareBtn) {
        shareBtn.addEventListener('click', async () => {
            const shareData = {
                title: 'Dineshkumar ♥ Madhumitha Wedding Invitation',
                text: 'We request the honour of your presence at the wedding celebrations of Dineshkumar & Madhumitha on 16th & 17th September 2026.',
                url: window.location.href
            };

            if (navigator.share) {
                try {
                    await navigator.share(shareData);
                } catch (err) {
                    console.log("Share dismissed");
                }
            } else {
                navigator.clipboard.writeText(window.location.href);
                showToast('Invitation link copied to clipboard! 📋');
            }
        });
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'custom-toast';
        toast.innerHTML = `<i class="fa-solid fa-heart"></i> ${message}`;
        toast.style.cssText = `
            position: fixed;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: #0F3254;
            color: #FFF0C2;
            padding: 12px 24px;
            border-radius: 30px;
            border: 1px solid #D4AF37;
            box-shadow: 0 10px 25px rgba(0,0,0,0.6);
            z-index: 1000;
            font-size: 0.9rem;
            font-weight: 500;
            animation: fadeIn 0.4s ease, fadeOut 0.4s ease 2.6s forwards;
        `;
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    /* --------------------------------------------------------------------------
       9. FALLING SKY BLUE & GOLD PARTICLES CANVAS ANIMATION
       -------------------------------------------------------------------------- */
    const canvas = document.getElementById('petals-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const numPetals = width < 768 ? 22 : 45;
    const petals = [];

    // Colors: Sky Blue, Silk White, Royal Blue Sparkle, Gold Dust
    const colors = [
        { fill: 'rgba(112, 185, 247, 0.65)', type: 'petal' },
        { fill: 'rgba(255, 255, 255, 0.75)', type: 'sparkle' },
        { fill: 'rgba(20, 93, 160, 0.55)', type: 'petal' },
        { fill: 'rgba(212, 175, 55, 0.6)', type: 'sparkle' }
    ];

    class Petal {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = -20 - (Math.random() * height * 0.5);
            this.size = Math.random() * 8 + 4;
            this.speedY = Math.random() * 1.2 + 0.6;
            this.speedX = Math.random() * 0.8 - 0.4;
            this.rotation = Math.random() * 360;
            this.spin = (Math.random() - 0.5) * 1.5;
            this.color = colors[Math.floor(Math.random() * colors.length)];
            this.opacity = Math.random() * 0.7 + 0.3;
        }

        update() {
            this.y += this.speedY;
            this.x += Math.sin(this.y * 0.01) + this.speedX;
            this.rotation += this.spin;

            if (this.y > height + 20) {
                this.reset();
            }
        }

        draw() {
            ctx.save();
            ctx.translate(this.x, this.y);
            ctx.rotate((this.rotation * Math.PI) / 180);
            ctx.fillStyle = this.color.fill;

            if (this.color.type === 'sparkle') {
                ctx.beginPath();
                ctx.arc(0, 0, this.size * 0.35, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.beginPath();
                ctx.moveTo(0, 0);
                ctx.bezierCurveTo(this.size, -this.size, this.size * 1.5, this.size, 0, this.size * 1.8);
                ctx.bezierCurveTo(-this.size * 1.5, this.size, -this.size, -this.size, 0, 0);
                ctx.fill();
            }

            ctx.restore();
        }
    }

    for (let i = 0; i < numPetals; i++) {
        petals.push(new Petal());
    }

    function animatePetals() {
        ctx.clearRect(0, 0, width, height);

        petals.forEach(petal => {
            petal.update();
            petal.draw();
        });

        requestAnimationFrame(animatePetals);
    }

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        animatePetals();
    }
});
