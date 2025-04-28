document.addEventListener('DOMContentLoaded', function() {
    // Debug helper - logs messages with a consistent prefix
    function debug(message, obj) {
        console.log(`[Gallery Debug] ${message}`, obj || '');
    }

    // Find all gallery containers
    const galleryContainers = document.querySelectorAll('.gallery-grid');
    debug(`Found ${galleryContainers.length} gallery containers`);
    
    // Single lightbox for all galleries
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const lightboxClose = document.getElementById('lightbox-close');
    const lightboxPrev = document.getElementById('lightbox-prev');
    const lightboxNext = document.getElementById('lightbox-next');
    
    // Track the active gallery and index
    let activeGallery = null;
    let activeGalleryItems = [];
    let currentIndex = 0;
    
    // Initialize each gallery
    galleryContainers.forEach((container, galleryIndex) => {
        // Get all gallery items for this specific container
        const galleryItems = container.querySelectorAll('.gallery-item');
        debug(`Gallery ${galleryIndex} has ${galleryItems.length} items`);
        
        // Add click event to each gallery item
        galleryItems.forEach((item, itemIndex) => {
            item.addEventListener('click', function(e) {
                // Prevent default action if it's a link
                e.preventDefault();
                
                debug(`Clicked item ${itemIndex} in gallery ${galleryIndex}`);
                
                // Set the active gallery
                activeGallery = container;
                activeGalleryItems = galleryItems;
                currentIndex = itemIndex;
                
                // Open the lightbox
                openLightbox();
            });
        });
    });
    
    // Function to open lightbox with current item
    function openLightbox() {
        if (!activeGalleryItems || activeGalleryItems.length === 0) {
            debug('No active gallery items found');
            return;
        }
        
        updateLightboxContent();
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
    }
    
    // Function to close lightbox
    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = ''; // Restore scrolling
    }
    
    // Function to update lightbox content based on current index
    function updateLightboxContent() {
        const item = activeGalleryItems[currentIndex];
        
        if (!item) {
            debug('No item found at index', currentIndex);
            return;
        }
        
        const img = item.querySelector('img');
        const caption = item.querySelector('figcaption') || item.querySelector('.caption');
        
        if (img) {
            debug(`Setting lightbox image: ${img.src}`);
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt || '';
        }
        
        if (caption) {
            lightboxCaption.textContent = caption.textContent || '';
        } else {
            lightboxCaption.textContent = '';
        }
    }
    
    // Function to navigate to previous image
    function prevImage() {
        if (!activeGalleryItems || activeGalleryItems.length === 0) return;
        
        currentIndex = (currentIndex - 1 + activeGalleryItems.length) % activeGalleryItems.length;
        debug(`Moving to previous image, new index: ${currentIndex}`);
        updateLightboxContent();
    }
    
    // Function to navigate to next image
    function nextImage() {
        if (!activeGalleryItems || activeGalleryItems.length === 0) return;
        
        currentIndex = (currentIndex + 1) % activeGalleryItems.length;
        debug(`Moving to next image, new index: ${currentIndex}`);
        updateLightboxContent();
    }
    
    // Add event listeners for lightbox controls
    if (lightboxClose) {
        lightboxClose.addEventListener('click', closeLightbox);
    }
    
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', prevImage);
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', nextImage);
    }
    
    // Close lightbox when clicking outside the image
    if (lightbox) {
        lightbox.addEventListener('click', function(e) {
            if (e.target === lightbox) {
                closeLightbox();
            }
        });
    }
    
    // Add keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (!lightbox.classList.contains('active')) return;
        
        if (e.key === 'Escape') {
            closeLightbox();
        } else if (e.key === 'ArrowLeft') {
            prevImage();
        } else if (e.key === 'ArrowRight') {
            nextImage();
        }
    });
});