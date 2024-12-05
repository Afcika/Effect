
const priceSlider = document.getElementById("price-slider");
const currentPrice = document.getElementById("current-price");
const itemsPerPage = 12; // Define how many items to show per page
let currentPage = 1; // Initialize current page
let allFragrances = []; // Store all fetched fragrances
let filteredFragrances = []; // Store filtered fragrances

// Update price value as the slider is moved
priceSlider.addEventListener("input", function () {
    currentPrice.textContent = `${priceSlider.value} ₾`;
});

// Reset the slider and price on button click
const resetButton = document.querySelector(".red-bnt");
resetButton.addEventListener("click", function () {
    priceSlider.value = 90; // Reset to minimum value
    currentPrice.textContent = "90 ₾";
    displayAll(allFragrances); // Reset to show all fragrances
});

// Fetch fragrances on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    loadFragrances(); // Load fragrances on DOMContentLoaded
    loadFragrancesToSlider();
});

// Load all fragrances
function loadFragrances() {
    return fetch('/fragrances/getAllFragrances') // Fetch fragrances from the API
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(fragrances => {
            allFragrances = fragrances; // Store all fragrances
            filteredFragrances = fragrances; // Initially, filtered fragrances are all fragrances
            displayBrands(fragrances); // Display brands
            displayAll(filteredFragrances); // Display all fragrances
            setupPagination(filteredFragrances);
        })
        .catch(error => console.error('Error fetching fragrances:', error));
}




function getCookie(name) {
    const cookieArr = document.cookie.split(";");

    for (let i = 0; i < cookieArr.length; i++) {
        let cookie = cookieArr[i].trim();

        // Check if the cookie starts with the specified name
        if (cookie.startsWith(`${name}=`)) {
            console.log(`Cookie found: ${cookie}`); // Debug log to check the cookie value
            return cookie.substring(name.length + 1); // Extract and return the cookie value
        }
    }

    console.log('Cookie not found');
    return null; // Return null if not found
}

function showCustomAlert(message) {
    const alertPopup = document.getElementById('custom-alert');
    alertPopup.querySelector('p').textContent = message;

    // Show the alert with smooth fade-in
    alertPopup.classList.add('show');
    alertPopup.style.display = 'block';

    // Automatically hide the alert after 2 seconds
    setTimeout(() => {
      alertPopup.classList.remove('show'); // Fade-out
      setTimeout(() => {
        alertPopup.style.display = 'none'; // Fully hide after fade-out
      }, 500); // Wait for fade-out transition (0.5s)
    }, 2000); // Show for 2 seconds
}




function displayAll(fragrances) {
    const insertLocations = document.querySelectorAll('.index-Fragrance-carousel');

    insertLocations.forEach(location => {
        location.innerHTML = ''; // Clear previous content

        const paginatedFragrances = fragrances.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage); // Fragrances for current page

        paginatedFragrances.forEach(fragrance => {
            const fragranceCard = document.createElement('div');
            fragranceCard.classList.add('card');

            fragranceCard.innerHTML = `
                <div class="cardimg" style="background-image: url(${fragrance.image});"></div>
                <div class="card-info">
                    <span>${fragrance.brand} – ${fragrance.title}</span>
                   <span class="currentprice"><span class="pricebefore">ფასი - </span>${fragrance.price} ₾</span>
                  <div class="card-bnts">
                        <button class="addcartbnt" data-fragrance-id="${fragrance.id}">
                            <span class="addcartbnt-span addcartbntface"><a href="https://m.me/effectline.georgia/" target="_blank">დაგვიკავშირდი  -  <i class="fa-brands fa-facebook-f"></i></a></span> 
                           
                        </button>
                        <button class="addcartbnt" data-fragrance-id="${fragrance.id}">
                            <span class="addcartbnt-span addcartbntinsta"><a href="https://ig.me/m/online.effect" target="_black">დაგვიკავშირდი -  <i class="fa-brands fa-instagram"> </i></a></span> 
                          
                        </button>
                    </div>
                </div>
            `;
            location.appendChild(fragranceCard);
        });
    });

    setupPagination(fragrances); // Setup pagination

  
}





