<?php
// ============================================================================
// QueueLess — Student / User Management CRUD Module (PHP)
// Demonstrates:
// 1. PHP Regular Expressions (preg_match) for Server-Side Form Validation
// 2. Full CRUD Operations: Create (POST), Read (GET), Update (PUT), Delete (DELETE)
// 3. Three-tier Application Logic Layer & JSON API
// ============================================================================

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
if ($method === 'OPTIONS') {
    http_response_code(200);
    exit;
}

require_once __DIR__ . '/config.php';

// Helper: Read JSON request payload
function getJsonInput() {
    $raw = file_get_contents('php://input');
    return json_decode($raw, true) ?: [];
}

// ----------------------------------------------------------------------------
// PHP Regular Expression Validation Suite (Syllabus Requirement)
// ----------------------------------------------------------------------------
function validateUserPayload($data, $isUpdate = false) {
    $errors = [];

    // 1. Full Name: 3-50 alphabetic characters and spaces
    if (!$isUpdate || isset($data['name'])) {
        $name = trim($data['name'] ?? '');
        if (!preg_match('/^[a-zA-Z\s.]{3,50}$/', $name)) {
            $errors['name'] = 'Full name must be 3-50 letters without special characters or numbers.';
        }
    }

    // 2. Email Address: Standard RFC-compliant format
    if (!$isUpdate || isset($data['email'])) {
        $email = trim($data['email'] ?? '');
        if (!preg_match('/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/', $email)) {
            $errors['email'] = 'Invalid email address format (e.g. student@college.edu).';
        }
    }

    // 3. Mobile Number: 10 digits starting with 6, 7, 8, or 9
    if (!$isUpdate || isset($data['phone'])) {
        $phone = preg_replace('/\D/', '', $data['phone'] ?? '');
        if (!preg_match('/^[6-9]\d{9}$/', $phone)) {
            $errors['phone'] = 'Mobile number must be exactly 10 digits starting with 6-9.';
        }
    }

    // 4. Postal PIN Code: Exactly 6 numeric digits
    if (isset($data['pin_code']) && !empty($data['pin_code'])) {
        $pin = trim($data['pin_code']);
        if (!preg_match('/^\d{6}$/', $pin)) {
            $errors['pin_code'] = 'PIN code must be exactly 6 numeric digits (e.g., 560001).';
        }
    }

    // 5. Password Strength: Min 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
    if (!$isUpdate && isset($data['password'])) {
        $pwd = $data['password'];
        if (!preg_match('/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^_-])[A-Za-z\d@$!%*?&#^_-]{8,}$/', $pwd)) {
            $errors['password'] = 'Password must have min 8 chars, 1 uppercase, 1 lowercase, 1 digit, and 1 symbol.';
        }
    }

    return $errors;
}

// Handle HTTP request methods

try {
    switch ($method) {
        // --------------------------------------------------------------------
        // READ: GET /users_crud.php or GET /users_crud.php?id=xxx
        // --------------------------------------------------------------------
        case 'GET':
            if (isset($_GET['id'])) {
                $stmt = $pdo->prepare("SELECT id, name, email, phone, dob, pin_code, role, department, created_at FROM users WHERE id = ?");
                $stmt->execute([$_GET['id']]);
                $user = $stmt->fetch();
                if (!$user) {
                    http_response_code(404);
                    echo json_encode(['status' => 'error', 'message' => 'User not found']);
                    exit;
                }
                echo json_encode(['status' => 'success', 'data' => $user]);
            } else {
                $stmt = $pdo->query("SELECT id, name, email, phone, dob, pin_code, role, department, created_at FROM users ORDER BY created_at DESC");
                $users = $stmt->fetchAll();
                echo json_encode(['status' => 'success', 'count' => count($users), 'data' => $users]);
            }
            break;

        // --------------------------------------------------------------------
        // CREATE: POST /users_crud.php
        // --------------------------------------------------------------------
        case 'POST':
            $data = getJsonInput();
            $errors = validateUserPayload($data, false);

            if (!empty($errors)) {
                http_response_code(400);
                echo json_encode(['status' => 'validation_error', 'errors' => $errors]);
                exit;
            }

            // Check duplicate email
            $check = $pdo->prepare("SELECT id FROM users WHERE email = ?");
            $check->execute([$data['email']]);
            if ($check->fetch()) {
                http_response_code(409);
                echo json_encode(['status' => 'error', 'message' => 'A user with this email address already exists.']);
                exit;
            }

            $id = $data['id'] ?? ('u-' . time());
            $stmt = $pdo->prepare("
                INSERT INTO users (id, name, email, phone, dob, pin_code, password_hash, role, department)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ");
            $stmt->execute([
                $id,
                trim($data['name']),
                trim($data['email']),
                trim($data['phone']),
                $data['dob'] ?? null,
                $data['pin_code'] ?? null,
                password_hash($data['password'] ?? 'Pass@1234', PASSWORD_DEFAULT),
                $data['role'] ?? 'customer',
                $data['department'] ?? 'General'
            ]);

            http_response_code(201);
            echo json_encode([
                'status' => 'success',
                'message' => 'User successfully registered in database',
                'id' => $id
            ]);
            break;

        // --------------------------------------------------------------------
        // UPDATE: PUT /users_crud.php?id=xxx
        // --------------------------------------------------------------------
        case 'PUT':
            $id = $_GET['id'] ?? null;
            $data = getJsonInput();

            if (!$id && isset($data['id'])) {
                $id = $data['id'];
            }

            if (!$id) {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'User ID is required for update.']);
                exit;
            }

            $errors = validateUserPayload($data, true);
            if (!empty($errors)) {
                http_response_code(400);
                echo json_encode(['status' => 'validation_error', 'errors' => $errors]);
                exit;
            }

            $stmt = $pdo->prepare("
                UPDATE users
                SET name = COALESCE(?, name),
                    phone = COALESCE(?, phone),
                    pin_code = COALESCE(?, pin_code),
                    dob = COALESCE(?, dob),
                    department = COALESCE(?, department)
                WHERE id = ?
            ");
            $stmt->execute([
                $data['name'] ?? null,
                $data['phone'] ?? null,
                $data['pin_code'] ?? null,
                $data['dob'] ?? null,
                $data['department'] ?? null,
                $id
            ]);

            echo json_encode(['status' => 'success', 'message' => 'User record updated successfully.']);
            break;

        // --------------------------------------------------------------------
        // DELETE: DELETE /users_crud.php?id=xxx
        // --------------------------------------------------------------------
        case 'DELETE':
            $id = $_GET['id'] ?? null;
            if (!$id) {
                $data = getJsonInput();
                $id = $data['id'] ?? null;
            }

            if (!$id) {
                http_response_code(400);
                echo json_encode(['status' => 'error', 'message' => 'User ID is required for deletion.']);
                exit;
            }

            $stmt = $pdo->prepare("DELETE FROM users WHERE id = ?");
            $stmt->execute([$id]);

            echo json_encode(['status' => 'success', 'message' => 'User record deleted successfully.']);
            break;

        default:
            http_response_code(405);
            echo json_encode(['status' => 'error', 'message' => 'Method not allowed.']);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(['status' => 'server_error', 'message' => $e->getMessage()]);
}
