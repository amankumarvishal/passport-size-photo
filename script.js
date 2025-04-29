// Hamburger Menu Toggle
function tooglemenu(element) {
    const navLinks = document.querySelector('.navlinks');
    navLinks.classList.toggle('active');

    // Animate hamburger icon
    element.classList.toggle('change');
    const bars = element.querySelectorAll('.bar1, .bar2, .bar3');
    bars[0].classList.toggle('rotate1');
    bars[1].classList.toggle('hide');
    bars[2].classList.toggle('rotate2');
}

// Search Functionality
document.getElementById('SearchINP').addEventListener('input', function(e) {
    const query = e.target.value.toLowerCase();
    const tools = document.querySelectorAll('.toolcontainer a');
    const searchResults = document.querySelector('.placesrch');

    // Clear previous results
    searchResults.innerHTML = '';

    if (query.length > 0) {
        const filteredTools = Array.from(tools).filter(tool => 
            tool.textContent.toLowerCase().includes(query)
        );

        if (filteredTools.length > 0) {
            filteredTools.forEach(tool => {
                const resultItem = document.createElement('a');
                resultItem.href = tool.href;
                resultItem.textContent = tool.textContent;
                resultItem.className = 'search-result';
                searchResults.appendChild(resultItem);
            });
            searchResults.style.display = 'block';
        } else {
            searchResults.innerHTML = '<p>No tools found</p>';
            searchResults.style.display = 'block';
        }
    } else {
        searchResults.style.display = 'none';
    }
});

// Crop Popup Functionality
let cropper = null;

function initializeCropper(imageSrc) {
    const cropImage = document.getElementById('crpiid');
    cropImage.src = imageSrc;

    // Destroy existing cropper instance if any
    if (cropper) {
        cropper.destroy();
    }

    // Initialize Cropper.js (assuming Cropper.js is included)
    cropper = new Cropper(cropImage, {
        aspectRatio: NaN, // Free aspect ratio
        viewMode: 1,
        autoCropArea: 0.8,
        responsive: true,
    });

    document.querySelector('.croppopus').style.display = 'block';
}

// Rotate Image
function rotateimagecr() {
    const rotateSlider = document.getElementById('rimgslide');
    if (cropper) {
        cropper.rotateTo(parseInt(rotateSlider.value));
    }
}

// Zoom Image
function zoomimagecr() {
    const zoomSlider = document.getElementById('zomimgslide');
    if (cropper) {
        const zoomValue = parseInt(zoomSlider.value) / 100;
        cropper.zoomTo(zoomValue);
    }
}

// Unit Toggle (PX, MM, CM)
document.querySelectorAll('.sizbtna').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.sizbtna').forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');

        const unit = this.getAttribute('dm');
        document.querySelectorAll('.dimentyp').forEach(span => span.textContent = unit);
        document.querySelector('.dpisecd').classList.toggle('hide', unit === 'PX');
    });
});

// Crop Image
document.getElementById('cropimagedone').addEventListener('click', function() {
    if (cropper) {
        const croppedCanvas = cropper.getCroppedCanvas();
        const croppedImage = croppedCanvas.toDataURL('image/png');
        // Handle cropped image (e.g., display or download)
        const link = document.createElement('a');
        link.href = croppedImage;
        link.download = 'cropped-image.png';
        link.click();
        closeCropPopup();
    }
});

// Resize Image
document.getElementById('resizeimagedone').addEventListener('click', function() {
    if (cropper) {
        const width = parseFloat(document.getElementById('widinp').value);
        const height = parseFloat(document.getElementById('highinp').value);
        const unit = document.querySelector('.sizbtna.active').getAttribute('dm');
        const dpi = parseInt(document.getElementById('dpi_inp').value) || 300;

        // Convert MM/CM to pixels if needed
        let pixelWidth = width;
        let pixelHeight = height;
        if (unit === 'MM') {
            pixelWidth = (width / 25.4) * dpi;
            pixelHeight = (height / 25.4) * dpi;
        } else if (unit === 'CM') {
            pixelWidth = (width / 2.54) * dpi;
            pixelHeight = (height / 2.54) * dpi;
        }

        const croppedCanvas = cropper.getCroppedCanvas({
            width: Math.round(pixelWidth),
            height: Math.round(pixelHeight)
        });
        const resizedImage = croppedCanvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = resizedImage;
        link.download = 'resized-image.png';
        link.click();
        closeCropPopup();
    }
});

// Close Crop Popup
function closeCropPopup() {
    document.querySelector('.croppopus').style.display = 'none';
    if (cropper) {
        cropper.destroy();
        cropper = null;
    }
}

// Suggestion Form Submission
document.getElementById('subformbt').addEventListener('click', function() {
    const suggestion = document.getElementById('sugestiontxtar').value;
    const email = document.querySelector('.emailinp').value;

    if (!suggestion.trim()) {
        alert('Please enter a suggestion.');
        return;
    }

    const data = new FormData();
    data.append('suggestion', suggestion);
    if (email.trim()) {
        data.append('email', email);
    }

    fetch('/submit_suggestion', {
        method: 'POST',
        body: data
    })
    .then(response => response.json())
    .then(data => {
        alert('Thank you for your suggestion!');
        document.getElementById('sugestiontxtar').value = '';
        document.querySelector('.emailinp').value = '';
    })
    .catch(error => {
        console.error('Error submitting suggestion:', error);
        alert('Error submitting suggestion. Please try again later.');
    });
});

// Spinner Overlay
function showSpinner() {
    document.getElementById('spinneroverl').classList.remove('hide');
}

function hideSpinner() {
    document.getElementById('spinneroverl').classList.add('hide');
}

// Initialize Page
document.addEventListener('DOMContentLoaded', function() {
    // Hide spinner after page load
    hideSpinner();

    // Handle mobile menu bar animations
    const menuContainer = document.querySelector('.mencontainer');
    if (menuContainer) {
        menuContainer.addEventListener('click', function() {
            tooglemenu(this);
        });
    }

    // Placeholder for ad loading (assuming script_ad.js handles this)
    const adContainer = document.getElementById('sidebarxad');
    if (adContainer) {
        adContainer.innerHTML = '<p>Ad Placeholder</p>'; // Replace with actual ad logic
    }
});

// Handle page transitions
window.addEventListener('beforeunload', showSpinner);
