import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

console.log('Main.js loaded');
gsap.registerPlugin(ScrollTrigger);

// Mouse Movement
let mouseX = 0;
let mouseY = 0;
const cursor = document.querySelector('.cursor');

window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) - 0.5;
    mouseY = (e.clientY / window.innerHeight) - 0.5;
    
    if (cursor) {
        gsap.to(cursor, {
            x: e.clientX - 20,
            y: e.clientY - 20,
            duration: 0.1
        });
    }
});

document.querySelectorAll('a, .neo-btn, .neo-card').forEach(el => {
    el.addEventListener('mouseenter', () => {
        if (cursor) gsap.to(cursor, { scale: 2, backgroundColor: '#ffffff', duration: 0.2 });
    });
    el.addEventListener('mouseleave', () => {
        if (cursor) gsap.to(cursor, { scale: 1, backgroundColor: '#bfff00', duration: 0.2 });
    });
});

// Modal Logic
const modal = document.querySelector('#project-modal');
const modalTitle = document.querySelector('#modal-title');
const iframe = document.querySelector('#project-iframe');
const closeBtn = document.querySelector('.close-btn');

console.log('Setting up modal logic');

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', () => {
        const url = card.getAttribute('data-url');
        const title = card.querySelector('h3').innerText;
        const isNewTab = card.getAttribute('data-newtab') === 'true';
        
        console.log('Project clicked:', title);
        
        if (isNewTab) {
            window.open(url, '_blank');
            return;
        }

        if (modal && modalTitle && iframe) {
            modalTitle.innerText = title;
            iframe.src = url;
            const externalLink = document.querySelector('#modal-external-link');
            if (externalLink) externalLink.href = url;
            
            modal.style.display = 'flex'; // Changed to flex for centering
            document.body.style.overflow = 'hidden'; // Lock background scrolling
            
            gsap.fromTo('.modal-content', 
                { scale: 0.8, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(1.7)" }
            );
        }
    });
});

if (closeBtn) {
    closeBtn.addEventListener('click', () => {
        gsap.to('.modal-content', {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
                if (modal) modal.style.display = 'none';
                if (iframe) iframe.src = '';
                document.body.style.overflow = ''; // Unlock background scrolling
            }
        });
    });
}

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        closeBtn.click();
    }
});

// Entrance Animations
console.log('Starting entrance animations');

gsap.from('.neo-text', {
    y: 100,
    opacity: 0,
    duration: 1.5,
    ease: "power4.out",
    delay: 0.2
});

gsap.from('.neo-subtitle', {
    x: -100,
    opacity: 0,
    duration: 1,
    ease: "back.out(1.7)",
    delay: 0.5
});

gsap.utils.toArray('.neo-card').forEach(card => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: "top bottom-=50",
            toggleActions: "play none none reverse"
        },
        y: 50,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out"
    });
});

// Dynamic Experience Calculation
const startDate = new Date(2020, 4); // May 2020 (Month is 0-indexed)
const currentDate = new Date();
const diffTime = Math.abs(currentDate - startDate);
const expYears = Math.floor(diffTime / (1000 * 60 * 60 * 24 * 365.25));

const expHero = document.getElementById('exp-years-hero');
const expAbout = document.getElementById('exp-years-about');
if (expHero) expHero.innerText = expYears;
if (expAbout) expAbout.innerText = expYears;

// Hero Role Text Effect
const roles = [
    "FRONTEND<br>DEVELOPER",
    "AIOps<br>TOOLS ENGINEER",
    "FULL STACK<br>DEVELOPER"
];

let currentRoleIndex = 0;
const roleText = document.getElementById('role-text');

if (roleText) {
    setInterval(() => {
        gsap.to(roleText, {
            opacity: 0,
            y: -20,
            duration: 0.4,
            ease: "power2.in",
            onComplete: () => {
                currentRoleIndex = (currentRoleIndex + 1) % roles.length;
                roleText.innerHTML = roles[currentRoleIndex];
                
                gsap.set(roleText, { y: 20 });
                
                gsap.to(roleText, {
                    opacity: 1,
                    y: 0,
                    duration: 0.5,
                    ease: "back.out(1.7)"
                });
            }
        });
    }, 3500);
}

console.log('Main.js setup complete');

// Neo-Brutalist Click Wave Background Effect
const rippleColors = ['#00e0ff', '#bfff00', '#f72585', '#7209b7', '#ffb703', '#f0ead6'];
let rippleIndex = 0;

window.addEventListener('click', (e) => {
    // Only trigger if clicking on the background (not cards/buttons)
    // Actually, triggering anywhere is cooler!
    
    const ripple = document.createElement('div');
    const size = Math.max(window.innerWidth, window.innerHeight) * 2.5; 
    
    rippleIndex = (rippleIndex + 1) % rippleColors.length;
    const color = rippleColors[rippleIndex];

    ripple.style.position = 'fixed';
    ripple.style.top = `${e.clientY}px`;
    ripple.style.left = `${e.clientX}px`;
    ripple.style.width = `${size}px`;
    ripple.style.height = `${size}px`;
    ripple.style.backgroundColor = color;
    ripple.style.borderRadius = '50%';
    ripple.style.transform = 'translate(-50%, -50%) scale(0)';
    ripple.style.zIndex = '-2';
    ripple.style.pointerEvents = 'none';

    document.body.appendChild(ripple);

    gsap.to(ripple, {
        scale: 1,
        duration: 1.2,
        ease: 'power2.inOut',
        onComplete: () => {
            // Update CSS variable so nav and modals update too
            document.documentElement.style.setProperty('--bg-color', color);
            ripple.remove();
        }
    });
});
