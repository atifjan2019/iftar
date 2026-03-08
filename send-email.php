<?php
/**
 * Email sender for Iftar event tickets
 * Uses PHPMailer with Gmail SMTP
 */

require_once __DIR__ . '/vendor/autoload.php';
require_once __DIR__ . '/email-config.php';

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\SMTP;
use PHPMailer\PHPMailer\Exception;

function sendTicketEmail($name, $email, $ticketId)
{
    if (!defined('EMAIL_ENABLED') || !EMAIL_ENABLED) {
        return ['success' => false, 'message' => 'Email not configured'];
    }

    $mail = new PHPMailer(true);

    try {
        // SMTP Settings
        $mail->isSMTP();
        $mail->Host = SMTP_HOST;
        $mail->SMTPAuth = true;
        $mail->Username = SMTP_USERNAME;
        $mail->Password = SMTP_PASSWORD;
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $mail->Port = SMTP_PORT;

        // Recipients
        $mail->setFrom(SMTP_FROM_EMAIL, SMTP_FROM_NAME);
        $mail->addAddress($email, $name);

        // Content
        $mail->isHTML(true);
        $mail->Subject = '🎫 Your Iftar Gathering Ticket - ' . $ticketId;
        $mail->Body = getTicketEmailHTML($name, $ticketId);
        $mail->AltBody = getTicketEmailPlainText($name, $ticketId);

        $mail->send();
        return ['success' => true, 'message' => 'Email sent successfully'];
    } catch (Exception $e) {
        return ['success' => false, 'message' => 'Email could not be sent: ' . $mail->ErrorInfo];
    }
}

function getTicketEmailHTML($name, $ticketId)
{
    return '
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #0A0F0D; font-family: Arial, sans-serif;">
    <div style="max-width: 500px; margin: 0 auto; padding: 20px;">
        
        <!-- Header -->
        <div style="text-align: center; padding: 40px 20px 20px; background: linear-gradient(180deg, #1A2E26 0%, #132820 100%); border-radius: 20px 20px 0 0; border: 1px solid rgba(212,175,55,0.2); border-bottom: none;">
            <p style="font-size: 24px; color: #D4AF37; margin: 0 0 10px;">☪</p>
            <h1 style="color: #F5F5F0; font-size: 26px; margin: 0 0 4px;">Iftar Gathering</h1>
            <p style="color: #8B9A8F; font-size: 13px; letter-spacing: 2px; text-transform: uppercase; margin: 0;">OLDHAM BROTHERS COMMUNITY</p>
        </div>

        <!-- Divider -->
        <div style="background: #132820; padding: 8px 20px; border-left: 1px solid rgba(212,175,55,0.2); border-right: 1px solid rgba(212,175,55,0.2);">
            <div style="border-top: 2px dashed rgba(212,175,55,0.3);"></div>
        </div>

        <!-- Ticket Body -->
        <div style="background: #132820; padding: 24px 32px; border-left: 1px solid rgba(212,175,55,0.2); border-right: 1px solid rgba(212,175,55,0.2);">
            <p style="font-size: 11px; font-weight: bold; letter-spacing: 2px; text-transform: uppercase; color: #D4AF37; margin: 0 0 4px;">GUEST NAME</p>
            <p style="font-size: 16px; color: #F5F5F0; margin: 0 0 20px;">' . htmlspecialchars($name) . '</p>

            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 20px;">
                <tr>
                    <td width="50%">
                        <p style="font-size: 11px; font-weight: bold; letter-spacing: 2px; color: #D4AF37; margin: 0 0 4px;">DATE</p>
                        <p style="font-size: 16px; color: #F5F5F0; margin: 0;">Tue, 10th March</p>
                    </td>
                    <td width="50%">
                        <p style="font-size: 11px; font-weight: bold; letter-spacing: 2px; color: #D4AF37; margin: 0 0 4px;">TIME</p>
                        <p style="font-size: 16px; color: #F5F5F0; margin: 0;">5:00 PM</p>
                    </td>
                </tr>
            </table>

            <p style="font-size: 11px; font-weight: bold; letter-spacing: 2px; color: #D4AF37; margin: 0 0 4px;">VENUE</p>
            <p style="font-size: 16px; color: #F5F5F0; margin: 0 0 20px;">Bittersweet, Old Town Hall</p>

            <p style="font-size: 11px; font-weight: bold; letter-spacing: 2px; color: #D4AF37; margin: 0 0 4px;">ADDRESS</p>
            <p style="font-size: 16px; color: #F5F5F0; margin: 0 0 24px;">Parliament Square, Oldham OL1 1PL</p>

            <!-- Ticket ID Box -->
            <div style="background: rgba(0,0,0,0.3); border-radius: 12px; padding: 16px; text-align: center;">
                <p style="font-size: 11px; font-weight: bold; letter-spacing: 2px; color: #D4AF37; margin: 0 0 6px;">TICKET ID</p>
                <p style="font-family: Courier New, monospace; font-size: 22px; font-weight: bold; color: #D4AF37; letter-spacing: 3px; margin: 0;">' . htmlspecialchars($ticketId) . '</p>
            </div>
        </div>

        <!-- Footer -->
        <div style="text-align: center; padding: 20px 32px 28px; background: #132820; border-radius: 0 0 20px 20px; border: 1px solid rgba(212,175,55,0.2); border-top: 1px solid rgba(212,175,55,0.08);">
            <p style="font-size: 13px; color: #8B9A8F; margin: 0 0 8px;">Brothers Only • Free Entry • Ramadan 1447</p>
            <p style="font-size: 13px; color: #4ADE80; font-weight: bold; margin: 0 0 8px;">🤲 If you\'d like to donate, there will be a donation box at the venue</p>
            <p style="font-size: 14px; color: #D4AF37; font-weight: bold; margin: 0 0 16px;">Present this email at the venue as your ticket</p>
            
            <!-- Directions Button -->
            <a href="https://www.google.com/maps/dir/?api=1&destination=Parliament+Square%2C+Oldham+OL1+1PL" 
               style="display: inline-block; padding: 12px 28px; background: #0A6847; color: #F5F5F0; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 14px;">
                📍 Get Directions
            </a>
        </div>

        <p style="text-align: center; font-size: 12px; color: #5A6B5F; margin-top: 20px;">
            © 2026 Webspires LTD
        </p>
    </div>
</body>
</html>';
}

function getTicketEmailPlainText($name, $ticketId)
{
    return "
IFTAR GATHERING - OLDHAM BROTHERS COMMUNITY
=============================================

Assalamu Alaikum {$name},

Your ticket has been confirmed!

TICKET DETAILS:
- Ticket ID: {$ticketId}
- Date: Tuesday, 10th March
- Time: 5:00 PM onwards
- Venue: Bittersweet, Old Town Hall
- Address: Parliament Square, Oldham OL1 1PL

Brothers Only | Free Entry | Ramadan 1447

If you'd like to donate, there will be a donation box at the venue.

Present this email at the venue as your ticket.

Get Directions: https://www.google.com/maps/dir/?api=1&destination=Parliament+Square,+Oldham+OL1+1PL

© 2026 Webspires LTD
";
}