// Display brands
// Display brands
function displayBrands(fragrances) {
    // Select all insert locations where cards will be inserted (targeting brands-back-info)
    const insertLocations = document.querySelectorAll('.brands-back-info');
    const uniqueBrands = [...new Set(fragrances.map(fragrance => fragrance.brand))]; // Get unique brands

    const initialLimit = 5; // Number of brands to show initially
    let isShowingAll = false; // State to track if all brands are visible

    insertLocations.forEach(location => {
        const toggleButton = document.createElement('button');
        toggleButton.id = 'toggle-brands-btn';
        toggleButton.style = `
            margin-top: 10px; 
            padding: 10px; 
            font-size: 14px; 
            cursor: pointer; 
            background-color: #d4af37; /* Brighter gold on hover */
            transform: scale(1.05);
            box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
            color:white;
            border: none; 
            border-radius: 6px;
        `;
        toggleButton.textContent = 'მეტის ნახვა';

        // Function to render brands
        const renderBrands = () => {
            location.innerHTML = ''; // Clear the previous content

            const brandsToShow = isShowingAll ? uniqueBrands : uniqueBrands.slice(0, initialLimit);

            brandsToShow.forEach(brand => {
                const brandCard = document.createElement('div');
                brandCard.classList.add('brand-card'); // Create a class for the brand card

                brandCard.innerHTML = `
                    <span>${brand}</span> <!-- Display brand information -->
                `;

                // Add a click event to display fragrances by the selected brand
                brandCard.addEventListener('click', () => {
                    console.log(`${brand} clicked`);
                    displayFragrancesByBrand(brand); // Call function to display fragrances for the clicked brand
                });

                // Append the card to the current location
                location.appendChild(brandCard);
            });

            // Append the toggle button
            location.appendChild(toggleButton);
        };

        // Initial render
        renderBrands();

        // Toggle button click event
        toggleButton.addEventListener('click', () => {
            isShowingAll = !isShowingAll;
            toggleButton.textContent = isShowingAll ? 'ნაკლების ნახვა' : 'მეტის ნახვა';
            renderBrands();
        });
    });
}


// Setup pagination
function setupPagination(fragrances) {
    const paginationContainer = document.querySelector('.pagination'); // Adjust selector as needed
    paginationContainer.innerHTML = ''; // Clear previous pagination

    const totalPages = Math.ceil(fragrances.length / itemsPerPage); // Calculate total pages
    const maxVisiblePages = 4; // Maximum number of page buttons to show
    let startPage, endPage;

    if (totalPages <= maxVisiblePages) {
        startPage = 1; 
        endPage = totalPages; // Show all pages if they are less than or equal to maxVisiblePages
    } else {
        startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

        // Adjust startPage if endPage is less than maxVisiblePages
        if (endPage - startPage < maxVisiblePages - 1) {
            startPage = Math.max(1, endPage - (maxVisiblePages - 1));
        }
    }

    // Create pagination controls
    if (totalPages > 1) {
        const prevButton = document.createElement('button');
        prevButton.innerText = '<<'; // Add previous button
        prevButton.classList.add('pagination-btn');
        prevButton.disabled = currentPage === 1; // Disable if on the first page
        prevButton.addEventListener('click', () => changePage(currentPage - 1));
        paginationContainer.appendChild(prevButton);

        // Loop through the visible page buttons
        for (let i = startPage; i <= endPage; i++) {
            const pageButton = document.createElement('button');
            pageButton.innerText = i;
            pageButton.classList.add('pagination-btn', i === currentPage ? 'active' : 'inactive');
            pageButton.addEventListener('click', () => changePage(i));
            paginationContainer.appendChild(pageButton);
        }

        const nextButton = document.createElement('button');
        nextButton.innerText = '>>'; // Add next button
        nextButton.classList.add('pagination-btn');
        nextButton.disabled = currentPage === totalPages; // Disable if on the last page
        nextButton.addEventListener('click', () => changePage(currentPage + 1));
        paginationContainer.appendChild(nextButton);
    }
}


// Change current page
function changePage(page) {
    const totalPages = Math.ceil(filteredFragrances.length / itemsPerPage);
    if (page < 1 || page > totalPages) return; // Prevent out of bounds
    currentPage = page; // Update current page
    displayAll(filteredFragrances); // Display fragrances for the current page
    window.scrollTo(0, 0); // Scroll to the top
}

// Display fragrances by brand
function displayFragrancesByBrand(brand) {
    // Filter the fragrances by the selected brand
    const filteredByBrand = allFragrances.filter(fragrance => fragrance.brand === brand);
    currentPage = 1; // Reset to first page
    displayAll(filteredByBrand); // Display fragrances for the selected brand
}

// Gender filter functionality
document.getElementById('maleBtn').addEventListener('click', () => {
    fetch('fragrances/getMaleFragrances')
        .then(response => response.json())
        .then(data => applyFilter(data))
        .catch(error => console.error('Error fetching male fragrances:', error));
});

document.getElementById('femaleBtn').addEventListener('click', () => {
    fetch('fragrances/getFemaleFragrances')
        .then(response => response.json())
        .then(data => applyFilter(data))
        .catch(error => console.error('Error fetching female fragrances:', error));
});

document.getElementById('unisexBtn').addEventListener('click', () => {
    fetch('fragrances/getUnisexFragrances')
        .then(response => response.json())
        .then(data => applyFilter(data))
        .catch(error => console.error('Error fetching unisex fragrances:', error));
});

