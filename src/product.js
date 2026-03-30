const API_BASE_URL = "https://fakestoreapi.com/products";
let allProducts = [];
let filteredProducts = [];
let currentProductIndex = 0;
let currentPage = 1;
const productsPerPage = 6;

const productGrid = document.getElementById("productGrid");
const productImage = document.getElementById("productImage");
const productTitle = document.getElementById("productTitle");
const productOwner = document.getElementById("productOwner");
const productPrice = document.getElementById("productPrice");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const categoryFilter = document.getElementById("categoryFilter");
const priceFilter = document.getElementById("priceFilter");
const searchInput = document.getElementById("searchInput");
const clearFiltersBtn = document.getElementById("clearFilters");
const prevPageBtn = document.getElementById("prevPage");
const nextPageBtn = document.getElementById("nextPage");
const pageInfo = document.getElementById("pageInfo");
const addToCartBtn = document.getElementById("addToCart");

const loadingElement = `
    <div class="loading">
        <div class="spinner"></div>
        <p>Loading fresh products...</p>
    </div>
`;

document.addEventListener("DOMContentLoaded", function () {
  showLoading();
  fetchProducts();
  setupEventListeners();
});

async function fetchProducts() {
  try {
    const response = await fetch(API_BASE_URL + `?limit=20`);
    allProducts = await response.json();

    allProducts = allProducts.map((product) => ({
      id: product.id,
      title:
        product.title.substring(0, 50) +
        (product.title.length > 50 ? "..." : ""),
      owner: product.brand || "Marketplace Seller",
      price: Math.round(product.price * 80),
      category: product.category,
      image: product.image,
      description: product.description,
      rating: product.rating?.rate || 4.5,
      views: Math.floor(Math.random() * 5000) + 100,
    }));

    filteredProducts = [...allProducts];
    hideLoading();
    displayProducts();
    showCurrentProduct();
  } catch (error) {
    console.error("Error fetching products:", error);
    hideLoading();
    showError("Failed to load products. Please refresh the page.");
  }
}

function showLoading() {
  productGrid.innerHTML = loadingElement;
}

function hideLoading() {
  const loadingElement = document.querySelector(".loading");
  if (loadingElement) {
    loadingElement.remove();
  }
}


function showError(message) {
  productGrid.innerHTML = `
        <div class="error-message">
            <i class="fas fa-exclamation-triangle"></i>
            <p>${message}</p>
            <button onclick="location.reload()" class="btn-primary">Retry</button>
        </div>
    `;
}

function setupEventListeners() {
    prevBtn.addEventListener('click', showPreviousProduct);
    nextBtn.addEventListener('click', showNextProduct);
    categoryFilter.addEventListener('change', filterProducts);
    priceFilter.addEventListener('change', filterProducts);
    searchInput.addEventListener('input', debounce(filterProducts, 300));
    clearFiltersBtn.addEventListener('click', clearFilters);
    prevPageBtn.addEventListener('click', previousPage);
    nextPageBtn.addEventListener('click', nextPage);
    addToCartBtn.addEventListener('click', addToCart);

        document.querySelector('.header').innerHTML += `
        <button id="refreshBtn" class="refresh-btn" title="Load Fresh Products">
            <i class="fas fa-sync-alt"></i>
        </button>
    `;
    document.getElementById('refreshBtn').addEventListener('click', refreshProducts);
}

