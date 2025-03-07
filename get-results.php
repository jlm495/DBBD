<?php
header('Content-Type: application/json');

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