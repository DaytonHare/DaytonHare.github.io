$(document).foundation();

// Load the navbar and footer, then reinitialize Foundation
$(function() {
    console.log("Starting script..."); // Debug log

    $("#navbar").load("navbar.html", function(response, status, xhr) {
        if (status == "error") {
            console.error("Error loading navbar: ", xhr.status, xhr.statusText);
        } else {
            console.log("Navbar loaded successfully.");
            $(document).foundation(); // Reinitialize Foundation
            setTimeout(adjustContentPadding, 100); // Increase delay to ensure rendering
        }
    });

    $("#footer").load("footer.html", function(response, status, xhr) {
        if (status == "error") {
            console.error("Error loading footer: ", xhr.status, xhr.statusText);
        } else {
            console.log("Footer loaded successfully.");
            $(document).foundation(); // Reinitialize Foundation
        }
    });

    // Adjust content padding based on the active bar height
    function adjustContentPadding() {
        console.log("adjustContentPadding called...");
        var titleBarHeight = $('.title-bar').is(':visible') ? $('.title-bar').outerHeight() : 0;
        var topBarHeight = $('.top-bar').is(':visible') ? $('.top-bar').outerHeight() : 0;
        var activeBarHeight = Math.max(titleBarHeight, topBarHeight) + 20; // Add 20px for extra padding

        console.log('Title bar height:', titleBarHeight); // Debug log
        console.log('Top bar height:', topBarHeight); // Debug log
        console.log('Active bar height:', activeBarHeight); // Debug log

        if (activeBarHeight > 20) { // Ensure at least 20px padding
            $('#navbar-padding').height(activeBarHeight);
            console.log('Padding set to:', activeBarHeight); // Debug log
        } else {
            console.log('Calculated height is too small, retrying...');
            setTimeout(adjustContentPadding, 300); // Retry after a short delay
        }
    }

    // Debounce function to limit the rate at which a function can fire
    function debounce(func, wait) {
        var timeout;
        return function() {
            var context = this, args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(function() {
                func.apply(context, args);
            }, wait);
        };
    }

    // Adjust padding on window resize
    $(window).resize(debounce(function() {
        console.log("Window resized, adjusting content padding...");
        adjustContentPadding();
    }, 100));

    // Initial adjustment after document is ready
    $(document).ready(function() {
        console.log("Document ready, calling adjustContentPadding...");
        setTimeout(adjustContentPadding, 300); // Increase delay to ensure rendering
    });
});
