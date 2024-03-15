<?php
require_once('../config/config.php');
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: access');
header('Access-Control-Allow-Methods: GET');
header("Content-Type: application/json; charset=UTF-8");
// Allow from any origin
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true'); // Allow credentials
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, DELETE , PUT, OPTIONS");

    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS'])) {
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}, Content-Type"); // Allow Content-Type header
    } else {
        header("Access-Control-Allow-Headers: Content-Type"); // Fallback to only allow Content-Type header
    }
    exit(0);
}

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $data = json_decode(file_get_contents('php://input'), true);
    $username = $data['username'] ?? '';
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';
    $role = 0;
    if (empty($username) || empty($email) || empty($password)) {
        echo json_encode(['error' => 'username,email and password are required']);
        http_response_code(400); // Bad Request
        exit;
    }

    $existingUsername = $conn->prepare("SELECT COUNT(*) FROM users WHERE username = ?");
    $existingUsername->execute([$username]);
    $count = $existingUsername->fetchColumn();
    if ($count > 0) {
        echo json_encode(['error' => 'Username already exists']);
        http_response_code(409); // Conflict
        exit;
    }

    $existingEmail = $conn->prepare("SELECT COUNT(*) FROM users WHERE email = ?");
    $existingEmail->execute([$email]);
    $count = $existingEmail->fetchColumn();
    if ($count > 0) {
        echo json_encode(['error' => 'Email already exists']);
        http_response_code(409); // Conflict
        exit;
    }
    $hash_password = password_hash($password, PASSWORD_DEFAULT);
    $sql = "INSERT INTO users(username,email,password,role) VALUE(?,?,?,?)";
    $query = $conn->prepare($sql);
    $query->execute([$username, $email, $hash_password, $role]);
    // Return success message
    echo json_encode(['message' => 'User register successfully']);
    http_response_code(201);
}
