document.addEventListener('DOMContentLoaded', () => {
    const linksBtn = document.getElementById('links-btn');
    const shopBtn = document.getElementById('shop-btn');
    const linksSection = document.getElementById('links-section');
    const shopSection = document.getElementById('shop-section');
    const productSearch = document.getElementById('product-search');
    const productCards = document.querySelectorAll('.product-card');

    // --- Tab Switching (Point 1 & 8) ---
    function switchTab(activeBtn, activeSection, inactiveBtn, inactiveSection) {
        activeBtn.classList.add('active');
        activeSection.classList.add('active-tab');
        activeSection.classList.remove('hidden-tab');

        inactiveBtn.classList.remove('active');
        inactiveSection.classList.remove('active-tab');
        inactiveSection.classList.add('hidden-tab');
    }

    linksBtn.addEventListener('click', () => {
        switchTab(linksBtn, linksSection, shopBtn, shopSection);
    });

    shopBtn.addEventListener('click', () => {
        switchTab(shopBtn, shopSection, linksBtn, linksSection);
    });


    // --- Product Search (Point 3) ---
    productSearch.addEventListener('keyup', (e) => {
        const searchText = e.target.value.toLowerCase();

        productCards.forEach(card => {
            const productName = card.getAttribute('data-name').toLowerCase();
            
            if (productName.includes(searchText)) {
                card.style.display = 'block'; // Show if matches
            } else {
                card.style.display = 'none';  // Hide if no match
            }
        });
    });


    // --- Product Click Redirect (Point 4) ---
    productCards.forEach(card => {
        // Ensure the click handler is on the card itself, but not when the share button is clicked.
        card.addEventListener('click', (e) => {
            // Check if the click originated from the share dots or its parent
            if (e.target.closest('.share-dots')) {
                return; // Do nothing if sharing
            }
            
            const link = card.getAttribute('data-link');
            if (link) {
                window.open(link, '_blank'); // Open link in new tab
            }
        });
    });
});


// --- Product Share Function (Point 5) ---
// Defined outside DOMContentLoaded so it can be called from onclick attribute in HTML
function shareProduct(event, shareButton) {
    event.stopPropagation(); // Stop the card's click event from firing (Point 4)

    const card = shareButton.closest('.product-card');
    const productName = card.getAttribute('data-name');
    const productLink = card.getAttribute('data-link');
    const copyMessage = document.getElementById('copy-message');

    if (navigator.share) {
        // Web Share API (Mobile/Modern Browsers)
        navigator.share({
            title: `Check out ${productName} by Mohit Burad!`,
            url: productLink,
        }).catch(error => console.error('Error sharing:', error));
    } else {
        // Fallback: Copy link to clipboard (Desktop/Older Browsers)
        navigator.clipboard.writeText(productLink).then(() => {
            // Show copy message
            copyMessage.style.opacity = '1';
            setTimeout(() => {
                copyMessage.style.opacity = '0';
            }, 2000);
        }).catch(err => {
            console.error('Could not copy text: ', err);
            alert(`Copy this link: ${productLink}`);
        });
    }
}