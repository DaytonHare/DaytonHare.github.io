$(document).foundation();
    
// Load the navbar and log success or failure
$(function(){
    $("#navbar").load("navbar.html", function(response, status, xhr) {
    if (status == "error") {
        console.error("Error loading navbar: ", xhr.status, xhr.statusText);
    } else {
        console.log("Navbar loaded successfully.");
        $(document).foundation();
    }
    });

    // Load the footer and log success or failure
    $("#footer").load("footer.html", function(response, status, xhr) {
    if (status == "error") {
        console.error("Error loading footer: ", xhr.status, xhr.statusText);
    } else {
        console.log("Footer loaded successfully.");
        $(document).foundation(); // Reinitialize Foundation
    }
    });
});