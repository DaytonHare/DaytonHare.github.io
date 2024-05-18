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
            console.log("Calling adjustContentPadding after navbar load...");
            adjustContentPadding(); // Adjust content padding after navbar is loaded
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

    // Adjust content padding based on navbar height
    function adjustContentPadding() {
        console.log("adjustContentPadding called...");
        var navbarHeight = $('#navbar').outerHeight();
        console.log('Navbar height:', navbarHeight); // Debug log
        $('#navbar-padding').height(navbarHeight);
        console.log('Padding set to:', navbarHeight); // Debug log
    }

    // Debounce function to limit the rate at which a function can fire.
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
        adjustContentPadding();
    });
});
