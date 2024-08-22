$(document).foundation();

// List of IDs to include in the Orbit slides
const slideIds = [21, 9, 17]; // Update with your list of IDs

// Load the JSON data and dynamically create the slides
$.getJSON('../jsonFiles/compositions.json', function(data) { 
    let orbitContainer = $('#orbit-container');
    let orbitBullets = $('#orbit-bullets');
    
    // Filter data to only include items with specified IDs
    let filteredData = data.filter(item => slideIds.includes(item.id));
    
    filteredData.forEach((item, index) => {
        let activeClass = index === 0 ? 'is-active' : '';
        let contentHtml;

        // Check if scoreImageLoc exists and preload the image
        if (item.scoreImageLoc) {
            let img = new Image();
            img.src = item.scoreImageLoc;
            
            img.onload = function() {
                // If image loads successfully, set contentHtml to the image
                contentHtml = `<img src="${item.scoreImageLoc}" alt="${item.title} Score" class="responsive-score">`;
                appendSlide(contentHtml);
            };

            img.onerror = function() {
                // If image fails to load, check for YouTube link
                if (item.youtubeLink) {
                    contentHtml = `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${item.youtubeLink}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                } else {
                    // If no YouTube link, leave the content blank
                    contentHtml = `<div class="blank-placeholder"></div>`;
                }
                appendSlide(contentHtml);
            };
        } else if (item.youtubeLink) {
            // If no score image, but there is a YouTube link
            contentHtml = `<iframe width="100%" height="315" src="https://www.youtube.com/embed/${item.youtubeLink}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
            appendSlide(contentHtml);
        } else {
            // If neither, leave blank
            contentHtml = `<div class="blank-placeholder"></div>`;
            appendSlide(contentHtml);
        }

        function appendSlide(contentHtml) {
            // Add the slide with the content
            orbitContainer.append(`
                <li class="orbit-slide ${activeClass}">
                  <div class="docs-example-orbit-slide">
                    <div class="grid-x grid-padding-x align-middle">
                      <div class="cell small-6">
                        ${contentHtml}
                      </div>
                      <div class="cell small-6">
                        <h2>${item.title}</h2>
                        <p>${item.instrumentation}, ${item.duration}, ${item.year}</p>
                        <blockquote>${item.programNote || ''}</blockquote>
                        <iframe width="100%" height="166" scrolling="no" frameborder="no" allow="autoplay" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/${item.soundCloudLink}&color=%23000000&auto_play=false&hide_related=true&show_comments=false&show_user=false&show_reposts=false&show_teaser=false"></iframe>
                      </div>
                    </div>
                  </div>
                </li>
            `);
            
            // Add the bullet
            orbitBullets.append(`
                <button class="${activeClass}" data-slide="${index}">
                  <span class="show-for-sr">${item.title} details.</span>
                  ${index === 0 ? '<span class="show-for-sr" data-slide-active-label>Current Slide</span>' : ''}
                </button>
            `);

            // Reinitialize Orbit and update height
            updateOrbitHeight();
        }
    });
  
    // Reinitialize the Orbit component after adding dynamic content
    let orbit = new Foundation.Orbit($('.orbit'), {
      autoPlay: true,
      timerDelay: 5000 // Set the delay in milliseconds (5 seconds)
    });
  
    // Calculate and set the minimum height of the Orbit container based on the tallest slide
    function updateOrbitHeight() {
      let maxHeight = 0;
      $('.orbit-slide').each(function() {
        const slideHeight = $(this).outerHeight();
        if (slideHeight > maxHeight) {
          maxHeight = slideHeight;
        }
      });
      orbitContainer.css('min-height', maxHeight);
    }
  
    // Initial height calculation
    updateOrbitHeight();
  
    // Adjust Orbit container height on window resize
    $(window).on('resize', function() {
      updateOrbitHeight();
    }).trigger('resize');
});