// Apply filter and update display
function applyFilter(filtered) {
    filteredFragrances = filtered; // Update filtered fragrances
    currentPage = 1; // Reset to first page
    displayAll(filteredFragrances); // Display filtered fragrances
}

// Filter by price
document.querySelector('.green-bnt').addEventListener('click', () => {
    const selectedPrice = parseInt(priceSlider.value, 12);
    filteredFragrances = allFragrances.filter(fragrance => fragrance.price <= selectedPrice);
    currentPage = 1; // Reset to first page
    displayAll(filteredFragrances); // Display filtered fragrances
});

// Reset filters
document.querySelector('.red-bnt').addEventListener('click', () => {
    priceSlider.value = 90; // Reset to default value (adjust as needed)
    currentPrice.textContent = "90 ₾"; // Reset display
    filteredFragrances = allFragrances; // Reset to all fragrances
    currentPage = 1; // Reset to first page
    displayAll(allFragrances); // Display all fragrances
});

// Fetch maximum price for slider
fetch('fragrances/getMaxPrice')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const maxPrice = data[0].max_price; // Extract max price from response
        const slider = document.getElementById('price-slider');
        slider.max = maxPrice; // Set the max attribute to the fetched value
    })
    .catch(error => console.error('Error fetching max price:', error));




    document.getElementById('sortAscBtn').addEventListener('click', () => {
        fetch('/fragrances/sortByPricesAsc')
            .then(response => response.json())
            .then(data => {
                applySort(data); // Apply sorting and display sorted fragrances
            })
            .catch(error => console.error('Error sorting by prices (ascending):', error));
    });
    
    document.getElementById('sortDescBtn').addEventListener('click', () => {
        fetch('/fragrances/sortByPricesDesc')
            .then(response => response.json())
            .then(data => {
                applySort(data); // Apply sorting and display sorted fragrances
            })
            .catch(error => console.error('Error sorting by prices (descending):', error));
    });
    
    // Function to apply the sorting results to the display
    function applySort(sortedFragrances) {
        currentPage = 1; // Reset to the first page
        filteredFragrances = sortedFragrances; // Set filteredFragrances to the sorted results
        displayAll(filteredFragrances); // Display the sorted fragrances
    }
    

    const searchIcon = document.querySelector(".search-icon");
    const searchInput = document.querySelector(".search-bar");
    
    // Function to handle search logic
    function handleSearch() {
        const searchText = searchInput.value.trim().toLowerCase();
    
        // Reset to the first page for new search results
        currentPage = 1;
    
        if (searchText === "") {
            filteredFragrances = allFragrances; // If search is empty, show all fragrances
        } else {
            // Filter fragrances based on the search input
            filteredFragrances = allFragrances.filter(fragrance =>
                fragrance.title.toLowerCase().includes(searchText)
            );
        }
    
        // Check if there are any filtered fragrances
        if (filteredFragrances.length > 0) {
            displayAll(filteredFragrances); // Display matching fragrances
            setupPagination(filteredFragrances); // Update the pagination for the filtered results
        } else {
            displayNoResultsMessage(); // Display message if no match is found
            const paginationContainer = document.querySelector('.pagination');
            paginationContainer.innerHTML = ''; // Clear pagination if no results
        }
    
        // Clear the input field after search
        searchInput.value = "";
    }
    
    // Event listener for clicking the search icon
    searchIcon.addEventListener("click", handleSearch);
    
    // Event listener for pressing "Enter" in the search input field
    searchInput.addEventListener("keyup", (event) => {
        if (event.key === "Enter") { // If the Enter key is pressed
            handleSearch(); // Trigger the search
        }
    });
    
    // Function to display "no results" message
    function displayNoResultsMessage() {
        const insertLocations = document.querySelectorAll('.index-Fragrance-carousel');
    
        insertLocations.forEach(location => {
            location.innerHTML = `
                <div class="no-results-message">
                    ვერ მოიძებნა ასეთი სუნამო
                </div>
            `;
        });
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
        const sliderContainer = document.querySelector('.slider-container-footer');
    
        // Clear existing content in case this is called multiple times
        sliderContainer.innerHTML = '';
    
        // Create and append slider items for all fragrances
        fragrances.forEach(fragrance => {
            const sliderItem = document.createElement('div');
            sliderItem.classList.add('slider-item-footer');
    
            const img = document.createElement('img');
            img.src = fragrance.image; // Assuming `image` is the property containing the image URL
            img.alt = fragrance.title || 'Fragrance'; // Use `title` or a default value
    
            sliderItem.appendChild(img);
            sliderContainer.appendChild(sliderItem);
        });
    }