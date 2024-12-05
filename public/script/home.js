

document.addEventListener('DOMContentLoaded', () => {
    loadFragrances(); // Load fragrances on DOMContentLoaded
    loadFragrancesToSlider();
});
function loadFragrances() {
    return fetch('/fragrances/getAllFragrances')  // Fetch fragrances from the correct API
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(fragrances => {
            console.log('Fragrances fetched:', fragrances);

            // Define brands and their corresponding flex containers
            const brandMappings = [
                { brand: 'Tom Ford', selector: '.fragrance-flex1' },
                { brand: 'Creed', selector: '.fragrance-flex2' },
                { brand: 'Valentino', selector: '.fragrance-flex3' },
                { brand: 'Tiziana Terenzi', selector: '.fragrance-flex4' }
            ];

            // Process each brand section
            brandMappings.forEach(({ brand, selector }) => {
                const brandFragrances = fragrances.filter(fragrance => fragrance.brand === brand);
                const firstFourFragrances = brandFragrances.slice(0, 5);
                console.log(`Filtered fragrances for ${brand}:`, firstFourFragrances);

                const insertLocation = document.querySelector(selector);
                const carouselDiv = document.createElement('div');
                carouselDiv.classList.add('owl-carousel'); // Use Owl Carousel's class
                insertLocation.appendChild(carouselDiv);

                // Add cards to the carousel
                firstFourFragrances.forEach(fragrance => {
                    const fragranceCard = document.createElement('div');
                    fragranceCard.classList.add('card');

                    fragranceCard.innerHTML = `
                        <div class="cardimg" style="background-image: url(${fragrance.image});"></div>
                        <div class="card-info">
                            <span>${fragrance.brand} – ${fragrance.title}</span>
                            <span class="currentprice"><span class="pricebefore">ფასი - </span>${fragrance.price} ₾</span>
                            <div class="card-bnts">
                                <button class="addcartbnt" data-fragrance-id="${fragrance.id}">
                                    <span class="addcartbnt-span addcartbntface">
                                        <a href="https://m.me/effectline.georgia/" target="_blank">
                                            დაგვიკავშირდი  -  <i class="fa-brands fa-facebook-f"></i>
                                        </a>
                                    </span> 
                                </button>
                                <button class="addcartbnt" data-fragrance-id="${fragrance.id}">
                                    <span class="addcartbnt-span addcartbntinsta">
                                        <a href="https://ig.me/m/online.effect" target="_black">
                                            დაგვიკავშირდი -  <i class="fa-brands fa-instagram"></i>
                                        </a>
                                    </span> 
                                </button>
                            </div>
                        </div>
                    `;

                    carouselDiv.appendChild(fragranceCard);
                });

                // Initialize the Owl Carousel for this section
                $(carouselDiv).owlCarousel({
                    loop: true,
                    margin: 10,
                    nav: true,
                    dots: true,
                    responsive: {
                       0: {
                            items: 2
                        },
                        500: {
                            items: 2
                        },
                        750: {
                            items: 2
                        },
                        850: {
                            items: 3 // On screens with width 850px or less, show 2 items
                        },
                        1200: {
                            items: 4
                        },
                        1800: {
                            items: 5 // On screens with width 850px or less, show 2 items
                        }
                    }
                });
            });
        })
        .catch(error => console.error('Error fetching fragrances:', error));
}

let currentIndex = 0;

function moveSlide(direction) {
    const carouselImages = document.querySelector('.carousel-images');
    const images = document.querySelectorAll('.carousel-images img');
    const totalImages = images.length;

    currentIndex += direction;

    if (currentIndex < 0) {
        currentIndex = totalImages - 1;
    } else if (currentIndex >= totalImages) {
        currentIndex = 0;
    }

    const translateX = -currentIndex * 100;
    carouselImages.style.transform = `translateX(${translateX}%)`;
}


mediaQuery.addEventListener('change', handleMediaQueryChange);
handleMediaQueryChange(mediaQuery);










// Custom Alert Function with Auto Hide
function showCustomAlert(message) {
    const alertPopup = document.getElementById('custom-alert');
    alertPopup.querySelector('p').textContent = message;

    // Show the alert with smooth fade-in
    alertPopup.classList.remove('hide'); // Remove hide class
    alertPopup.classList.add('show'); // Add show class
    alertPopup.style.display = 'block'; // Set display to block

    // Automatically hide the alert after 2 seconds
    setTimeout(() => {
        alertPopup.classList.remove('show'); // Fade-out
        setTimeout(() => {
            alertPopup.classList.add('hide'); // Add hide class after fade-out
            alertPopup.style.display = 'none'; // Fully hide after fade-out
        }, 500); // Wait for fade-out transition (0.5s)
    }, 2000); // Show for 2 seconds
}




function loadFragrancesToSlider() {
    fetch('/fragrances/getAllFragrances')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(fragrances => {
            populateSlider(fragrances);
        })
        .catch(error => console.error('Error fetching fragrances:', error));
}

function populateSlider(fragrances) {
    const sliderContainer = document.querySelector('.slider-container');

    // Clear existing content in case this is called multiple times
    sliderContainer.innerHTML = '';

    // Create and append slider items for all fragrances
    fragrances.forEach(fragrance => {
        const sliderItem = document.createElement('div');
        sliderItem.classList.add('slider-item');

        const img = document.createElement('img');
        img.src = fragrance.image; // Assuming `image` is the property containing the image URL
        img.alt = fragrance.title || 'Fragrance'; // Use `title` or a default value

        sliderItem.appendChild(img);
        sliderContainer.appendChild(sliderItem);
    });
}
