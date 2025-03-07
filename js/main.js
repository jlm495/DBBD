document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.getElementById('navbar');
    const toggleButton = document.getElementById('bgToggle');
    const backgrounds = [
        'url("./img/DBBD_blue_checkers.jpg")',
        'url("./img/DBBD_red_checkers.jpg")',
        'url("./img/DBBD_orange_checkers.jpg")',
        'url("./img/DBBD_green_checkers.jpg")',
        'url("./img/DBBD_yellow_checkers.jpg")'
    ];
    
    // Get saved background index or default to 0
    let currentBg = parseInt(localStorage.getItem('navbarBackground')) || 0;
    
    // Apply saved background on page load
    navbar.style.backgroundImage = backgrounds[currentBg];

    toggleButton.addEventListener('click', function() {
        currentBg = (currentBg + 1) % backgrounds.length;
        navbar.style.backgroundImage = backgrounds[currentBg];
        // Save the choice
        localStorage.setItem('navbarBackground', currentBg);
    });
});

// Replace the static data initialization with:
let pollData = {};

// Fetch current results on page load
fetch('get-results.php')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            pollData = data.results;
        }
    })
    .catch(error => console.error('Error fetching results:', error));

// Replace the form submission handler with:
form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const selectedOption = document.querySelector('input[name="poll"]:checked');
    
    if (!selectedOption) {
        errorMessage.textContent = 'Please select an option before voting.';
        errorMessage.style.display = 'block';
        return;
    }
    
    errorMessage.style.display = 'none';
    const vote = selectedOption.value;
    
    // Create form data for the request
    const formData = new FormData();
    formData.append('vote', vote);
    
    // Send the vote to the server
    fetch('vote-handler.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            errorMessage.textContent = data.error;
            errorMessage.style.display = 'block';
        } else if (data.success) {
            pollData = data.results;
            
            // Disable the form to prevent multiple votes
            const radioButtons = document.querySelectorAll('input[name="poll"]');
            radioButtons.forEach(button => {
                button.disabled = true;
            });
            
            submitButton.disabled = true;
            submitButton.textContent = 'Thanks for voting!';
            
            // Show the results
            displayResults();
        }
    })
    .catch(error => {
        console.error('Error submitting vote:', error);
        errorMessage.textContent = 'An error occurred. Please try again.';
        errorMessage.style.display = 'block';
    });
});