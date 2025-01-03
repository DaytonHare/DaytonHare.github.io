$(document).foundation();

// Load JSON data and populate tabs
$.getJSON("../jsonFiles/compositions.json", function(data) {
    // Sort data by year in descending order
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

        var soundCloudHtml = item.soundCloudLink ? `
            <iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay"
            src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${item.soundCloudLink}&color=%232e1a47&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false">
            </iframe>
        ` : '';

        var cardHtml = `
            <div class="cell" data-equalizer-watch>
                <div class="card">
                    <div class="card-section">
                        <h3>${item.title} (${item.year})</h3>
                        <p>${item.instrumentation}</p>
                        <p>${item.duration}</p>
                        ${soundCloudHtml}
                        <button class="button" data-open="exampleModal1" data-id="${item.id}">More Information</button>
                    </div>
                </div>
            </div>
        `;

        $("#allContent").append(cardHtml); // Add to "All" tab
        $(contentId).append(cardHtml); // Add to specific category tab
    });

    // Setup click handlers for buttons to populate and show the modal
    $(".button[data-open='exampleModal1']").on("click", function(event) {
        event.preventDefault(); // Prevent default action to avoid scrolling

        var id = $(this).data("id");
        var item = data.find(i => i.id == id);

        // Populate modal with data
        $("#modalTitle").text(`${item.title} (${item.year})`);
        $("#modalInstrumentation").text(item.instrumentation);
        $("#modalDuration").text(item.duration);

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

        // Check for SoundCloud link and include it in the modal
        if (item.soundCloudLink) {
            $("#modalSoundCloud").html(`
                <iframe width="100%" height="20" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${item.soundCloudLink}&color=%236c3a9f&inverse=true&auto_play=false&show_user=true" style="background:black;"></iframe>
            `).show();
        } else {
            $("#modalSoundCloud").hide();
        }

        if (item.youtubeLink) {
            $("#modalYouTube").html(`<iframe width="420" height="315" src="https://www.youtube.com/embed/${item.youtubeLink}" frameborder="0" allowfullscreen></iframe>`).show();
        } else {
            $("#modalYouTube").hide();
        }

        $("#modalBuyLink").attr("href", `mailto:dayton.hare@yale.edu?subject=Inquiry about ${item.title}`);

        $('#exampleModal1').foundation('open');

        // Prevent body scroll when modal is open
        $('body').addClass('no-scroll'); // Add a class to prevent scrolling

        // Re-enable body scroll when modal is closed
        $('#exampleModal1').on('closed.zf.reveal', function() {
            $('body').removeClass('no-scroll'); // Remove the class when modal is closed
        });
    });

    $(document).foundation(); // Reinitialize Foundation after dynamic content is added
    setTimeout(adjustContentPadding, 100); // Adjust padding after dynamic content is added
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
