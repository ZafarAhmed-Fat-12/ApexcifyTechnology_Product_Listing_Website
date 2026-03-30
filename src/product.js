const productGrid = document.getElementById('productGrid');
const productImage = document.getElementById('productImage');
const productTitle = document.getElementById('productTitle');
const productOwner = document.getElementById('productOwner');
const productPrice = document.getElementById('productPrice');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const categoryFilter = document.getElementById('categoryFilter');
const priceFilter = document.getElementById('priceFilter');
const searchInput = document.getElementById('searchInput');
const clearFiltersBtn = document.getElementById('clearFilters');
const prevPageBtn = document.getElementById('prevPage');
const nextPageBtn = document.getElementById('nextPage');
const pageInfo = document.getElementById('pageInfo');
const addToCartBtn = document.getElementById('addToCart');


const loadingElement = `
    <div class="loading">
        <div class="spinner"></div>
        <p>Loading fresh products...</p>
    </div>
`;
