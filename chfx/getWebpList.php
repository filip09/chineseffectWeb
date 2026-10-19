<?php
header('Content-Type: application/json');

// Adjust the path relative to this PHP script's location
$dirPath = '../images/wordsTiles/';
$fullPath = realpath($dirPath);

if (!$fullPath || !is_dir($fullPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Directory not found']);
    exit;
}

$files = array_filter(scandir($fullPath), function ($file) use ($fullPath) {
    return is_file($fullPath . DIRECTORY_SEPARATOR . $file) && pathinfo($file, PATHINFO_EXTENSION) === 'webp';
});

echo json_encode(array_values($files));