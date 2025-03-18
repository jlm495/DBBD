document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const navbar = document.querySelector('.navbar');
    const toggleButton = document.getElementById('bgToggle');
    const menuButton = document.createElement('button');
    
    // Background cycling functionality
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

    // Mobile menu toggle functionality
    menuButton.classList.add('nav-toggle');
    menuButton.setAttribute('aria-label', 'Toggle navigation menu');
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-controls', 'nav-menu');
    menuButton.innerHTML = `
        <span class="nav-toggle-label">Menu</span>
        <span class="nav-toggle-icon">
            <span></span>
            <span></span>
            <span></span>
        </span>
    `;
    
    // Insert menu button before navigation
    navbar.parentNode.insertBefore(menuButton, navbar);
    
    // Add id to the navbar's ul element for ARIA controls
    const navMenu = navbar.querySelector('ul');
    navMenu.id = 'nav-menu';
    navMenu.setAttribute('aria-label', 'Main navigation');
    
    menuButton.addEventListener('click', function() {
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', !expanded);
        navbar.classList.toggle('active');
        
        // Add animation to hamburger icon for visual feedback
        this.classList.toggle('open');
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (!navbar.contains(event.target) && !menuButton.contains(event.target) && navbar.classList.contains('active')) {
            navbar.classList.remove('active');
            menuButton.setAttribute('aria-expanded', 'false');
            menuButton.classList.remove('open');
        }
    });

    // Enable keyboard navigation
    navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('keydown', function(e) {
            // Close menu on Escape key
            if (e.key === 'Escape') {
                navbar.classList.remove('active');
                menuButton.setAttribute('aria-expanded', 'false');
                menuButton.classList.remove('open');
                menuButton.focus();
            }
        });
    });
});

// Poll functionality
let pollData = {};
const form = document.querySelector('#poll-form');
const errorMessage = document.getElementById('error-message');
const submitButton = document.getElementById('submit-button');
const resultsContainer = document.getElementById('results-container');
const pollResults = document.getElementById('poll-results');
const loadingIndicator = document.getElementById('loading-indicator');
const alreadyVotedMessage = document.getElementById('already-voted-message');

// Function to create a script tag for JSONP
function fetchJSONP(url, callback) {
    const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
    window[callbackName] = function(data) {
        delete window[callbackName];
        document.body.removeChild(script);
        callback(data);
    };

    const script = document.createElement('script');
    script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
    document.body.appendChild(script);
}

// Check if user has already voted
function checkAlreadyVoted() {
    const hasVoted = localStorage.getItem('hasVoted') === 'true';
    if (hasVoted) {
        alreadyVotedMessage.style.display = 'block';
        form.style.display = 'none';
        fetchAndDisplayResults();
    } else {
        alreadyVotedMessage.style.display = 'none';
        pollResults.style.display = 'none'; // Hide results until after voting
    }
}

// Display poll results
function displayResults() {
    if (!pollData || Object.keys(pollData).length === 0) {
        resultsContainer.innerHTML = '<p>No results available at this time.</p>';
        return;
    }
    
    // Calculate total votes
    let totalVotes = 0;
    for (const option in pollData) {
        totalVotes += parseInt(pollData[option]);
    }
    
    // Generate result bars
    let resultsHTML = '';
    for (const option in pollData) {
        const votes = pollData[option];
        const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
        
        resultsHTML += `
            <div class="result-item">
                <div class="result-label">${option.charAt(0).toUpperCase() + option.slice(1)}: ${votes} votes (${percentage}%)</div>
                <div class="result-bar-container">
                    <div class="result-bar" style="width: ${percentage}%"></div>
                </div>
            </div>
        `;
    }
    
    resultsContainer.innerHTML = resultsHTML;
    pollResults.style.display = 'block';
}

// Fetch current results
function fetchAndDisplayResults() {
    loadingIndicator.style.display = 'inline-block';
    
    fetchJSONP('https://dirtbikebreakdownpoll.rf.gd/get-results-jsonp.php', function(data) {
        loadingIndicator.style.display = 'none';
        if (data.success) {
            pollData = data.results;
            displayResults();
        } else {
            errorMessage.textContent = data.error || 'Error loading poll results.';
            errorMessage.style.display = 'block';
        }
    });
}
// Submit vote
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
    
    // Show loading indicator
    loadingIndicator.style.display = 'inline-block';
    submitButton.disabled = true;
    
    // Use JSONP to submit vote
    const voteUrl = `https://dirtbikebreakdownpoll.rf.gd/vote-handle-jsonp.php?vote=${vote}`;
    
    fetchJSONP(voteUrl, function(data) {
        loadingIndicator.style.display = 'none';
        
        if (data.error) {
            errorMessage.textContent = data.error;
            errorMessage.style.display = 'block';
            submitButton.disabled = false;
        } else if (data.success) {
            pollData = data.results;
            
            // Disable the form to prevent multiple votes
            const radioButtons = document.querySelectorAll('input[name="poll"]');
            radioButtons.forEach(button => {
                button.disabled = true;
            });
            
            submitButton.disabled = true;
            submitButton.textContent = 'Thanks for voting!';
            
            // Mark as voted in local storage
            //localStorage.setItem('hasVoted', 'true');
            
            // Show the results
            displayResults();
        }
    });
});
// Initialize the poll
document.addEventListener('DOMContentLoaded', function() {
    checkAlreadyVoted();
});