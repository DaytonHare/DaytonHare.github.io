$(document).foundation();

// List of IDs to include in the Orbit slides
const slideIds = [20, 21]; // Update with your list of IDs

// Load the JSON data and dynamically create the slides
$.getJSON('../jsonFiles/compositions.json', function(data) { // Updated path to data.json
    let orbitContainer = $('#orbit-container');
    let orbitBullets = $('#orbit-bullets');
    
    // Filter data to only include items with specified IDs
    let filteredData = data.filter(item => slideIds.includes(item.id));
    
    filteredData.forEach((item, index) => {
      let activeClass = index === 0 ? 'is-active' : '';
      
      // Add the slide
      orbitContainer.append(`
        <li class="orbit-slide ${activeClass}">
          <div class="docs-example-orbit-slide">
            <div class="grid-x grid-padding-x align-middle">
              <div class="cell small-6">
                <img src="${item.scoreImageLoc}" alt="${item.title} Score" class="responsive-score">
              </div>
              <div class="cell small-6">
                <h2>${item.title}</h2>
                <p><strong>Instrumentation:</strong> ${item.instrumentation}</p>
                <p><strong>Duration:</strong> ${item.duration}</p>
                <blockquote>Placeholder for quote about the piece.</blockquote>
                <div class="soundcloud-placeholder">SoundCloud link will go here.</div>
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