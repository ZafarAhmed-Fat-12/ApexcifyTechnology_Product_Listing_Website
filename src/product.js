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
  prevBtn.addEventListener("click", showPreviousProduct);
  nextBtn.addEventListener("click", showNextProduct);
  categoryFilter.addEventListener("change", filterProducts);
  priceFilter.addEventListener("change", filterProducts);
  searchInput.addEventListener("input", debounce(filterProducts, 300));
  clearFiltersBtn.addEventListener("click", clearFilters);
  prevPageBtn.addEventListener("click", previousPage);
  nextPageBtn.addEventListener("click", nextPage);
  addToCartBtn.addEventListener("click", addToCart);

  document.querySelector(".header").innerHTML += `
        <button id="refreshBtn" class="refresh-btn" title="Load Fresh Products">
            <i class="fas fa-sync-alt"></i>
        </button>
    `;
  document
    .getElementById("refreshBtn")
    .addEventListener("click", refreshProducts);
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

async function refreshProducts() {
  showLoading();
  await fetchProducts();
}

function filterProducts() {
  const category = categoryFilter.value;
  const priceRange = priceFilter.value;
  const searchTerm = searchInput.value.toLowerCase();

  filteredProducts = allProducts.filter((product) => {
    const matchesCategory = category === "all" || product.category === category;

    let matchesPrice = true;
    if (priceRange !== "all") {
      const price = product.price;
      if (priceRange === "0-50") matchesPrice = price <= 50;
      else if (priceRange === "50-100")
        matchesPrice = price > 50 && price <= 100;
      else if (priceRange === "100+") matchesPrice = price > 100;
    }

    const matchesSearch =
      !searchTerm ||
      product.title.toLowerCase().includes(searchTerm) ||
      product.owner.toLowerCase().includes(searchTerm);

    return matchesCategory && matchesPrice && matchesSearch;
  });

  currentPage = 1;
  currentProductIndex = 0;
  displayProducts();
  showCurrentProduct();
}

function clearFilters() {
  categoryFilter.value = "all";
  priceFilter.value = "all";
  searchInput.value = "";
  filterProducts();
}


function displayProducts() {
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const pageProducts = filteredProducts.slice(startIndex, endIndex);
    
    productGrid.innerHTML = '';
    
    if (pageProducts.length === 0) {
        productGrid.innerHTML = `
            <div class="no-products">
                <i class="fas fa-search"></i>
                <h3>No products found</h3>
                <p>Try adjusting your filters</p>
            </div>
        `;
        return;
    }
    
    pageProducts.forEach((product, index) => {
        const globalIndex = filteredProducts.indexOf(product);
        const card = createProductCard(product, globalIndex);
        productGrid.appendChild(card);
    });
    
    updatePagination();
}