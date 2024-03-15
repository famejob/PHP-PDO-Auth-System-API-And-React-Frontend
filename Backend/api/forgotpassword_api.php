<?php
require_once('../config/config.php');

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require_once('../vendor/autoload.php'); // Path to PHPMailer autoload.php
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
$mail = new PHPMailer(true);
function generateToken($length = 32)
{
    return bin2hex(random_bytes($length));
}
if ($method === 'POST') {
    $email = trim($_POST['email']);

    // Check if email exists in the database
    $query = "SELECT * FROM users WHERE email = ?";
    $stmt = $conn->prepare($query);
    $stmt->execute([$email]);
    $user = $stmt->fetchColumn();
    if ($user > 0) {
        // Generate a unique token
        $token = generateToken();
        $expiration = date('Y-m-d H:i:s', strtotime('+1 hour'));
        // Update user table with token
        $update_query = "UPDATE users SET reset_token = ? , reset_expiration= ? WHERE email = ?";
        $update_stmt = $conn->prepare($update_query);
        $update_stmt->execute([$token, $expiration, $email]);

        // Send email to user with reset link
        $reset_link = "http://localhost:5173/resetpassword?token=" . $token;

        // PHPMailer configuration
        $mail = new PHPMailer(true);
        try {
            //Server settings
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com'; // SMTP server
            $mail->SMTPAuth = true;
            $mail->Username = 'wmail8376@gmail.com'; // SMTP username
            $mail->Password = 'zcaa each buse zxbw'; // SMTP password
            $mail->SMTPSecure = 'ssl';
            $mail->Port = 465; // Port for SMTP

            //Recipients
            $mail->setFrom('wmail8376@gmail.com');
            $mail->addAddress($email); // Add a recipient

            // Content
            $mail->isHTML(false); // Set email format to HTML
            $mail->Subject = 'Reset Password';
            $mail->Body = "Please click the following link to reset your password: <a href='$reset_link'>$reset_link</a>";

            $mail->send();
            echo json_encode(array("message" => "Reset link has been sent to your email."));
        } catch (Exception $e) {
            echo json_encode(array("error" => "Message could not be sent. Mailer Error: {$mail->ErrorInfo}"));
        }
    } else {
        echo json_encode(array("error" => "Email not found in the database."));
    }
}
