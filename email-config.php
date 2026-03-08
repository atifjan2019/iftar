<?php
/**
 * Email Configuration for Iftar Event
 * 
 * SETUP INSTRUCTIONS:
 * 1. Go to https://myaccount.google.com/security
 * 2. Enable 2-Step Verification (if not already enabled)
 * 3. Go to https://myaccount.google.com/apppasswords
 * 4. Create a new App Password (select "Mail" and "Other")
 * 5. Copy the 16-character password and paste it below
 * 6. Replace the email address below with your Gmail address
 */

// Email Settings
define('SMTP_HOST', 'smtp.gmail.com');
define('SMTP_PORT', 587);
define('SMTP_USERNAME', 'your-email@gmail.com');     // ← Replace with your Gmail address
define('SMTP_PASSWORD', 'xxxx xxxx xxxx xxxx');      // ← Replace with your App Password
define('SMTP_FROM_NAME', 'Oldham Brothers Community');
define('SMTP_FROM_EMAIL', 'your-email@gmail.com');   // ← Same as SMTP_USERNAME

// Set to true once you've configured the above settings
define('EMAIL_ENABLED', false);
