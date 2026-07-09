import React, { useState, useEffect } from 'react';
import './App.css';

const API_BASE_URL = 'http://localhost:5000/api';

function App() {
  // Theme state
  const [theme, setTheme] = useState('dark');

  // Filter States
  const [categories, setCategories] = useState([]);
  const [availableCategories, setAvailableCategories] = useState([
    'Electronics',
    'Apparel',
    'Footwear',
    'Fitness',
    'Accessories'
  ]);
  const [priceRange, setPriceRange] = useState([0, 400]);
  const [debouncedPriceRange, setDebouncedPriceRange] = useState([0, 400]);
  const [minRating, setMinRating] = useState(0);
  const [sortBy, setSortBy] = useState('');

  // Products and loading states
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Toggle theme
  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    document.documentElement.setAttribute('data-theme', nextTheme);
  };

  // Debounce price slider
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedPriceRange(priceRange);
    }, 200);
    return () => clearTimeout(timer);
  }, [priceRange]);

  // Fetch Categories on mount
  useEffect(() => {
    fetch(`${API_BASE_URL}/categories`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch categories');
        return res.json();
      })
      .then((data) => {
        if (data.success && data.categories.length > 0) {
          setAvailableCategories(data.categories);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch categories from server, using defaults.', err);
      });
  }, []);

  // Fetch Products based on filters
  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // Construct URL with query parameters
    const params = new URLSearchParams();
    if (categories.length > 0) {
      params.append('categories', categories.join(','));
    }
    if (debouncedPriceRange[0] > 0) {
      params.append('minPrice', debouncedPriceRange[0]);
    }
    if (debouncedPriceRange[1] < 400) {
      params.append('maxPrice', debouncedPriceRange[1]);
    }
    if (minRating > 0) {
      params.append('minRating', minRating);
    }
    if (sortBy) {
      params.append('sortBy', sortBy);
    }

    fetch(`${API_BASE_URL}/products?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch products');
        return res.json();
      })
      .then((data) => {
        if (data.success) {
          setProducts(data.products);
        } else {
          throw new Error(data.message || 'Error loading products');
        }
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setIsLoading(false);
      });
  }, [categories, debouncedPriceRange, minRating, sortBy]);

  // Category change handler
  const handleCategoryChange = (category) => {
    if (categories.includes(category)) {
      setCategories(categories.filter((c) => c !== category));
    } else {
      setCategories([...categories, category]);
    }
  };

  // Price range slider handlers
  const handleMinPriceChange = (e) => {
    const value = Math.min(Number(e.target.value), priceRange[1] - 10);
    setPriceRange([value, priceRange[1]]);
  };

  const handleMaxPriceChange = (e) => {
    const value = Math.max(Number(e.target.value), priceRange[0] + 10);
    setPriceRange([priceRange[0], value]);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setCategories([]);
    setPriceRange([0, 400]);
    setMinRating(0);
    setSortBy('');
  };

  // Helper to render stars
  const renderStars = (rating) => {
    const stars = [];
    const floor = Math.floor(rating);
    const hasHalf = rating - floor >= 0.4;
    for (let i = 1; i <= 5; i++) {
      if (i <= floor) {
        stars.push(<span key={i} className="star filled">★</span>);
      } else if (i === floor + 1 && hasHalf) {
        stars.push(<span key={i} className="star half">★</span>);
      } else {
        stars.push(<span key={i} className="star empty">☆</span>);
      }
    }
    return stars;
  };

  return (
    <div className={`app-container ${theme}-mode`}>
      {/* Header Banner */}
      <header className="app-header">
        <div className="header-content">
          <div className="brand">
            <div className="logo-icon">▲</div>
            <h1 className="main-title">ApexMarket</h1>
          </div>
          <p className="subtitle">High-Traffic Multi-Filter Catalog</p>
          <div className="header-controls">
            <button 
              id="theme-toggle-btn"
              onClick={toggleTheme} 
              className="theme-toggle"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? '☀️ Light Mode' : '🌙 Dark Mode'}
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Area */}
      <main className="catalog-layout">
        {/* Sticky Filter Sidebar */}
        <aside className="filter-sidebar" id="filter-sidebar-panel">
          <div className="sidebar-header">
            <h2>Filters</h2>
            <button 
              id="reset-filters-btn"
              onClick={handleResetFilters} 
              className="reset-btn"
            >
              Reset All
            </button>
          </div>

          {/* 1. Category Checklist Group */}
          <section className="filter-group" id="category-filter-group">
            <h3>Categories</h3>
            <div className="category-checklist">
              {availableCategories.map((category) => (
                <label key={category} className="checkbox-label" id={`label-category-${category.toLowerCase()}`}>
                  <input
                    type="checkbox"
                    id={`checkbox-category-${category.toLowerCase()}`}
                    checked={categories.includes(category)}
                    onChange={() => handleCategoryChange(category)}
                  />
                  <span className="custom-checkbox"></span>
                  <span className="category-name">{category}</span>
                </label>
              ))}
            </div>
          </section>

          {/* 2. Dual-point Price Range Slider */}
          <section className="filter-group" id="price-filter-group">
            <h3>Price Range</h3>
            <div className="price-inputs">
              <div className="price-box">
                <span className="currency">$</span>
                <input
                  type="number"
                  id="min-price-number-input"
                  value={priceRange[0]}
                  min="0"
                  max="400"
                  onChange={(e) => setPriceRange([Math.min(Number(e.target.value), priceRange[1] - 10), priceRange[1]])}
                />
              </div>
              <span className="price-separator">to</span>
              <div className="price-box">
                <span className="currency">$</span>
                <input
                  type="number"
                  id="max-price-number-input"
                  value={priceRange[1]}
                  min="0"
                  max="400"
                  onChange={(e) => setPriceRange([priceRange[0], Math.max(Number(e.target.value), priceRange[0] + 10)])}
                />
              </div>
            </div>

            <div className="dual-slider-container">
              <div className="slider-track" style={{
                background: `linear-gradient(to right, 
                  var(--track-bg) ${(priceRange[0] / 400) * 100}%, 
                  var(--accent-glow) ${(priceRange[0] / 400) * 100}%, 
                  var(--accent-glow) ${(priceRange[1] / 400) * 100}%, 
                  var(--track-bg) ${(priceRange[1] / 400) * 100}%)`
              }}></div>
              <input
                type="range"
                id="min-price-slider"
                min="0"
                max="400"
                value={priceRange[0]}
                onChange={handleMinPriceChange}
                className="thumb min-thumb"
              />
              <input
                type="range"
                id="max-price-slider"
                min="0"
                max="400"
                value={priceRange[1]}
                onChange={handleMaxPriceChange}
                className="thumb max-thumb"
              />
            </div>
          </section>

          {/* 3. Minimum Star Rating Set of Radio Buttons */}
          <section className="filter-group" id="rating-filter-group">
            <h3>Minimum Rating</h3>
            <div className="rating-radio-group">
              <label className="radio-label" id="rating-all-label">
                <input
                  type="radio"
                  id="radio-rating-all"
                  name="min-rating"
                  checked={minRating === 0}
                  onChange={() => setMinRating(0)}
                />
                <span className="custom-radio"></span>
                <span>All Ratings</span>
              </label>

              {[5, 4, 3, 2, 1].map((ratingVal) => (
                <label key={ratingVal} className="radio-label" id={`rating-${ratingVal}-label`}>
                  <input
                    type="radio"
                    id={`radio-rating-${ratingVal}`}
                    name="min-rating"
                    checked={minRating === ratingVal}
                    onChange={() => setMinRating(ratingVal)}
                  />
                  <span className="custom-radio"></span>
                  <span className="stars-wrapper">{renderStars(ratingVal)}</span>
                  <span className="rating-text">{ratingVal === 5 ? '5.0 Stars' : '& Up'}</span>
                </label>
              ))}
            </div>
          </section>
        </aside>

        {/* Dynamic Product Catalog Section */}
        <section className="catalog-content">
          {/* Subheader: Results count & Sort */}
          <div className="catalog-subheader">
            <p className="results-count">
              {isLoading ? 'Searching catalog...' : `${products.length} Products Found`}
            </p>
            
            <div className="sort-container">
              <label htmlFor="sort-select" className="sort-label">Sort By:</label>
              <select
                id="sort-select"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="sort-dropdown"
              >
                <option value="">Default (Featured)</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Top Rated First</option>
              </select>
            </div>
          </div>

          {/* Skeletons/Loading State */}
          {isLoading ? (
            <div className="products-grid loading-grid" id="loading-skeletons">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="product-card skeleton-card">
                  <div className="skeleton-image"></div>
                  <div className="skeleton-title"></div>
                  <div className="skeleton-meta"></div>
                  <div className="skeleton-price"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="error-screen">
              <p className="error-message">⚠️ Error loading products: {error}</p>
              <button onClick={handleResetFilters} className="primary-action-btn">Try Resetting Filters</button>
            </div>
          ) : products.length === 0 ? (
            /* Empty State Screen */
            <div className="empty-screen" id="empty-state-screen">
              <div className="empty-icon">🔍</div>
              <h2>No Items Match Your Criteria</h2>
              <p>Try expanding your price range, choosing different categories, or lowering the rating threshold.</p>
              <button 
                id="empty-reset-btn"
                onClick={handleResetFilters} 
                className="primary-action-btn"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            /* Dynamic Product Inventory Grid */
            <div className="products-grid" id="product-inventory-grid">
              {products.map((product) => (
                <article key={product._id || product.name} className="product-card" id={`product-${(product._id || product.name).replace(/\s+/g, '-').toLowerCase()}`}>
                  <div className="product-image-container">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="product-thumbnail"
                    />
                    <span className="category-badge">{product.category}</span>
                  </div>
                  <div className="product-details">
                    <h4 className="product-name">{product.name}</h4>
                    <p className="product-description">{product.description}</p>
                    <div className="product-meta">
                      <div className="stars" aria-label={`Rating: ${product.rating} stars`}>
                        {renderStars(product.rating)}
                        <span className="rating-number">{product.rating}</span>
                      </div>
                      <span className="product-price">${product.price.toFixed(2)}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>© 2026 ApexMarket. Engineered for high performance & responsive state feedback.</p>
      </footer>
    </div>
  );
}

export default App;
