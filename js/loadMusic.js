$(document).foundation();

/* --- GLOBAL: store scroll position for modal fix --- */
var modalScrollPosition = 0;

// Load JSON data and populate tabs
$.getJSON("../jsonFiles/compositions.json", function(data) {

    // Sort by year DESC
    data.sort(function(a, b) {
        return b.year - a.year;
    });

    data.forEach(function(item) {
        var contentId = "";
        switch(item.type) {
            case "large ensemble":
                contentId = "#largeEnsembleContent";
                break;
            case "small ensemble":
                contentId = "#smallEnsembleContent";
                break;
            case "solo / duo":
                contentId = "#soloDuoContent";
                break;
            case "vocal":
                contentId = "#vocalContent";
                break;
        }

        /* --- MEDIA PRIORITY + LAYOUT ---
           Priority:
           1. SoundCloud
           2. Thumbnail
           3. Score image
           4. Nothing
        ----------------------------------------------------------- */

        let mediaHtml = "";

        if (item.soundCloudLink) {
            // SoundCloud (keeps original player, but wrapped to constrain height)
            mediaHtml = `
                <div class="card-media-wrapper">
                    <iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay"
                        src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${item.soundCloudLink}&color=%232e1a47&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false">
                    </iframe>
                </div>
            `;
        } else if (item.thumbnail) {
            // Thumbnail image
            mediaHtml = `
                <div class="card-media-wrapper">
                    <img src="${item.thumbnail}"
                         alt="${item.title} thumbnail"
                         class="card-media-image">
                </div>
            `;
        } else if (item.scoreImageLoc) {
            // Score image fallback
            mediaHtml = `
                <div class="card-media-wrapper">
                    <img src="${item.scoreImageLoc}"
                         alt="${item.title} score image"
                         class="card-media-image">
                </div>
            `;
        }
        // else leave mediaHtml = "" (no media)

        /* --- CARD HTML --- */
        var cardHtml = `
            <div class="cell">
                <div class="card" data-equalizer-watch>
                    <div class="card-section">
                        <h3>${item.title} (${item.year})</h3>
                        <p>${item.instrumentation}</p>
                        <p>${item.duration}</p>
                        ${mediaHtml}
                        <button class="button open-modal"
                                data-open="exampleModal1"
                                data-id="${item.id}">
                            More Information
                        </button>
                    </div>
                </div>
            </div>
        `;

        var $card = $(cardHtml);

        // Add to ALL tab
        $("#allContent").append($card);

        // Add to specific category
        if (contentId) {
            $(contentId).append($card.clone());
        }
    });

    /* --- BUILD LIST VIEW --- */
    var categories = ["large ensemble", "small ensemble", "solo / duo", "vocal"];

    categories.forEach(function(cat) {
        var catItems = data.filter(item => item.type === cat);

        if (catItems.length > 0) {
            var categoryHtml = `<h3>${cat.charAt(0).toUpperCase() + cat.slice(1)}</h3><ul>`;

            catItems.forEach(function(item) {
                var listenButton = item.soundCloudLink
                    ? `<button class="tiny-button open-modal" style="color:MistyRose;" data-id="${item.id}">
                           <i class="fas fa-external-link-alt"></i> 
                           <i class="fas fa-music"></i>
                       </button>`
                    : '';

                categoryHtml += `
                    <li>
                        <a href="#" class="popup-link open-modal" data-id="${item.id}">
                            ${item.title}
                        </a>
                        (${item.instrumentation}, ${item.year}) ${listenButton}
                    </li>
                `;
            });

            categoryHtml += "</ul>";
            $("#allListContent").append(categoryHtml);
        }
    });

    /* --- MODAL HANDLERS (WITH SCROLL FIX) --- */
    $(document).on("click", ".open-modal", function(event) {
        event.preventDefault();

        var id = $(this).data("id");
        var item = data.find(i => i.id == id);
        if (!item) return;

        populateModal(item);

        // Save scroll position
        modalScrollPosition = window.pageYOffset || document.documentElement.scrollTop || 0;

        // Lock scroll while keeping screen visually still
        $('body')
            .addClass('no-scroll')
            .css('top', -modalScrollPosition + 'px');

        $('#exampleModal1').foundation('open');
    });

    // Restore scroll on close (bound once)
    $('#exampleModal1').on('closed.zf.reveal', function() {
        $('body')
            .removeClass('no-scroll')
            .css('top', '');

        window.scrollTo(0, modalScrollPosition);
    });

    /* --- REINIT FOUNDATION --- */
    $(document).foundation();
    if (typeof Foundation !== "undefined" && Foundation.reInit) {
        Foundation.reInit(['equalizer', 'reveal']);
    }

    setTimeout(adjustContentPadding, 120);
});

/* --- NAVBAR PADDING LOGIC --- */
function adjustContentPadding() {
    console.log("adjustContentPadding called...");
    var titleBarHeight = $('.title-bar').is(':visible') ? $('.title-bar').outerHeight() : 0;
    var topBarHeight   = $('.top-bar').is(':visible')   ? $('.top-bar').outerHeight()   : 0;
    var activeBarHeight = Math.max(titleBarHeight, topBarHeight) + 20;

    if (activeBarHeight > 20) {
        $('#navbar-padding').height(activeBarHeight);
    } else {
        setTimeout(adjustContentPadding, 300);
    }
}

/* --- MODAL CONTENT POPULATION --- */
function populateModal(item) {

    $("#modalTitle").text(`${item.title} (${item.year})`);
    $("#modalInstrumentation").text(item.instrumentation);
    $("#modalDuration").text(item.duration);

    if (item.commission) {
        $("#modalCommissioner").text(`Commissioned by: ${item.commissioner}`).show();
    } else {
        $("#modalCommissioner").hide();
    }

    if (item.premierDate && item.premierEnsemble) {
        $("#modalPremier").text(`Premier: ${item.premierDate} with ${item.premierEnsemble}`).show();
    } else {
        $("#modalPremier").hide();
    }

    if (item.scoreImageLoc) {
        $("#modalImage").attr("src", item.scoreImageLoc).show();
    } else {
        $("#modalImage").hide();
    }

    if (item.programNote) {
        $("#programNote").text(item.programNote).show();
    } else {
        $("#programNote").hide();
    }

    if (item.soundCloudLink) {
        $("#modalSoundCloud").html(`
            <iframe width="100%" height="20" scrolling="no" frameborder="no" allow="autoplay"
                src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${item.soundCloudLink}&color=%236c3a9f&inverse=true&auto_play=false&show_user=true"
                style="background:black;">
            </iframe>
        `).show();
    } else {
        $("#modalSoundCloud").hide();
    }

    if (item.youtubeLink) {
        $("#modalYouTube").html(`
            <iframe width="420" height="315"
                    src="https://www.youtube.com/embed/${item.youtubeLink}"
                    frameborder="0"
                    allowfullscreen>
            </iframe>
        `).show();
    } else {
        $("#modalYouTube").hide();
    }

    $("#modalBuyLink").attr("href",
        `mailto:daytonhare.music@gmail.com?subject=Inquiry about ${item.title}`);
}
