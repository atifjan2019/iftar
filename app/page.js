'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

export default function HomePage() {
    const [ticketsLeft, setTicketsLeft] = useState(100);
    const [maxTickets, setMaxTickets] = useState(100);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showTicket, setShowTicket] = useState(false);
    const [ticketName, setTicketName] = useState('');
    const [ticketId, setTicketId] = useState('');
    const particlesRef = useRef(null);

    // ===== Create floating particles =====
    useEffect(() => {
        const container = particlesRef.current;
        if (!container) return;
        for (let i = 0; i < 25; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
            particle.style.animationDelay = (Math.random() * 10) + 's';
            particle.style.width = (Math.random() * 3 + 1) + 'px';
            particle.style.height = particle.style.width;
            container.appendChild(particle);
        }
        return () => { container.innerHTML = ''; };
    }, []);

    // ===== Scroll animations =====
    useEffect(() => {
        const sections = document.querySelectorAll('.welcome, .details, .venue-info, .donation, .register');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        sections.forEach(section => observer.observe(section));
        return () => observer.disconnect();
    }, []);

    // ===== Fetch ticket count =====
    useEffect(() => {
        async function fetchCount() {
            try {
                const res = await fetch('/api/count');
                const data = await res.json();
                if (data.success) {
                    setTicketsLeft(data.remaining);
                    setMaxTickets(data.maxTickets);
                }
            } catch { /* silent fail */ }
        }
        fetchCount();
    }, []);

    // ===== Update ticket counter UI =====
    const percentage = (ticketsLeft / maxTickets) * 100;
    const isLow = ticketsLeft <= 20;
    const isSoldOut = ticketsLeft <= 0;

    // ===== Form submission =====
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        const form = e.target;
        const name = form.name.value.trim();
        const phone = form.phone.value.trim();
        const email = form.email.value.trim();

        if (!name || !phone || !email) return;

        setIsSubmitting(true);

        try {
            const res = await fetch('/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, phone, email }),
            });
            const data = await res.json();

            if (data.success) {
                setTicketName(name);
                setTicketId(data.ticketId);
                setShowTicket(true);
                document.body.style.overflow = 'hidden';
                if (data.remaining !== undefined) {
                    setTicketsLeft(data.remaining);
                    setMaxTickets(data.maxTickets);
                }
                form.reset();
            } else {
                alert(data.message || 'Registration failed. Please try again.');
            }
        } catch {
            alert('Network error. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    // ===== Close ticket modal =====
    const closeTicket = useCallback(() => {
        setShowTicket(false);
        document.body.style.overflow = '';
    }, []);

    // ===== Escape key closes ticket =====
    useEffect(() => {
        const handleKey = (e) => {
            if (e.key === 'Escape' && showTicket) closeTicket();
        };
        document.addEventListener('keydown', handleKey);
        return () => document.removeEventListener('keydown', handleKey);
    }, [showTicket, closeTicket]);

    return (
        <>
            {/* Islamic Geometric Pattern Overlay */}
            <div className="pattern-overlay"></div>

            {/* Floating Particles */}
            <div className="particles" id="particles" ref={particlesRef}></div>

            {/* Hero Section */}
            <header className="hero">
                <div className="hero-content">
                    <div className="bismillah" style={{ fontFamily: 'var(--font-amiri), Amiri, serif' }}>
                        بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                    </div>
                    <div className="crescent-icon">
                        <svg viewBox="0 0 100 100" width="80" height="80">
                            <path d="M50 5C25.2 5 5 25.2 5 50s20.2 45 45 45c8.3 0 16.1-2.3 22.8-6.2C60.5 82.5 50 67.5 50 50s10.5-32.5 22.8-38.8C66.1 7.3 58.3 5 50 5z" fill="currentColor" />
                            <circle cx="78" cy="22" r="4" fill="currentColor" />
                        </svg>
                    </div>
                    <h1 className="hero-title">Oldham Brothers<br /><span>Iftar Gathering</span></h1>
                    <p className="hero-date">Tuesday, 10th March 2026 &bull; Ramadan 1447</p>
                    <div className="hero-badge">FREE EVENT &bull; BROTHERS ONLY</div>
                    <a href="#register" className="cta-button" onClick={(e) => {
                        e.preventDefault();
                        document.getElementById('register')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }}>
                        <span>Register Now</span>
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M5 12h14M12 5l7 7-7 7" />
                        </svg>
                    </a>
                </div>
                <div className="scroll-indicator">
                    <span>Scroll Down</span>
                    <div className="scroll-arrow"></div>
                </div>
            </header>

            {/* Welcome Section */}
            <section className="welcome" id="about">
                <div className="container">
                    <div className="section-decoration">
                        <svg viewBox="0 0 200 20" width="200" height="20">
                            <path d="M0 10 Q25 0, 50 10 Q75 20, 100 10 Q125 0, 150 10 Q175 20, 200 10" stroke="currentColor" fill="none" strokeWidth="1.5" />
                        </svg>
                    </div>
                    <h2 className="section-title">Assalamu Alaikum Everyone</h2>
                    <p className="welcome-text">
                        We hope you&apos;re all having a blessed Ramadan. We&apos;d like to invite you to join us for a special Iftar gathering on <strong>Tuesday, 10th March</strong>. This gathering will be for <strong>brothers only</strong>, and the meal will be <strong>completely free</strong>.
                    </p>
                    <p className="welcome-text">
                        In the spirit of Ramadan, let&apos;s come together as one Ummah. This is more than just a meal — it&apos;s an opportunity to strengthen the bonds of brotherhood, to build connections within our Oldham community, and to share in the blessings of this sacred month together. Whether you&apos;re new to the area or have been here for years, you are warmly welcome.
                    </p>
                    <div className="quran-verse">
                        <p className="arabic" style={{ fontFamily: 'var(--font-amiri), Amiri, serif' }}>&quot;وَتَعَاوَنُوا عَلَى الْبِرِّ وَالتَّقْوَىٰ&quot;</p>
                        <p className="translation">&quot;And cooperate in righteousness and piety.&quot;</p>
                        <p className="reference">— Surah Al-Ma&apos;idah (5:2)</p>
                    </div>
                </div>
            </section>

            {/* Event Details Section */}
            <section className="details" id="details">
                <div className="container">
                    <h2 className="section-title">Event Details</h2>
                    <div className="details-grid">
                        <div className="detail-card">
                            <div className="detail-icon">
                                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                    <text x="12" y="18" textAnchor="middle" fontSize="7" fill="currentColor" stroke="none" fontWeight="bold">10</text>
                                </svg>
                            </div>
                            <h3>Date</h3>
                            <p>Tuesday, 10th March 2026</p>
                            <span className="detail-sub">During the blessed month of Ramadan</span>
                        </div>
                        <div className="detail-card">
                            <div className="detail-icon">
                                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <circle cx="12" cy="12" r="10" />
                                    <polyline points="12 6 12 12 16 14" />
                                </svg>
                            </div>
                            <h3>Time</h3>
                            <p>From 5:00 PM Onwards</p>
                            <span className="detail-sub">Arrive early to settle in before Iftar</span>
                        </div>
                        <div className="detail-card">
                            <div className="detail-icon">
                                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                                    <circle cx="12" cy="10" r="3" />
                                </svg>
                            </div>
                            <h3>Location</h3>
                            <p>Bittersweet</p>
                            <span className="detail-sub">Old Town Hall, Parliament Square,<br />Oldham OL1 1PL</span>
                        </div>
                        <div className="detail-card">
                            <div className="detail-icon">
                                <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
                                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </div>
                            <h3>Who</h3>
                            <p>Brothers Only</p>
                            <span className="detail-sub">All brothers from the community are welcome</span>
                        </div>
                    </div>

                    {/* Map Embed */}
                    <div className="map-container">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2367.5!2d-2.1076!3d53.5407!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x487bba1c7e49e5f9%3A0x8f02b6c5d9c3e2a1!2sParliament%20Square%2C%20Oldham%20OL1%201PL!5e0!3m2!1sen!2suk!4v1709000000000!5m2!1sen!2suk"
                            width="100%"
                            height="300"
                            style={{ border: 0, borderRadius: '16px' }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                        <a href="https://www.google.com/maps/dir/?api=1&destination=Parliament+Square%2C+Oldham+OL1+1PL" target="_blank" rel="noopener noreferrer" className="directions-button">
                            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 11l19-9-9 19-2-8-8-2z" />
                            </svg>
                            Get Directions
                        </a>
                    </div>
                </div>
            </section>

            {/* Bittersweet Section */}
            <section className="venue-info">
                <div className="container">
                    <div className="venue-card">
                        <div className="venue-badge">🙏 A Special Thanks</div>
                        <div className="venue-logo">
                            <img src="/images/bittersweet-logo.png" alt="Bittersweet - Brunch & Desserts" />
                        </div>
                        <p>
                            We are grateful to <strong>Bittersweet</strong> for allowing us to use their premises for this event. It&apos;s one of the best brunch and dessert spots in Oldham, so definitely worth checking out!
                        </p>
                        <div className="venue-hours">
                            <div className="venue-hours-item">
                                <span className="venue-label">🌙 During Ramadan (Sehri)</span>
                                <span className="venue-time">1:30 AM – 4:30 AM</span>
                            </div>
                            <div className="venue-hours-item">
                                <span className="venue-label">☀️ Daytime (Ramadan)</span>
                                <span className="venue-time">Closed</span>
                            </div>
                            <div className="venue-hours-item">
                                <span className="venue-label">📅 After Ramadan</span>
                                <span className="venue-time">Normal Opening Hours</span>
                            </div>
                        </div>
                        <p className="venue-social">Keep an eye on their socials for menu updates and more!</p>
                    </div>
                </div>
            </section>

            {/* Donation Section */}
            <section className="donation" id="donate">
                <div className="container">
                    <div className="donation-card">
                        <div className="donation-icon">🤲</div>
                        <h2 className="donation-title">Support Our Palestinian Brothers &amp; Sisters</h2>
                        <p className="donation-text">
                            There will be a <strong>donation box</strong> available at the venue. Feel free to donate whatever you can — <strong>100% of all donations</strong> will go directly towards supporting our displaced Palestinian brothers, sisters, and children.
                        </p>
                        <div className="donation-verse">
                            <p className="arabic" style={{ fontFamily: 'var(--font-amiri), Amiri, serif' }}>&quot;مَّن ذَا الَّذِي يُقْرِضُ اللَّهَ قَرْضًا حَسَنًا فَيُضَاعِفَهُ لَهُ أَضْعَافًا كَثِيرَةً&quot;</p>
                            <p className="translation">&quot;Who is it that would loan Allah a goodly loan so He may multiply it for him many times over?&quot;</p>
                            <p className="reference">— Surah Al-Baqarah (2:245)</p>
                        </div>
                        <div className="donation-badge">🇵🇸 100% Goes to Palestine</div>
                    </div>
                </div>
            </section>

            {/* Registration Form Section */}
            <section className="register" id="register">
                <div className="container">
                    <h2 className="section-title">Register Your Spot</h2>
                    <div className="tickets-remaining" id="ticketsRemaining">
                        <div className="tickets-counter">
                            <span className={`tickets-number${isLow ? ' low' : ''}`}>{ticketsLeft}</span>
                            <span className="tickets-label">spots remaining out of {maxTickets}</span>
                        </div>
                        <div className="tickets-bar">
                            <div className={`tickets-bar-fill${isLow ? ' low' : ''}`} style={{ width: `${percentage}%` }}></div>
                        </div>
                        <p className={`tickets-urgency${isSoldOut ? ' tickets-sold-out' : ''}`} style={isLow && !isSoldOut ? { color: '#E74C3C' } : {}}>
                            {isSoldOut
                                ? '❌ All 100 spots have been taken!'
                                : isLow
                                    ? `🔥 Hurry! Only ${ticketsLeft} spots left!`
                                    : '⚡ First come, first served — limited spots available!'}
                        </p>
                    </div>
                    <p className="register-subtitle">
                        Fill in your details below to receive your free Iftar ticket. <br />It&apos;s completely free — just bring yourself and your best energy!
                    </p>

                    <form className="register-form" id="registerForm" onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="name">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                                Full Name
                            </label>
                            <input type="text" id="name" name="name" placeholder="Enter your full name" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                                </svg>
                                Phone Number
                            </label>
                            <input type="tel" id="phone" name="phone" placeholder="Enter your phone number" required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">
                                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                    <polyline points="22,6 12,13 2,6" />
                                </svg>
                                Email Address
                            </label>
                            <input type="email" id="email" name="email" placeholder="Enter your email address" required />
                        </div>
                        <button type="submit" className="submit-button" id="submitBtn" disabled={isSubmitting || isSoldOut} style={isSoldOut ? { opacity: 0.5, cursor: 'not-allowed' } : {}}>
                            <span>{isSoldOut ? 'Registration Closed' : isSubmitting ? 'Registering...' : 'Get Your Free Ticket'}</span>
                            {!isSoldOut && !isSubmitting && (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            )}
                        </button>
                    </form>
                </div>
            </section>

            {/* Ticket Modal */}
            {showTicket && (
                <div className="ticket-overlay active" onClick={(e) => { if (e.target === e.currentTarget) closeTicket(); }}>
                    <div className="ticket-modal">
                        <div className="ticket-close" onClick={closeTicket}>&times;</div>
                        <div className="ticket">
                            <div className="ticket-header">
                                <div className="ticket-bismillah" style={{ fontFamily: 'var(--font-amiri), Amiri, serif' }}>بِسْمِ ٱللَّٰهِ</div>
                                <div className="ticket-crescent">
                                    <svg viewBox="0 0 100 100" width="50" height="50">
                                        <path d="M50 5C25.2 5 5 25.2 5 50s20.2 45 45 45c8.3 0 16.1-2.3 22.8-6.2C60.5 82.5 50 67.5 50 50s10.5-32.5 22.8-38.8C66.1 7.3 58.3 5 50 5z" fill="#D4AF37" />
                                        <circle cx="78" cy="22" r="4" fill="#D4AF37" />
                                    </svg>
                                </div>
                                <h2 className="ticket-title">Iftar Gathering</h2>
                                <p className="ticket-subtitle">Oldham Brothers Community</p>
                            </div>
                            <div className="ticket-divider">
                                <div className="ticket-notch ticket-notch-left"></div>
                                <div className="ticket-dash"></div>
                                <div className="ticket-notch ticket-notch-right"></div>
                            </div>
                            <div className="ticket-body">
                                <div className="ticket-info-row">
                                    <div className="ticket-info">
                                        <span className="ticket-label">Guest Name</span>
                                        <span className="ticket-value">{ticketName}</span>
                                    </div>
                                </div>
                                <div className="ticket-info-row two-col">
                                    <div className="ticket-info">
                                        <span className="ticket-label">Date</span>
                                        <span className="ticket-value">Tue, 10th March</span>
                                    </div>
                                    <div className="ticket-info">
                                        <span className="ticket-label">Time</span>
                                        <span className="ticket-value">5:00 PM</span>
                                    </div>
                                </div>
                                <div className="ticket-info-row">
                                    <div className="ticket-info">
                                        <span className="ticket-label">Venue</span>
                                        <span className="ticket-value">Bittersweet, Old Town Hall</span>
                                    </div>
                                </div>
                                <div className="ticket-info-row">
                                    <div className="ticket-info">
                                        <span className="ticket-label">Address</span>
                                        <span className="ticket-value">Parliament Square, Oldham OL1 1PL</span>
                                    </div>
                                </div>
                                <div className="ticket-id-section">
                                    <span className="ticket-label">Ticket ID</span>
                                    <span className="ticket-id">{ticketId}</span>
                                </div>
                            </div>
                            <div className="ticket-footer">
                                <p>Brothers Only &bull; Free Entry &bull; Ramadan 1447</p>
                                <p className="ticket-donation">🤲 If you&apos;d like to donate, there will be a donation box at the venue</p>
                                <p className="ticket-reminder">📸 Screenshot this ticket and present it at the venue</p>
                            </div>
                        </div>
                        <p className="screenshot-hint">Take a screenshot of this ticket to present at the event</p>
                    </div>
                </div>
            )}

            {/* Footer */}
            <footer className="footer">
                <div className="container">
                    <div className="footer-content">
                        <p className="footer-dua" style={{ fontFamily: 'var(--font-amiri), Amiri, serif' }}>رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ</p>
                        <p className="footer-dua-translation">&quot;Our Lord, accept from us. Indeed, You are the All-Hearing, the All-Knowing.&quot;</p>
                        <p className="footer-text">We hope to see you there, inshaAllah. 🤲</p>

                        <div className="collaboration">
                            <p className="collab-label">In Partnership With</p>
                            <div className="collab-logos">
                                <div className="collab-logo">
                                    <img src="/images/prestige-performance.png" alt="Prestige Performance" />
                                </div>
                                <div className="collab-logo lbt-logo">
                                    <img src="/images/lbt-logo.png" alt="Littleborough Balti Taste" />
                                </div>
                                <div className="collab-logo">
                                    <img src="/images/webspires-logo.png" alt="Webspires" />
                                </div>
                            </div>
                        </div>

                        <p className="footer-copy">&copy; 2026 Webspires LTD</p>
                    </div>
                </div>
            </footer>
        </>
    );
}
