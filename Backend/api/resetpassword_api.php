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
    if ($_SERVER["REQUEST_METHOD"] == "POST") {
        // Get form data
        $newPassword = trim($_POST['new_password']);
        $token = trim($_POST['token']);

        // Validate token and update password
        $query = "SELECT * FROM users WHERE reset_token = ?";
        $stmt = $conn->prepare($query);
        $stmt->execute([$token]);
        $user = $stmt->fetch();

        if ($user) {
            // Update user's password
            $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
            $update_query = "UPDATE users SET password = ?, reset_token = NULL WHERE reset_token = ?";
            $update_stmt = $conn->prepare($update_query);
            $update_stmt->execute([$hashedPassword, $token]);

            echo json_encode(array("message" => "Password reset successfully."));
        } else {
            echo json_encode(array("error" => "Invalid or expired token."));
        }
    }
}
