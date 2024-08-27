$(document).foundation();

// Load the navbar and footer, then reinitialize Foundation
$(function() {
    console.log("Starting script...");

    $("#navbar").load("navbar.html", function(response, status, xhr) {
        if (status == "error") {
            console.error("Error loading navbar: ", xhr.status, xhr.statusText);
        } else {
            console.log("Navbar loaded successfully.");
            $(document).foundation();
            setTimeout(function() {
                adjustContentPadding();
                forceReflow();
            }, 200);
        }
    });

    $("#footer").load("footer.html", function(response, status, xhr) {
        if (status == "error") {
            console.error("Error loading footer: ", xhr.status, xhr.statusText);
        } else {
            console.log("Footer loaded successfully.");
            $(document).foundation();
        }
    });

    function adjustContentPadding() {
        console.log("adjustContentPadding called...");
        var titleBarHeight = $('.title-bar').is(':visible') ? $('.title-bar').outerHeight() : 0;
        var topBarHeight = $('.top-bar').is(':visible') ? $('.top-bar').outerHeight() : 0;
        var activeBarHeight = Math.max(titleBarHeight, topBarHeight) + 20;

        console.log('Title bar height:', titleBarHeight);
        console.log('Top bar height:', topBarHeight);
        console.log('Active bar height:', activeBarHeight);

        if (activeBarHeight > 20) {
            $('#navbar-padding').height(activeBarHeight);
            console.log('Padding set to:', activeBarHeight);
        } else {
            console.log('Calculated height is too small, retrying...');
            setTimeout(adjustContentPadding, 300);
        }
    }

    function forceReflow() {
        console.log("Forcing reflow to recalculate layout...");
        document.body.offsetHeight;
        setTimeout(function() {
            adjustContentPadding();
            console.log("Reflow completed and padding adjusted.");
        }, 100);
    }

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

    $(window).resize(debounce(function() {
        console.log("Window resized, adjusting content padding...");
        adjustContentPadding();
    }, 100));

    $(document).ready(function() {
        console.log("Document ready, calling adjustContentPadding...");
        setTimeout(function() {
            adjustContentPadding();
            forceReflow();
        }, 300);
    });

    function activateTabFromHash() {
        var hash = window.location.hash;
        if (hash) {
            var $tab = $('a[href="' + hash + '"]');
            if ($tab.length) {
                $tab.click();
                setTimeout(function() {
                    adjustContentPadding();
                    forceReflow();
                }, 100);
            }
        }
    }

    $(document).ready(function() {
        activateTabFromHash();

        $(window).on('hashchange', function() {
            activateTabFromHash();
        });
    });

    $(document).on('click', '.tabs-title a', function() {
        setTimeout(function() {
            adjustContentPadding();
            forceReflow();
        }, 300);
    });

    // Prevent scrolling issues on body when the modal is open
    $('#exampleModal1').on('open.zf.reveal', function() {
        $('body').addClass('no-scroll');
    }).on('closed.zf.reveal', function() {
        $('body').removeClass('no-scroll');
    });
});
