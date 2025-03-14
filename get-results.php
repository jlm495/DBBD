<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: https://jlm495.github.io");
header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Read current data
$jsonFile = 'poll-data.json';
$jsonData = file_get_contents($jsonFile);
$pollData = json_decode($jsonData, true);

// Return the results
echo json_encode([
    'success' => true,
    'results' => $pollData
]);
?>