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
        $('#content').css('padding-top', navbarHeight + 'px');
    }

    // Adjust padding on window resize
    $(window).resize(function() {
        adjustContentPadding();
    });
});
