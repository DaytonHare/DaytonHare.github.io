// loadMusic.js

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

    var cardHtml = `
      <div class="cell" data-equalizer-watch>
        <div class="card">
          <img src="${item.scoreImageLoc}" alt="Score Image">
          <div class="card-section">
            <h4>${item.title}</h4>
            <p>${item.instrumentation}</p>
            <p>${item.duration}</p>
            <button class="button" data-open="exampleModal1" data-id="${item.id}">More Info</button>
          </div>
        </div>
      </div>
    `;

    $("#allContent").append(cardHtml); // Add to "All" tab
    $(contentId).append(cardHtml); // Add to specific category tab
  });

  // Setup click handlers for buttons to populate and show the modal
  $(".button[data-open='exampleModal1']").on("click", function() {
    var id = $(this).data("id");
    var item = data.find(i => i.id == id);

    $("#modalTitle").text(item.title);
    $("#modalInstrumentation").text(item.instrumentation);
    $("#modalDuration").text(item.duration);
    $("#modalImage").attr("src", item.scoreImageLoc);
    $("#modalSoundCloud iframe").attr("src", `https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${item.soundCloudLink}&color=%23ff5500&inverse=false&auto_play=false&show_user=true`);
    $("#modalBuyLink").attr("href", item.youtubeLink);

    $('#exampleModal1').foundation('open');
  });

  $(document).foundation(); // Reinitialize Foundation after dynamic content is added
});