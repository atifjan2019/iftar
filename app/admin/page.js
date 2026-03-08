'use client';

import { useState, useEffect, useCallback } from 'react';
import styles from './admin.module.css';

export default function AdminPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState('');
    const [allRegistrations, setAllRegistrations] = useState([]);
    const [totalRegistrations, setTotalRegistrations] = useState(0);
    const [todayRegistrations, setTodayRegistrations] = useState(0);
    const [daysUntilEvent, setDaysUntilEvent] = useState(0);
    const [lastUpdated, setLastUpdated] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [storedPassword, setStoredPassword] = useState('');

    // Check session on mount
    useEffect(() => {
        const savedAuth = sessionStorage.getItem('adminAuth');
        const savedPass = sessionStorage.getItem('adminPass');
        if (savedAuth === 'true' && savedPass) {
            setIsLoggedIn(true);
            setStoredPassword(savedPass);
        }
    }, []);

    // Load data when logged in
    useEffect(() => {
        if (isLoggedIn && storedPassword) {
            loadData(storedPassword);
        }
    }, [isLoggedIn, storedPassword]);

    // Auto-refresh every 30 seconds
    useEffect(() => {
        if (!isLoggedIn || !storedPassword) return;
        const interval = setInterval(() => loadData(storedPassword), 30000);
        return () => clearInterval(interval);
    }, [isLoggedIn, storedPassword]);

    const login = async () => {
        try {
            const res = await fetch('/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            });
            const data = await res.json();

            if (data.success) {
                setIsLoggedIn(true);
                setStoredPassword(password);
                sessionStorage.setItem('adminAuth', 'true');
                sessionStorage.setItem('adminPass', password);
                setLoginError('');
            } else {
                setLoginError('Incorrect password. Please try again.');
                setPassword('');
            }
        } catch {
            setLoginError('Connection error. Please try again.');
        }
    };

    const logout = () => {
        setIsLoggedIn(false);
        setStoredPassword('');
        setPassword('');
        setLoginError('');
        sessionStorage.removeItem('adminAuth');
        sessionStorage.removeItem('adminPass');
    };

    const loadData = async (pass) => {
        try {
            const res = await fetch('/api/stats', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: pass }),
            });
            const data = await res.json();

            if (data.success) {
                setAllRegistrations(data.registrations || []);
                setTotalRegistrations(data.total);

                // Count today's registrations
                const today = new Date().toISOString().split('T')[0];
                const todayCount = (data.registrations || []).filter(
                    (r) => r.registeredAt && r.registeredAt.startsWith(today)
                ).length;
                setTodayRegistrations(todayCount);

                // Days until event
                const eventDate = new Date('2026-03-10');
                const now = new Date();
                const diffTime = eventDate - now;
                const diffDays = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
                setDaysUntilEvent(diffDays);

                setLastUpdated('Last updated: ' + new Date().toLocaleTimeString());
            }
        } catch (error) {
            console.error('Failed to load data:', error);
        }
    };

    const escapeHtml = (text) => {
        if (!text) return '';
        return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    };

    // Filter registrations
    const filteredRegistrations = searchQuery
        ? allRegistrations.filter(
            (r) =>
                r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                r.phone.includes(searchQuery) ||
                r.ticketId.toLowerCase().includes(searchQuery.toLowerCase())
        )
        : allRegistrations;

    // Export CSV
    const exportCSV = () => {
        if (allRegistrations.length === 0) return;
        let csv = 'No,Name,Phone,Email,Ticket ID,Registered At\n';
        allRegistrations.forEach((reg, i) => {
            const safeName = (reg.name || '').replace(/"/g, '""');
            const safePhone = (reg.phone || '').replace(/"/g, '""');
            const safeEmail = (reg.email || '').replace(/"/g, '""');
            csv += `${i + 1},"${safeName}","${safePhone}","${safeEmail}","${reg.ticketId}","${reg.registeredAt}"\n`;
        });
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'iftar_registrations.csv';
        a.click();
        URL.revokeObjectURL(url);
    };

    // LOGIN SCREEN
    if (!isLoggedIn) {
        return (
            <div className={styles.loginScreen}>
                <div className={styles.loginCard}>
                    <h1 className={styles.loginTitle}>🌙 <span>Admin Portal</span></h1>
                    <p className={styles.loginSubtitle}>Oldham Brothers Iftar Gathering</p>
                    {loginError && <div className={styles.loginError}>{loginError}</div>}
                    <input
                        type="password"
                        className={styles.loginInput}
                        placeholder="Enter admin password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={(e) => { if (e.key === 'Enter') login(); }}
                        autoFocus
                    />
                    <button className={styles.loginButton} onClick={login}>Access Dashboard</button>
                </div>
            </div>
        );
    }

    // DASHBOARD
    const sortedRegistrations = [...filteredRegistrations].reverse();

    return (
        <div className={styles.dashboard}>
            {/* Top Bar */}
            <div className={styles.topbar}>
                <div className={styles.topbarTitle}>🌙 <span>Iftar Admin</span> Dashboard</div>
                <div className={styles.topbarActions}>
                    <button className={styles.btnRefresh} onClick={() => loadData(storedPassword)}>↻ Refresh</button>
                    <button className={styles.btnLogout} onClick={logout}>Logout</button>
                </div>
            </div>

            <div className={styles.dashboardContent}>
                {/* Stats */}
                <div className={styles.statsGrid}>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>{totalRegistrations}</div>
                        <div className={styles.statLabel}>Total Registrations</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>{todayRegistrations}</div>
                        <div className={styles.statLabel}>Registered Today</div>
                    </div>
                    <div className={styles.statCard}>
                        <div className={styles.statNumber}>{daysUntilEvent}</div>
                        <div className={styles.statLabel}>Days Until Event</div>
                    </div>
                </div>

                {/* Table */}
                <div className={styles.tableContainer}>
                    <div className={styles.tableHeader}>
                        <h2>Registered Attendees</h2>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <input
                                type="text"
                                className={styles.searchInput}
                                placeholder="Search by name, email..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button className={styles.btnExport} onClick={exportCSV}>📥 Export CSV</button>
                        </div>
                    </div>

                    {sortedRegistrations.length === 0 ? (
                        <div className={styles.noData}>
                            <svg viewBox="0 0 24 24" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                            </svg>
                            <p>No registrations yet</p>
                        </div>
                    ) : (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Name</th>
                                    <th>Phone</th>
                                    <th>Email</th>
                                    <th>Ticket ID</th>
                                    <th>Registered</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedRegistrations.map((reg, index) => {
                                    const date = reg.registeredAt
                                        ? new Date(reg.registeredAt).toLocaleDateString('en-GB', {
                                            day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
                                        })
                                        : 'N/A';
                                    return (
                                        <tr key={reg.ticketId || index}>
                                            <td style={{ color: 'var(--text-muted)' }}>{filteredRegistrations.length - index}</td>
                                            <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{escapeHtml(reg.name)}</td>
                                            <td>{escapeHtml(reg.phone)}</td>
                                            <td>{escapeHtml(reg.email)}</td>
                                            <td><span className={styles.ticketBadge}>{escapeHtml(reg.ticketId)}</span></td>
                                            <td style={{ color: 'var(--text-muted)' }}>{date}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}

                    {lastUpdated && <div className={styles.lastUpdated}>{lastUpdated}</div>}
                </div>
            </div>
        </div>
    );
}
