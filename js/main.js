/*
Nav bar color wheel functionality, mobile menu toggle
*/
document.addEventListener('DOMContentLoaded', function() {
    // Get elements
    const navbar = document.querySelector('.navbar');
    const toggleButton = document.getElementById('bgToggle');
    const menuButton = document.createElement('button');
    const pageBG = document.querySelector('body');
    
    // Background cycling functionality
    const backgrounds = [
        'url("./img/DBBD_black_checker.jpg")',
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
    pageBG.style.backgroundImage = backgrounds[currentBg];

    toggleButton.addEventListener('click', function() {
        currentBg = (currentBg + 1) % backgrounds.length;
        navbar.style.backgroundImage = backgrounds[currentBg];
        pageBG.style.backgroundImage = backgrounds[currentBg];
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

/*
Poll functionality
*/

// What kind of rider are you? Poll
let pollData = {};
const form = document.querySelector('#poll-form');
const errorMessage = document.getElementById('error-message');
const submitButton = document.getElementById('submit-button');
const resultsContainer = document.getElementById('results-container');
const pollResults = document.getElementById('poll-results');
const loadingIndicator = document.getElementById('loading-indicator');
const alreadyVotedMessage = document.getElementById('already-voted-message');

// best bike brand poll
let pollData1 = {};
const form1 = document.querySelector('#poll-form1');
const errorMessage1 = document.getElementById('error-message1');
const submitButton1 = document.getElementById('submit-button1');
const resultsContainer1 = document.getElementById('results-container1');
const pollResults1 = document.getElementById('poll-results1');
const loadingIndicator1 = document.getElementById('loading-indicator1');
const alreadyVotedMessage1 = document.getElementById('already-voted-message1');

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
function checkAlreadyVoted(pollNum) {
    
    if(pollNum == 0){
        const hasVoted = localStorage.getItem('hasVoted') === 'true';
        if (hasVoted) {
            alreadyVotedMessage.style.display = 'block';
            form.style.display = 'none';
            fetchAndDisplayResults(0);
        } else {
            alreadyVotedMessage.style.display = 'none';
            pollResults.style.display = 'none'; // Hide results until after voting
        }
    }
    else{
        const hasVoted1 = localStorage.getItem('hasVoted1') === 'true';
        if (hasVoted1) {
            alreadyVotedMessage1.style.display = 'block';
            form1.style.display = 'none';
            fetchAndDisplayResults(1);
        } else {
            alreadyVotedMessage1.style.display = 'none';
            pollResults1.style.display = 'none'; // Hide results until after voting
        }
    }
}

// Display poll results
function displayResults(pollNum) {

    if(pollNum == 0){
        if (!pollData || Object.keys(pollData).length === 0) {
            resultsContainer.innerHTML = '<p>No results available at this time.</p>';
            return;
        }
        
        // Calculate total votes
        let totalVotes = 0;
        for (const option in pollData) {
            totalVotes += parseInt(pollData[option]);
        }

        // Find the maximum number of votes and determine the tied options
        let maxVotes = 0;
        let winningOptions = [];
        for (const option in pollData) {
            const votes = pollData[option];
            if (votes > maxVotes) {
                maxVotes = votes;
                winningOptions = [option];  // New winner found, reset list to this option
            } else if (votes === maxVotes) {
                winningOptions.push(option);  // Tie found, add to list of winners
            }
        }

        // Generate result bars
        let resultsHTML = '';
        for (const option in pollData) {
            const votes = pollData[option];
            const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
            
            // Determine the bar color: use green for the winners (including ties), gray for others
            const barColor = winningOptions.includes(option) ? 'blueviolet' : 'gray';

            resultsHTML += `
                <div class="result-item">
                    <div class="result-label">${option.charAt(0).toUpperCase() + option.slice(1)}: ${votes} votes (${percentage}%)</div>
                    <div class="result-bar-container">
                        <div class="result-bar" style="width: ${percentage}%; background-color: ${barColor};"></div>
                    </div>
                </div>
            `;
        }

        resultsContainer.innerHTML = resultsHTML;
        pollResults.style.display = 'block';
    }

    else{
        if (!pollData1 || Object.keys(pollData1).length === 0) {
            resultsContainer1.innerHTML = '<p>No results available at this time.</p>';
            return;
        }
        
        // Calculate total votes
        let totalVotes = 0;
        for (const option in pollData1) {
            totalVotes += parseInt(pollData1[option]);
        }

        // Find the maximum number of votes and determine the tied options
        let maxVotes = 0;
        let winningOptions = [];
        for (const option in pollData1) {
            const votes = pollData1[option];
            if (votes > maxVotes) {
                maxVotes = votes;
                winningOptions = [option];  // New winner found, reset list to this option
            } else if (votes === maxVotes) {
                winningOptions.push(option);  // Tie found, add to list of winners
            }
        }

        // Generate result bars
        let resultsHTML = '';
        for (const option in pollData1) {
            const votes = pollData1[option];
            const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
            
            // Determine the bar color: use green for the winners (including ties), gray for others
            //const barColor = winningOptions.includes(option) ? 'blueviolet' : 'gray';
            let barColor = 'white';
            let barOutline = 'white';
            if(option == 'yamaha'){
                if(winningOptions.includes(option)){
                    barColor = 'blue';
                    barOutline = 'white';
                }
                else{
                    barColor = 'black';
                    barOutline = 'blue';
                }
            }
            if(option == 'kawasaki'){
                if(winningOptions.includes(option)){
                    barColor = 'green';
                    barOutline = 'white';
                }
                else{
                    barColor = 'black';
                    barOutline = 'green';
                }
            }
            if(option == 'honda'){
                if(winningOptions.includes(option)){
                    barColor = 'red';
                    barOutline = 'white';
                }
                else{
                    barColor = 'black';
                    barOutline = 'red';
                }
            }
            if(option == 'suzuki'){
                if(winningOptions.includes(option)){
                    barColor = 'yellow';
                    barOutline = 'white';
                }
                else{
                    barColor = 'black';
                    barOutline = 'yellow';
                }
            }
            if(option == 'ktm'){
                if(winningOptions.includes(option)){
                    barColor = 'orange';
                    barOutline = 'white';
                }
                else{
                    barColor = 'black';
                    barOutline = 'orange';
                }
            }
            if(option == 'husqvarna'){
                if(winningOptions.includes(option)){
                    barColor = 'white';
                    barOutline = 'navyblue';
                }
                else{
                    barColor = 'black';
                    barOutline = 'white';
                }
            }
            if(option == 'other'){
                if(winningOptions.includes(option)){
                    barColor = 'blueviolet';
                    barOutline = 'white';
                }
                else{
                    barColor = 'black';
                    barOutline = 'blueviolet';
                }
            }
            resultsHTML += `
                <div class="result-item">
                    <div class="result-label">${option.charAt(0).toUpperCase() + option.slice(1)}: ${votes} votes (${percentage}%)</div>
                    <div class="result-bar-container">
                        <div class="result-bar" style="width: ${percentage}%; background-color: ${barColor}; border: 3px solid ${barOutline}"></div>
                    </div>
                </div>
            `;
        }

        resultsContainer1.innerHTML = resultsHTML;
        pollResults1.style.display = 'block';
    }
}

// Fetch current results
function fetchAndDisplayResults(pollNum) { // 0 - type poll, 1 - brand poll
    loadingIndicator.style.display = 'inline-block';
    
    if(pollNum == 0){
        fetchJSONP('https://dirtbikebreakdown.website/get-results-jsonp.php', function(data) {
            loadingIndicator.style.display = 'none';
            if (data.success) {
                pollData = data.results;
                displayResults(0);
            } else {
                errorMessage.textContent = data.error || 'Error loading poll results.';
                errorMessage.style.display = 'block';
            }
        });
    }

    else{
        fetchJSONP('https://dirtbikebreakdown.website/get-results-jsonp1.php', function(data1) {
            loadingIndicator.style.display = 'none';
            if (data1.success) {
                pollData1 = data1.results;
                displayResults(1);
            } else {
                errorMessage1.textContent = data1.error || 'Error loading poll results.';
                errorMessage1.style.display = 'block';
            }
        });
    }
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
    const voteUrl = `https://dirtbikebreakdown.website/vote-handle-jsonp.php?vote=${vote}`;
    
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
            localStorage.setItem('hasVoted', 'true');
            
            // Show the results
            displayResults(0);
        }
    });
});

form1.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const selectedOption = document.querySelector('input[name="poll1"]:checked');
    
    if (!selectedOption) {
        errorMessage1.textContent = 'Please select an option before voting.';
        errorMessage1.style.display = 'block';
        return;
    }
    
    errorMessage1.style.display = 'none';
    const vote = selectedOption.value;
    
    // Show loading indicator
    loadingIndicator1.style.display = 'inline-block';
    submitButton1.disabled = true;
    
    // Use JSONP to submit vote
    const voteUrl = `https://dirtbikebreakdown.website/vote-handle-jsonp1.php?vote=${vote}`;
    
    fetchJSONP(voteUrl, function(data1) {
        loadingIndicator1.style.display = 'none';
        
        if (data1.error) {
            errorMessage1.textContent = data1.error;
            errorMessage1.style.display = 'block';
            submitButton1.disabled = false;
        } else if (data1.success) {
            pollData1 = data1.results;
            
            // Disable the form to prevent multiple votes
            const radioButtons = document.querySelectorAll('input[name="poll1"]');
            radioButtons.forEach(button => {
                button.disabled = true;
            });
            
            submitButton1.disabled = true;
            submitButton1.textContent = 'Thanks for voting!';
            
            // Mark as voted in local storage
            localStorage.setItem('hasVoted1', 'true');
            
            // Show the results
            displayResults(1);
        }
    });
});

// Initialize the poll
document.addEventListener('DOMContentLoaded', function() {
    checkAlreadyVoted(0);
    checkAlreadyVoted(1);
});