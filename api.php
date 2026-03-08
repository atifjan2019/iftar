<?php
/**
 * API endpoint for Iftar event registration
 * Stores registrations in a JSON file
 */

require_once __DIR__ . '/send-email.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET');
header('Access-Control-Allow-Headers: Content-Type');

$dataFile = __DIR__ . '/data/registrations.json';
$maxTickets = 100;

// Ensure data directory exists
if (!is_dir(__DIR__ . '/data')) {
    mkdir(__DIR__ . '/data', 0755, true);
}

// Ensure data file exists
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, json_encode([]));
}

// Handle POST - New registration
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $name = trim($input['name'] ?? '');
    $phone = trim($input['phone'] ?? '');
    $email = trim($input['email'] ?? '');

    // Validation
    if (empty($name) || empty($phone) || empty($email)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'All fields are required.']);
        exit;
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo json_encode(['success' => false, 'message' => 'Invalid email address.']);
        exit;
    }

    // Load existing registrations
    $registrations = json_decode(file_get_contents($dataFile), true) ?: [];

    // Check for duplicate email
    foreach ($registrations as $reg) {
        if (strtolower($reg['email']) === strtolower($email)) {
            echo json_encode([
                'success' => true,
                'message' => 'You are already registered!',
                'ticketId' => $reg['ticketId'],
                'duplicate' => true
            ]);
            exit;
        }
    }

    // Check capacity
    if (count($registrations) >= $maxTickets) {
        echo json_encode([
            'success' => false,
            'message' => 'Sorry, all spots have been taken! Registration is now closed.',
            'soldOut' => true
        ]);
        exit;
    }

    // Generate ticket ID
    $ticketId = 'OBI-' . strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 8));

    // Create registration
    $registration = [
        'id' => count($registrations) + 1,
        'name' => $name,
        'phone' => $phone,
        'email' => $email,
        'ticketId' => $ticketId,
        'registeredAt' => date('Y-m-d H:i:s'),
    ];

    $registrations[] = $registration;

    // Save
    file_put_contents($dataFile, json_encode($registrations, JSON_PRETTY_PRINT));

    // Send ticket email
    $emailResult = sendTicketEmail($name, $email, $ticketId);

    $remaining = $maxTickets - count($registrations);

    echo json_encode([
        'success' => true,
        'message' => 'Registration successful!',
        'ticketId' => $ticketId,
        'remaining' => $remaining,
        'maxTickets' => $maxTickets,
        'emailSent' => $emailResult['success']
    ]);
    exit;
}

// Handle GET - Get stats (for admin)
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $action = $_GET['action'] ?? '';

    if ($action === 'stats') {
        $registrations = json_decode(file_get_contents($dataFile), true) ?: [];
        echo json_encode([
            'success' => true,
            'total' => count($registrations),
            'remaining' => $maxTickets - count($registrations),
            'maxTickets' => $maxTickets,
            'registrations' => $registrations
        ]);
        exit;
    }

    if ($action === 'count') {
        $registrations = json_decode(file_get_contents($dataFile), true) ?: [];
        echo json_encode([
            'success' => true,
            'total' => count($registrations),
            'remaining' => $maxTickets - count($registrations),
            'maxTickets' => $maxTickets
        ]);
        exit;
    }
}

http_response_code(405);
echo json_encode(['success' => false, 'message' => 'Method not allowed.']);
