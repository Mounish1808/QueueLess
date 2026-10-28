<?php
// ============================================================================
// QueueLess — Queue Tokens & Appointment Management API (PHP)
// Demonstrates: Server-side token creation, queue status updates, and PDO queries
// ============================================================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

try {
    if ($method === 'GET') {
        // List waiting tokens or filter by service
        $serviceId = $_GET['service_id'] ?? null;
        if ($serviceId) {
            $stmt = $pdo->prepare("SELECT * FROM tokens WHERE service_id = ? ORDER BY created_at ASC");
            $stmt->execute([$serviceId]);
        } else {
            $stmt = $pdo->query("SELECT * FROM tokens ORDER BY created_at DESC");
        }
        $tokens = $stmt->fetchAll();
        echo json_encode(['status' => 'success', 'count' => count($tokens), 'data' => $tokens]);
        exit;
    }

    if ($method === 'POST') {
        $raw = file_get_contents('php://input');
        $data = json_decode($raw, true) ?: [];

        if (empty($data['service_id']) || empty($data['user_name']) || empty($data['user_phone'])) {
            http_response_code(400);
            echo json_encode(['status' => 'error', 'message' => 'Service ID, student name, and phone are required.']);
            exit;
        }

        // Count waiting to assign position
        $countStmt = $pdo->prepare("SELECT COUNT(*) FROM tokens WHERE service_id = ? AND status = 'waiting'");
        $countStmt->execute([$data['service_id']]);
        $waitingCount = (int)$countStmt->fetchColumn();

        $tokenId = 'T-' . time();
        $tokenNumber = 'TKN-' . rand(100, 999);
        $date = $data['date'] ?? date('Y-m-d');
        $slotTime = $data['slot_time'] ?? '10:00 AM';

        $stmt = $pdo->prepare("
            INSERT INTO tokens (id, token_number, service_id, service_name, counter_id, user_id, user_name, user_email, user_phone, booking_date, slot_time, status, queue_position, estimated_wait_mins, notes, is_paid)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'waiting', ?, ?, ?, ?)
        ");
        $stmt->execute([
            $tokenId,
            $tokenNumber,
            $data['service_id'],
            $data['service_name'] ?? 'College Service Desk',
            $data['counter_id'] ?? 'C1',
            $data['user_id'] ?? ('u-' . time()),
            trim($data['user_name']),
            $data['user_email'] ?? 'student@college.edu',
            trim($data['user_phone']),
            $date,
            $slotTime,
            $waitingCount + 1,
            ($waitingCount + 1) * 10,
            $data['notes'] ?? '',
            !empty($data['is_paid']) ? 1 : 0
        ]);

        http_response_code(201);
        echo json_encode([
            'status' => 'success',
            'token_id' => $tokenId,
            'token_number' => $tokenNumber,
            'queue_position' => $waitingCount + 1,
            'estimated_wait_mins' => ($waitingCount + 1) * 10
        ]);
        exit;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
}
