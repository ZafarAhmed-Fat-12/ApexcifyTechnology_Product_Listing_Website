const API_URL =
  "https://dummyjson.com/products?limit=30&skip=0&select=title,description,price,thumbnail,category,brand,rating";

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
    <div class="loading" style="grid-column: 1/-1; text-align: center; padding: 60px;">
        <div class="spinner" style="margin: 0 auto 20px;"></div>
        <p>Loading fresh products from DummyJSON...</p>
    </div>
`;

document.addEventListener("DOMContentLoaded", function () {
  fetchProducts();
  setupEventListeners();
});

async function fetchProducts() {
  try {
    productGrid.innerHTML = loadingElement;

    const response = await fetch(API_URL);
    const data = await response.json();

    allProducts = data.products
      .map((product) => ({
        id: product.id,
        title:
          product.title.length > 50
            ? product.title.substring(0, 50) + "..."
            : product.title,
        owner: product.brand || "Dummy Store",
        price: Math.round(product.price * 80),
        category: product.category.toLowerCase(),
        image: product.thumbnail.replace("http://", "https://"),
        description: product.description,
        rating: product.rating || 4.5,
        views: Math.floor(Math.random() * 5000) + 100,
      }))
      .slice(0, 25);
    filteredProducts = [...allProducts];
    populateCategoryFilter();
    displayProducts();
    showCurrentProduct();
  } catch (error) {
    console.error("API Error:", error);
    loadDemoData();
  }
}

function populateCategoryFilter() {
  const categories = ["all", ...new Set(allProducts.map((p) => p.category))];
  categoryFilter.innerHTML = "";
  categories.forEach((cat) => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent =
      cat.charAt(0).toUpperCase() + cat.slice(1).replace(/([A-Z])/g, " $1");
    categoryFilter.appendChild(option);
  });
}

function loadDemoData() {
  allProducts = [
    {
      id: 1,
      title: "iPhone 15 Pro Max",
      owner: "Apple",
      price: 95000,
      category: "smartphones",
      image: "https://i.dummyjson.com/400/prods/1/thumbs/1.jpg",
      rating: 4.9,
      views: 1234,
    },
    {
      id: 2,
      title: "Nike Air Jordan",
      owner: "Nike",
      price: 8500,
      category: "men clothing",
      image: "https://i.dummyjson.com/400/prods/2/thumbs/2.jpg",
      rating: 4.6,
      views: 856,
    },
    {
      id: 3,
      title: "MacBook Pro M3",
      owner: "Apple",
      price: 165000,
      category: "laptops",
      image: "https://i.dummyjson.com/400/prods/3/thumbs/3.jpg",
      rating: 4.9,
      views: 2345,
    },
    {
      id: 4,
      title: "Summer Dress",
      owner: "Zara",
      price: 2800,
      category: "women clothing",
      image: "https://i.dummyjson.com/400/prods/4/thumbs/4.jpg",
      rating: 4.3,
      views: 456,
    },
    {
      id: 5,
      title: "Clean Code Book",
      owner: "OReilly",
      price: 1200,
      category: "books",
      image: "https://i.dummyjson.com/400/prods/5/thumbs/5.jpg",
      rating: 4.8,
      views: 789,
    },
    {
      id: 6,
      title: "Perfume Spray",
      owner: "Chanel",
      price: 4500,
      category: "fragrances",
      image: "https://i.dummyjson.com/400/prods/6/thumbs/6.jpg",
      rating: 4.4,
      views: 345,
    },
  ];
  filteredProducts = [...allProducts];
  populateCategoryFilter();
  displayProducts();
  showCurrentProduct();
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

  document
    .querySelector(".header")
    .insertAdjacentHTML(
      "beforeend",
      '<button id="refreshBtn" class="refresh-btn" title="Refresh Products"><i class="fas fa-sync-alt"></i></button>',
    );
  document
    .getElementById("refreshBtn")
    .addEventListener("click", fetchProducts);
}

function debounce(func, wait) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

function filterProducts() {
  const category = categoryFilter.value.toLowerCase();
  const priceRange = priceFilter.value;
  const searchTerm = searchInput.value.toLowerCase().trim();

  filteredProducts = allProducts.filter((product) => {
    const matchesCategory =
      category === "all" || product.category.toLowerCase().includes(category);

    let matchesPrice = true;
    const price = product.price;
    switch (priceRange) {
      case "0-50":
        matchesPrice = price <= 4000;
        break;
      case "50-100":
        matchesPrice = price > 4000 && price <= 8000;
        break;
      case "100+":
        matchesPrice = price > 8000;
        break;
    }

    const matchesSearch =
      !searchTerm ||
      product.title.toLowerCase().includes(searchTerm) ||
      product.owner.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm);

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

  productGrid.innerHTML = "";

  if (pageProducts.length === 0) {
    productGrid.innerHTML = `
            <div class="no-products" style="grid-column: 1/-1; text-align: center; padding: 60px; color: #7f8c8d;">
                <i class="fas fa-search" style="font-size: 4rem; color: #95a5a6; margin-bottom: 20px;"></i>
                <h3>No products found</h3>
                <p>Try adjusting your filters or search</p>
            </div>
        `;
    updatePagination();
    return;
  }

  pageProducts.forEach((product, index) => {
    const globalIndex = filteredProducts.indexOf(product);
    const card = createProductCard(product, globalIndex);
    productGrid.appendChild(card);
  });

  updatePagination();
}

function createProductCard(product, index) {
  const card = document.createElement("div");
  card.className = "product-card";
  card.dataset.index = index;

  const categoryName = product.category.split(" ")[0];

  card.innerHTML = `
        <div class="category-tag">${categoryName}</div>
        <img src="${product.image}" alt="${product.title}" 
             onerror="this.src='https://via.placeholder.com/300x220/667eea/ffffff?text=${categoryName.toUpperCase()}'"
             loading="lazy">
        <div class="product-card-content">
            <h3 title="${product.title}">${product.title}</h3>
            <div class="owner"><i class="fas fa-user"></i> ${product.owner}</div>
            <div class="price">₹${product.price.toLocaleString()}</div>
            <div class="rating">
                 ${product.rating.toFixed(1)} (${product.views.toLocaleString()} views)
            </div>
        </div>
    `;

  return card;
}

function showCurrentProduct() {
  if (filteredProducts.length === 0) return;

  const product =
    filteredProducts[
      Math.min(currentProductIndex, filteredProducts.length - 1)
    ];

  productImage.src = product.image;
  productImage.alt = product.title;
  productTitle.textContent = product.title;
  productOwner.textContent = product.owner;
  productPrice.textContent = `₹${product.price.toLocaleString()}`;

  prevBtn.style.opacity = currentProductIndex > 0 ? "1" : "0.5";
  nextBtn.style.opacity =
    currentProductIndex < filteredProducts.length - 1 ? "1" : "0.5";
}

function showPreviousProduct() {
  if (currentProductIndex > 0) {
    currentProductIndex--;
    showCurrentProduct();
  }
}

function showNextProduct() {
  if (currentProductIndex < filteredProducts.length - 1) {
    currentProductIndex++;
    showCurrentProduct();
  }
}

function updatePagination() {
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  prevPageBtn.disabled = currentPage === 1;
  nextPageBtn.disabled =
    currentPage >= totalPages || filteredProducts.length === 0;
  pageInfo.textContent = `Page ${currentPage} of ${totalPages} (${filteredProducts.length} products)`;
}

function previousPage() {
  if (currentPage > 1) {
    currentPage--;
    displayProducts();
  }
}

function nextPage() {
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  if (currentPage < totalPages) {
    currentPage++;
    displayProducts();
  }
}

function addToCart() {
  const product = filteredProducts[currentProductIndex];
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  cart.push({ ...product, addedAt: new Date().toISOString() });
  localStorage.setItem("cart", JSON.stringify(cart));

  const originalText = addToCartBtn.innerHTML;
  addToCartBtn.innerHTML = '<i class="fas fa-check"></i> Added to Cart!';
  addToCartBtn.style.background = "#27ae60";

  setTimeout(() => {
    addToCartBtn.innerHTML = originalText;
    addToCartBtn.style.background = "";
  }, 2000);
}
