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