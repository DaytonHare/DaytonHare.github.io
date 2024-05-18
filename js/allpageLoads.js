$(document).foundation();

// Load the navbar and footer, then reinitialize Foundation
$(function() {
    $("#navbar").load("navbar.html", function(response, status, xhr) {
        if (status == "error") {
            console.error("Error loading navbar: ", xhr.status, xhr.statusText);
        } else {
            console.log("Navbar loaded successfully.");
            $(document).foundation(); // Reinitialize Foundation
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
        var navbarHeight = $('#navbar').outerHeight();
        $('#navbar-padding').height(navbarHeight);
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
        adjustContentPadding();
    }, 100));

    // Initial adjustment after document is ready
    $(document).ready(function() {
        adjustContentPadding();
    });
});
