<?php
header('Content-Type: application/json');

// Prevent vote spam using IP and cookies (basic protection)
session_start();
$userIP = $_SERVER['REMOTE_ADDR'];
$userIdentifier = md5($userIP . 'poll-salt');

// Check if user has already voted
if (isset($_SESSION['has_voted']) && $_SESSION['has_voted'] === true) {
    echo json_encode(['error' => 'You have already voted']);
    exit;
}

// Get the vote data
$vote = isset($_POST['vote']) ? $_POST['vote'] : null;
$validOptions = ['javascript', 'python', 'java', 'php', 'other'];

// Validate the vote
if (!$vote || !in_array($vote, $validOptions)) {
    echo json_encode(['error' => 'Invalid vote option']);
    exit;
}

// Read current data
$jsonFile = 'poll-data.json';
$jsonData = file_get_contents($jsonFile);
$pollData = json_decode($jsonData, true);

// Update the vote count
$pollData[$vote]++;

// Save the updated data
file_put_contents($jsonFile, json_encode($pollData));

// Mark this user as having voted
$_SESSION['has_voted'] = true;
setcookie('poll_voted', '1', time() + 60 * 60 * 24 * 30); // 30 day cookie

// Return the updated results
echo json_encode([
    'success' => true,
    'results' => $pollData
]);
?>