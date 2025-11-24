$(document).foundation();

// Load the navbar and footer, then reinitialize Foundation
$(function() {
    console.log("Starting script...");

    // ---------- LOAD NAVBAR ----------
    $("#navbar").load("navbar.html", function(response, status, xhr) {
        if (status == "error") {
            console.error("Error loading navbar: ", xhr.status, xhr.statusText);
        } else {
            console.log("Navbar loaded successfully.");
            $(document).foundation();
            setTimeout(function() {
                adjustContentPadding();
                forceReflow();
                applyActiveNavHighlight();  // highlight after navbar is in DOM
            }, 200);
        }
    });

    // ---------- LOAD FOOTER ----------
    $("#footer").load("footer.html", function(response, status, xhr) {
        if (status == "error") {
            console.error("Error loading footer: ", xhr.status, xhr.statusText);
        } else {
            console.log("Footer loaded successfully.");
            $(document).foundation();
        }
    });

    // ---------- NAV HIGHLIGHT HELPERS ----------

    // Normalize pathname: treat / and /index.html as same, drop trailing slash
    function canonPath(u) {
        var p = u.pathname;
        if (/\/index\.html$/i.test(p)) p = p.replace(/\/index\.html$/i, "");
        if (p.length > 1 && p.endsWith("/")) p = p.slice(0, -1);
        return p || "";
    }

    // Apply active classes to current page link (+ submenu parent)
    function applyActiveNavHighlight() {
        var $nav = $("#example-menu");
        if (!$nav.length) return;

        var here = new URL(location.href);
        var herePath = canonPath(here);
        var hereHash = here.hash;

        // Clear previous active states
        $nav.find(".is-active, .active").removeClass("is-active active");

        $nav.find("a[href]").each(function() {
            var href = $(this).attr("href");
            try {
                var u = new URL(href, location.href);

                // Skip external / mailto / tel
                if (u.origin !== location.origin) return;

                var linkPath = canonPath(u);
                var hasHash = !!u.hash;

                var pageMatches = (linkPath === herePath);
                var hashMatches = hasHash ? (u.hash === hereHash) : true;

                // If link includes a hash, require both page + exact hash to match.
                // If no hash on link, page match is enough.
                var isActive = pageMatches && hashMatches;

                if (isActive) {
                    $(this).addClass("is-active");
                    $(this).closest("li").addClass("active");

                    // If it's a submenu item, also mark its parent menu item
                    var $parentMenu = $(this).closest("ul.submenu").closest("li.has-submenu");
                    if ($parentMenu.length) {
                        $parentMenu.addClass("active");
                        $parentMenu.children("a").first().addClass("is-active");
                    }
                }

                // Special case: on music page (any hash), mark top-level "music" link as active too
                if (!u.hash && linkPath.endsWith("/music") && herePath.endsWith("/music")) {
                    $(this).addClass("is-active");
                    $(this).closest("li").addClass("active");
                }
            } catch (e) {
                // Ignore invalid/relative-only hrefs that new URL can't parse
            }
        });
    }
    // ---------- END NAV HIGHLIGHT HELPERS ----------

    // ---------- PADDING / LAYOUT HELPERS ----------
    function adjustContentPadding() {
        console.log("adjustContentPadding called...");
        var titleBarHeight = $('.title-bar').is(':visible') ? $('.title-bar').outerHeight() : 0;
        var topBarHeight   = $('.top-bar').is(':visible')   ? $('.top-bar').outerHeight()   : 0;
        var activeBarHeight = Math.max(titleBarHeight, topBarHeight) + 20; // extra padding

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
        // Trigger reflow
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
            applyActiveNavHighlight();  // also run on initial ready (covers inline nav cases)
        }, 300);
    });
    // ---------- END PADDING / LAYOUT HELPERS ----------

    // ---------- HASH → TAB ACTIVATION (for music page) ----------
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
            applyActiveNavHighlight(); // keep highlight synced when hash changes
        });
    });
    // ---------- END HASH → TAB ACTIVATION ----------

    // Re-highlight when user clicks a nav link (useful for same-page hash links)
    $(document).on('click', '#example-menu a', function() {
        setTimeout(applyActiveNavHighlight, 0);
    });

    // ---------- MODAL SCROLL LOCK FOR #exampleModal1 ----------
    // This will be a no-op on pages without #exampleModal1
    var scrollPosition = 0;

    $('#exampleModal1')
      .on('open.zf.reveal', function () {
          // remember where we were
          scrollPosition = window.pageYOffset || document.documentElement.scrollTop || 0;

          // lock the body in place without visually jumping
          $('body')
            .addClass('no-scroll')
            .css({
                position: 'fixed',
                top: -scrollPosition + 'px',
                width: '100%'
            });
      })
      .on('closed.zf.reveal', function () {
          // unlock body
          $('body')
            .removeClass('no-scroll')
            .css({
                position: '',
                top: '',
                width: ''
            });

          // restore scroll position
          window.scrollTo(0, scrollPosition);
      });
    // ---------- END MODAL SCROLL LOCK ----------
});
