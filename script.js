// ===== Particle Effects =====
function createParticles() {
    const container = document.getElementById('particles');
    const particleCount = 25;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        particle.style.width = (Math.random() * 3 + 1) + 'px';
        particle.style.height = particle.style.width;
        container.appendChild(particle);
    }
}

// ===== Scroll Animations =====
function initScrollAnimations() {
    const sections = document.querySelectorAll('.welcome, .details, .venue-info, .donation, .register');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    sections.forEach(section => observer.observe(section));
}

// ===== Generate Ticket ID =====
function generateTicketId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let id = 'OBI-';
    for (let i = 0; i < 8; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return id;
}

// ===== Form Submission & Ticket Generation =====
function initForm() {
    const form = document.getElementById('registerForm');
    const overlay = document.getElementById('ticketOverlay');
    const closeBtn = document.getElementById('ticketClose');

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();

        if (!name || !phone || !email) {
            return;
        }

        // Disable button while submitting
        const submitBtn = document.getElementById('submitBtn');
        const originalText = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Registering...</span>';

        let ticketId;

        try {
            const response = await fetch('api.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone, email })
            });
            const data = await response.json();

            if (data.success) {
                ticketId = data.ticketId;
                // Update ticket counter
                if (data.remaining !== undefined) {
                    updateTicketCounter(data.remaining, data.maxTickets);
                }
            } else {
                alert(data.message || 'Registration failed. Please try again.');
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
                return;
            }
        } catch (error) {
            // Fallback: generate ticket ID locally if API unavailable
            ticketId = generateTicketId();
        }

        // Populate ticket
        document.getElementById('ticketName').textContent = name;
        document.getElementById('ticketId').textContent = ticketId;

        // Show ticket overlay
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Reset form and button
        form.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    });

    // Close ticket
    closeBtn.addEventListener('click', function () {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    });

    // Close on overlay click (outside ticket)
    overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
}

// ===== Smooth Scroll for CTA =====
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ===== Ticket Availability Counter =====
function updateTicketCounter(remaining, maxTickets) {
    const ticketsLeft = document.getElementById('ticketsLeft');
    const ticketsBarFill = document.getElementById('ticketsBarFill');
    const ticketsUrgency = document.querySelector('.tickets-urgency');
    const submitBtn = document.getElementById('submitBtn');

    if (!ticketsLeft) return;

    const max = maxTickets || 100;
    remaining = Math.max(0, remaining);
    const percentage = (remaining / max) * 100;

    ticketsLeft.textContent = remaining;
    ticketsBarFill.style.width = percentage + '%';

    // Low stock styling
    if (remaining <= 20) {
        ticketsLeft.classList.add('low');
        ticketsBarFill.classList.add('low');
        ticketsUrgency.textContent = '🔥 Hurry! Only ' + remaining + ' spots left!';
        ticketsUrgency.style.color = '#E74C3C';
    }

    // Sold out
    if (remaining <= 0) {
        ticketsLeft.textContent = '0';
        ticketsUrgency.textContent = '❌ All 100 spots have been taken!';
        ticketsUrgency.classList.add('tickets-sold-out');
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span>Registration Closed</span>';
            submitBtn.style.opacity = '0.5';
            submitBtn.style.cursor = 'not-allowed';
        }
    }
}

async function fetchTicketCount() {
    try {
        const response = await fetch('api.php?action=count');
        const data = await response.json();
        if (data.success) {
            updateTicketCounter(data.remaining, data.maxTickets);
        }
    } catch (error) {
        // Silently fail - counter stays at default
    }
}

// ===== Initialize =====
document.addEventListener('DOMContentLoaded', function () {
    createParticles();
    initScrollAnimations();
    initForm();
    initSmoothScroll();
    fetchTicketCount();
});
