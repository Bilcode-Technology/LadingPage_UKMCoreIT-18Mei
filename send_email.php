<?php
/**
 * CORE IT Landing Page - Contact Form Backend
 * Sends form submission to molsipart@gmail.com
 */

// Set header to return JSON response
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

// Only allow POST request method
if ($_SERVER["REQUEST_METHOD"] !== "POST") {
    http_response_code(405);
    echo json_encode([
        "status" => "error",
        "message" => "Metode request tidak diizinkan. Gunakan metode POST."
    ]);
    exit;
}

// Get raw POST data
$input = file_get_contents("php://input");
$data = json_decode($input, true);

if (!$data) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Format data tidak valid atau kosong."
    ]);
    exit;
}

// Sanitize and validate inputs
$nama = isset($data["nama"]) ? strip_tags(trim($data["nama"])) : "";
$email = isset($data["email"]) ? filter_var(trim($data["email"]), FILTER_VALIDATE_EMAIL) : "";
$pesan = isset($data["pesan"]) ? strip_tags(trim($data["pesan"])) : "";
$daftar_anggota = isset($data["daftar_anggota"]) ? (bool)$data["daftar_anggota"] : false;

// Check required fields
if (empty($nama) || empty($email) || empty($pesan)) {
    http_response_code(400);
    echo json_encode([
        "status" => "error",
        "message" => "Semua kolom input wajib diisi dengan benar."
    ]);
    exit;
}

// Target email
$to = "molsipart@gmail.com";

// Email Subject
$subject = $daftar_anggota 
    ? "[Pendaftaran Anggota Baru] CORE IT - $nama" 
    : "[Kontak Form] CORE IT - $nama";

// Email Body Content
$email_body = "Anda menerima pesan baru dari formulir kontak CORE IT.\n\n";
$email_body .= "───────────────────────────────────────────────\n";
$email_body .= "Detail Pengirim:\n";
$email_body .= "  • Nama Lengkap   : $nama\n";
$email_body .= "  • Email          : $email\n";
$email_body .= "  • Daftar Anggota : " . ($daftar_anggota ? "Ya, saya ingin bergabung" : "Tidak") . "\n";
$email_body .= "───────────────────────────────────────────────\n\n";
$email_body .= "Pesan:\n";
$email_body .= "$pesan\n\n";
$email_body .= "───────────────────────────────────────────────\n";
$email_body .= "Pesan dikirim pada " . date("Y-m-d H:i:s") . " WIB\n";

// Email Headers
$headers = "From: CORE IT Landing Page <no-reply@global.ac.id>\r\n";
$headers .= "Reply-To: $nama <$email>\r\n";
$headers .= "Content-Type: text/plain; charset=UTF-8\r\n";
$headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";

// Check if running on localhost (handles optional port numbers)
$host = isset($_SERVER['HTTP_HOST']) ? explode(':', $_SERVER['HTTP_HOST'])[0] : '';
$is_localhost = in_array($host, ['localhost', '127.0.0.1']) || (isset($_SERVER['SERVER_ADDR']) && $_SERVER['SERVER_ADDR'] === '127.0.0.1') || empty($host);

if ($is_localhost) {
    // Save to a local file for debugging on XAMPP
    $log_file = __DIR__ . "/mail_logs.txt";
    $log_content = "===============================================\n";
    $log_content .= "EMAIL SIMULATION (LOCALHOST - " . date("Y-m-d H:i:s") . ")\n";
    $log_content .= "To: $to\n";
    $log_content .= "Subject: $subject\n";
    $log_content .= "Headers:\n$headers\n";
    $log_content .= "Body:\n$email_body\n";
    $log_content .= "===============================================\n\n";
    
    if (file_put_contents($log_file, $log_content, FILE_APPEND)) {
        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => "Pesan disimulasikan terkirim di localhost (disimpan di mail_logs.txt). Di hosting asli, email akan terkirim ke molsipart@gmail.com."
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Gagal menulis log email lokal."
        ]);
    }
} else {
    // Attempt to send email using PHP mail() function on live hosting
    if (@mail($to, $subject, $email_body, $headers)) {
        http_response_code(200);
        echo json_encode([
            "status" => "success",
            "message" => "Pesan Anda berhasil terkirim ke molsipart@gmail.com. Terima kasih!"
        ]);
    } else {
        http_response_code(500);
        echo json_encode([
            "status" => "error",
            "message" => "Gagal mengirim email secara backend. Periksa konfigurasi mail server Anda."
        ]);
    }
}
?>
