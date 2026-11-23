// app.js – Core logic

// Load wishlist from localStorage
let wishlist = JSON.parse(localStorage.getItem('bookstore_wishlist')) || [];

function saveWishlist() {
  localStorage.setItem('bookstore_wishlist', JSON.stringify(wishlist));
  updateWishlistCount();
}

function updateWishlistCount() {
  const badge = document.getElementById('wishlist-count');
  if (badge) badge.textContent = wishlist.length;
}

function isWishlisted(id) {
  return wishlist.some(b => b.id === id);
}

function toggleWishlist(id) {
  const book = books.find(b => b.id === id);
  if (!book) return;
  if (isWishlisted(id)) {
    wishlist = wishlist.filter(b => b.id !== id);
  } else {
    wishlist.push(book);
  }
  saveWishlist();
  renderGrid(getCurrentBooks());
}

function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  let stars = '';
  for (let i = 0; i < full; i++) stars += '★';
  if (half) stars += '½';
  return `<span class="stars">${stars}</span> <span class="rating-num">${rating}</span>`;
}

function createCard(book, showUnlike = false) {
  const wished = isWishlisted(book.id);
  return `
    <div class="book-card" data-id="${book.id}">
      <div class="card-cover">
        <img src="${book.cover}" alt="${book.title}" onerror="this.src='https://via.placeholder.com/160x220/c8a87a/3a2a1a?text=📚'"/>
      </div>
      <div class="card-body">
        <h3 class="book-title">${book.title}</h3>
        <p class="book-author">by ${book.author}</p>
        <div class="book-meta">
          <span class="tag theme-tag">📖 ${book.theme}</span>
          <span class="tag age-tag">👤 Age ${book.age}</span>
        </div>
        <div class="book-rating">${renderStars(book.rating)}</div>
        <div class="book-price">${book.price}</div>
        <div class="card-actions">
          <a href="${book.amazon}" target="_blank" class="btn btn-amazon">🛒 Amazon</a>
          <a href="${book.flipkart}" target="_blank" class="btn btn-flipkart">🛍️ Flipkart</a>
        </div>
        ${showUnlike
          ? `<button class="wishlist-btn unlike" onclick="removeFromWishlist(${book.id})">💔 Remove</button>`
          : `<button class="wishlist-btn ${wished ? 'wished' : ''}" onclick="toggleWishlist(${book.id})">
              ${wished ? '❤️ Wishlisted' : '🤍 Add to Wishlist'}
            </button>`
        }
      </div>
    </div>
  `;
}

function getCurrentBooks() {
  return books;
}

function renderGrid(bookList) {
  const grid = document.getElementById('booksGrid');
  const noResults = document.getElementById('noResults');
  if (!grid) return;

  if (bookList.length === 0) {
    grid.innerHTML = '';
    if (noResults) noResults.style.display = 'block';
    return;
  }
  if (noResults) noResults.style.display = 'none';
  grid.innerHTML = bookList.map(b => createCard(b)).join('');
}

function filterBooks() {
  const query = document.getElementById('searchInput').value.toLowerCase().trim();
  if (!query) {
    renderGrid(books);
    return;
  }
  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(query) ||
    b.theme.toLowerCase().includes(query) ||
    b.age.toLowerCase().includes(query) ||
    b.author.toLowerCase().includes(query)
  );
  renderGrid(filtered);
}

// Wishlist page functions
function renderWishlistPage() {
  const grid = document.getElementById('wishlistGrid');
  const empty = document.getElementById('emptyWishlist');
  if (!grid) return;

  if (wishlist.length === 0) {
    grid.innerHTML = '';
    if (empty) empty.style.display = 'block';
    return;
  }
  if (empty) empty.style.display = 'none';
  grid.innerHTML = wishlist.map(b => createCard(b, true)).join('');
}

function removeFromWishlist(id) {
  wishlist = wishlist.filter(b => b.id !== id);
  saveWishlist();
  renderWishlistPage();
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  updateWishlistCount();
  if (document.getElementById('booksGrid')) renderGrid(books);
  if (document.getElementById('wishlistGrid')) renderWishlistPage();
});
