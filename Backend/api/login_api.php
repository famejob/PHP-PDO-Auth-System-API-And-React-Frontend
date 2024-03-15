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
    $email = $data['email'] ?? '';
    $password = $data['password'] ?? '';

    $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
    $stmt->execute([$email]);
    $Userdata = $stmt->fetch();
    if ($Userdata && password_verify($password, $Userdata['password'])) {
        $response = array();
        $response['user_data'] = $Userdata;
        $response['status'] = "success";

        header('Content-Type: application/json');
        echo json_encode($response);
        http_response_code(200);
    } else {
        echo json_encode(['error' => 'Email or password not correct']);
        http_response_code(200);
    }
}
