document.addEventListener('DOMContentLoaded', () => {
    const linksBtn = document.getElementById('links-btn');
    const shopBtn = document.getElementById('shop-btn');
    const linksSection = document.getElementById('links-section');
    const shopSection = document.getElementById('shop-section');
    const productSearch = document.getElementById('product-search');
    const productCards = document.querySelectorAll('.product-card');
    const toggleButtons = document.querySelector('.toggle-buttons');
    const shopSquare = document.getElementById('shop-square');
    const globalShareBtn = document.getElementById('global-share-btn');
    const categoryButtons = document.querySelectorAll('.category-btn');

    const linksToShopBtn = document.getElementById('links-to-shop-btn');

    categoryButtons.forEach(btn => {
        btn.addEventListener('click', () => {
        // Remove 'active' from all buttons, add to clicked one
            categoryButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const selectedCategory = btn.getAttribute('data-category');
            productCards.forEach(card => {
                if (
                    selectedCategory === "all" ||
                    card.getAttribute('data-category') === selectedCategory
                ) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    if (shopSquare) {
        shopSquare.addEventListener('click', function() {
            shopBtn.click(); // Triggers the Shop tab slide, keeping all current transitions and logic!
        });
    }

    if (globalShareBtn) {
        globalShareBtn.addEventListener('click', shareWebsite);
    }

    // CATEGORY BAR SCROLLING
    const categoriesBar = document.getElementById('categories-bar');

    // Mouse wheel: Use vertical wheel to scroll horizontally
    categoriesBar.addEventListener('wheel', function(e) {
        // Only scroll if bar is overflown (has scroll)
        if (categoriesBar.scrollWidth > categoriesBar.clientWidth) {
            e.preventDefault();
            categoriesBar.scrollLeft += e.deltaY;
        }
    });

    // Touch: Drag to scroll horizontally (for tablets/mobile)
    let isTouching = false, lastX = 0, scrollStart = 0;

    categoriesBar.addEventListener('touchstart', function(e) {
        if (e.touches.length === 1) {
            isTouching = true;
            lastX = e.touches[0].clientX;
            scrollStart = categoriesBar.scrollLeft;
        }
    });

    categoriesBar.addEventListener('touchmove', function(e) {
        if (isTouching && e.touches.length === 1) {
            let newX = e.touches[0].clientX;
            let dx = lastX - newX;
            categoriesBar.scrollLeft = scrollStart + dx;
        }
    });

    categoriesBar.addEventListener('touchend', function(e) {
        isTouching = false;
    });    



    // --- Tab Switching (Point 1 & 8) ---
    let currentTab = 'shop'; // Track current tab for direction

    function switchTab(nextTab) {
        // set active
        if(nextTab === 'links') {
            linksBtn.classList.add('active');
            shopBtn.classList.remove('active');
            toggleButtons.classList.remove('shop-active');
            animateTabTransition(shopSection, linksSection, 'right'); // shop > links
            currentTab = 'links';
        } else {
            shopBtn.classList.add('active');
            linksBtn.classList.remove('active');
            toggleButtons.classList.add('shop-active');
            animateTabTransition(linksSection, shopSection, 'left'); // links > shop
            currentTab = 'shop';
        }
    }

    // Animate sliding transitions for content
    function animateTabTransition(hideSection, showSection, direction) {
        // Remove all slide classes
        hideSection.classList.remove('active-tab', 'slide-in-from-right', 'slide-in-from-left');
        showSection.classList.remove('slide-in-from-right', 'slide-in-from-left');

        // Hide goes offscreen
        hideSection.classList.add(direction === 'left' ? 'slide-in-from-left' : 'slide-in-from-right');
        hideSection.classList.remove('active-tab');

        // Show comes onscreen
        showSection.classList.add('active-tab');
        showSection.classList.add(direction === 'left' ? 'slide-in-from-right' : 'slide-in-from-left');

        // Force reflow to restart animation (important for rapid toggling)
        void showSection.offsetWidth;

        // Animate slide to center after a frame
        setTimeout(() => {
            showSection.classList.remove('slide-in-from-right', 'slide-in-from-left');
            showSection.classList.add('active-tab');
        }, 10);
    }

    linksBtn.addEventListener('click', () => {
        if (currentTab !== 'links') switchTab('links');
    });

    shopBtn.addEventListener('click', () => {
        if (currentTab !== 'shop') switchTab('shop');
    });


    // --- Product Search (Point 3) ---
    productSearch.addEventListener('keyup', (e) => {
        const searchText = e.target.value.toLowerCase();
        // Get the current active category
        const activeCategoryBtn = document.querySelector('.category-btn.active');
        const selectedCategory = activeCategoryBtn ? activeCategoryBtn.getAttribute('data-category') : "all";

        productCards.forEach(card => {
            const productName = card.getAttribute('data-name').toLowerCase();
            const cardCategory = card.getAttribute('data-category');

            // Show only if matches both category and search text
            if (
            (   selectedCategory === "all" || cardCategory === selectedCategory) &&
                productName.includes(searchText)
            ) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
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

function shareWebsite() {
    const pageUrl = window.location.href;
    const pageTitle = document.title;
    const copyMessage = document.getElementById('copy-message');

    if (navigator.share) {
        // Web Share API (Mobile/Modern Browsers)
        navigator.share({
            title: pageTitle,
            text: `Check out ${pageTitle}!`,
            url: pageUrl,
        }).catch(error => console.error('Error sharing:', error));
    } else {
        // Fallback: Copy link to clipboard (Desktop/Older Browsers)
        // Using document.execCommand('copy') as a more reliable cross-browser fallback in some environments
        const tempInput = document.createElement('input');
        tempInput.value = pageUrl;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);

        // Show copy message
        if (copyMessage) {
            copyMessage.textContent = 'Link Copied!';
            copyMessage.style.opacity = '1';
            setTimeout(() => {
                copyMessage.style.opacity = '0';
            }, 2000);
        }
    }
}

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
        const tempInput = document.createElement('input');
        tempInput.value = productLink;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy'); // Using execCommand for robustness
        document.body.removeChild(tempInput);
        
        // Show copy message
        if (copyMessage) {
            copyMessage.textContent = 'Product Link Copied!';
            copyMessage.style.opacity = '1';
            setTimeout(() => {
                copyMessage.style.opacity = '0';
            }, 2000);
        }
    }
}
