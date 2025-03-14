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

let pollData = {};
const form = document.querySelector('#poll-form');
// Fetch current results on page load
fetch('https://dirtbikebreakdownpoll.rf.gd/get-results.php')
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            pollData = data.results;
        }
    })
    .catch(error => console.error('Error fetching results:', error));

form.addEventListener('submit', function(event) {
    event.preventDefault();
    
    const selectedOption = document.querySelector('input[name="poll"]:checked');
    
    /*if (!selectedOption) {
        errorMessage.textContent = 'Please select an option before voting.';
        errorMessage.style.display = 'block';
        return;
    }*/
    
    //errorMessage.style.display = 'none';
    const vote = selectedOption.value;
    
    // Create form data for the request
    const formData = new FormData();
    formData.append('vote', vote);
    
    // Send the vote to the server
    fetch('https://dirtbikebreakdownpoll.rf.gd/vote-handler.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        /*if (data.error) {
            errorMessage.textContent = data.error;
            errorMessage.style.display = 'block';
        }*/ if (data.success) { // was else if
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
    /*.catch(error => {
        console.error('Error submitting vote:', error);
        errorMessage.textContent = 'An error occurred. Please try again.';
        errorMessage.style.display = 'block';
    });*/
});
