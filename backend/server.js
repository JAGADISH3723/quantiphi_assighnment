const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Resilient MongoDB Connection
let isMongoConnected = false;

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connected successfully.');
    isMongoConnected = true;
    seedDatabase();
  })
  .catch(err => {
    console.warn('MongoDB connection failed. Falling back to In-Memory Product Database.', err.message);
  });

// Product Schema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  rating: { type: Number, required: true },
  image: { type: String, required: true },
  description: { type: String }
});

const Product = mongoose.model('Product', productSchema);

// Master Product Catalog (Mock Data & Fallback Array)
const masterProducts = [
  {
    name: "AeroPulse Wireless Headphones",
    category: "Electronics",
    price: 129.99,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
    description: "Premium active noise-cancelling wireless headphones with 40-hour battery life."
  },
  {
    name: "Classic Leather Minimalist Watch",
    category: "Accessories",
    price: 89.50,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop&q=60",
    description: "Sleek, minimalist design featuring a genuine leather strap and Japanese quartz movement."
  },
  {
    name: "Apex Run Knit Trainers",
    category: "Footwear",
    price: 110.00,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60",
    description: "Lightweight, breathable knit upper with high-rebound cushioning for daily runs."
  },
  {
    name: "Summit Waterproof Trail Jacket",
    category: "Apparel",
    price: 145.00,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=500&auto=format&fit=crop&q=60",
    description: "Windproof and waterproof shell engineered for high-altitude trekking and storms."
  },
  {
    name: "Zenith Mechanical Keyboard",
    category: "Electronics",
    price: 159.00,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500&auto=format&fit=crop&q=60",
    description: "Compact 75% hot-swappable mechanical keyboard with custom linear switches."
  },
  {
    name: "Nomad Canvas Travel Backpack",
    category: "Accessories",
    price: 75.00,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60",
    description: "Durable water-resistant canvas pack with dedicated 15-inch laptop compartment."
  },
  {
    name: "VaporFly Lightweight Runners",
    category: "Footwear",
    price: 180.00,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=500&auto=format&fit=crop&q=60",
    description: "Carbon fiber plate running shoes designed to break personal speed records."
  },
  {
    name: "Merino Wool Everyday Hoodie",
    category: "Apparel",
    price: 95.00,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&auto=format&fit=crop&q=60",
    description: "Ultra-soft, odor-resistant merino wool blend perfect for layering."
  },
  {
    name: "SmartGrip Anti-Slip Yoga Mat",
    category: "Fitness",
    price: 55.00,
    rating: 4.1,
    image: "https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500&auto=format&fit=crop&q=60",
    description: "Eco-friendly natural rubber mat with alignments guides and non-slip texture."
  },
  {
    name: "ErgoDesk Height Adjustable Table",
    category: "Electronics",
    price: 349.99,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1595515106969-1ce29566ff1c?w=500&auto=format&fit=crop&q=60",
    description: "Electric dual-motor standing desk with customizable height presets."
  },
  {
    name: "Steel Core Adjustable Dumbbells",
    category: "Fitness",
    price: 249.00,
    rating: 4.5,
    image: "https://images.unsplash.com/photo-1638536532686-d610adfc8e5c?w=500&auto=format&fit=crop&q=60",
    description: "Space-saving adjustable weights ranging from 5 to 52.5 lbs per dumbbell."
  },
  {
    name: "Polaris Polarized Sunglasses",
    category: "Accessories",
    price: 49.99,
    rating: 4.0,
    image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&auto=format&fit=crop&q=60",
    description: "UV400 protection polarized sunglasses with lightweight polycarbonate frame."
  },
  {
    name: "Luxe Comfort Lounge Pants",
    category: "Apparel",
    price: 60.00,
    rating: 3.8,
    image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=60",
    description: "Premium French terry lounge pants optimized for leisure and remote work."
  },
  {
    name: "Quantum Soundbar System",
    category: "Electronics",
    price: 220.00,
    rating: 4.4,
    image: "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&auto=format&fit=crop&q=60",
    description: "5.1 channel immersive audio soundbar with wireless subwoofer and Dolby Atmos."
  },
  {
    name: "Volt Charge 100W Wall Charger",
    category: "Electronics",
    price: 39.99,
    rating: 4.6,
    image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=500&auto=format&fit=crop&q=60",
    description: "Compact 4-port GaN fast charger compatible with laptops, tablets, and phones."
  },
  {
    name: "All-Weather Leather Boots",
    category: "Footwear",
    price: 165.00,
    rating: 4.3,
    image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=500&auto=format&fit=crop&q=60",
    description: "Waterproof full-grain leather boots built with a rugged Vibram traction outsole."
  },
  {
    name: "HydroShield Insulated Flask",
    category: "Accessories",
    price: 32.50,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&auto=format&fit=crop&q=60",
    description: "Double-walled vacuum insulated stainless steel water bottle keeping drinks cold for 24h."
  },
  {
    name: "BreezeFit Running Tee",
    category: "Apparel",
    price: 35.00,
    rating: 3.9,
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=500&auto=format&fit=crop&q=60",
    description: "Quick-drying, moisture-wicking athletic t-shirt with flatlock anti-chafe seams."
  },
  {
    name: "SpeedRope Pro Jump Rope",
    category: "Fitness",
    price: 18.00,
    rating: 4.2,
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=60",
    description: "High-speed ball-bearing cable jump rope with non-slip aluminum alloy handles."
  },
  {
    name: "Urban Explorer Shoulder Bag",
    category: "Accessories",
    price: 45.00,
    rating: 4.1,
    image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&auto=format&fit=crop&q=60",
    description: "Sleek messenger shoulder bag for daily commutes, fitting tablets up to 11 inches."
  }
];

// Seeding function
async function seedDatabase() {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(masterProducts);
      console.log('Seeded database with initial products.');
    }
  } catch (err) {
    console.error('Error seeding database:', err.message);
  }
}

// Helper: Core Combinatorial Intersect Filtering Array Function
function filterAndSortProducts(products, criteria) {
  const { categories, minPrice, maxPrice, minRating, sortBy } = criteria;

  // 1. Graceful Null Handling: Check if all filters are unselected / cleared
  const isCategoryEmpty = !categories || categories.length === 0;
  const isPriceDefault = (minPrice === undefined || minPrice === null) && (maxPrice === undefined || maxPrice === null);
  const isRatingDefault = !minRating || minRating === 0;

  let filtered = products;

  if (!isCategoryEmpty || !isPriceDefault || !isRatingDefault) {
    // 2. Combinatorial Intersect Filtering Loop
    filtered = products.filter(product => {
      // Category Match (Must satisfy selection if any categories are selected)
      const categoryMatch = isCategoryEmpty || categories.includes(product.category);

      // Price Boundary Match (Falls inside selected min and max bounds)
      const priceMin = minPrice !== undefined && minPrice !== null ? minPrice : 0;
      const priceMax = maxPrice !== undefined && maxPrice !== null ? maxPrice : Infinity;
      const priceMatch = product.price >= priceMin && product.price <= priceMax;

      // Rating Match (Meets or exceeds target star rating)
      const ratingMatch = isRatingDefault || product.rating >= parseFloat(minRating);

      // All filters must intersect (AND logic)
      return categoryMatch && priceMatch && ratingMatch;
    });
  }

  // 3. Sorting State Arrangement
  if (sortBy) {
    if (sortBy === 'price_asc') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price_desc') {
      filtered.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating_desc') {
      filtered.sort((a, b) => b.rating - a.rating);
    }
  }

  return filtered;
}

// API Routes
app.get('/api/products', async (req, res) => {
  try {
    // Parse filters from query params
    const categories = req.query.categories ? req.query.categories.split(',') : [];
    const minPrice = req.query.minPrice ? parseFloat(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice ? parseFloat(req.query.maxPrice) : null;
    const minRating = req.query.minRating ? parseFloat(req.query.minRating) : null;
    const sortBy = req.query.sortBy || '';

    // Fetch master list from DB if connected, otherwise fallback to masterProducts array
    let products = [];
    if (isMongoConnected) {
      products = await Product.find({}).lean();
    } else {
      products = JSON.parse(JSON.stringify(masterProducts));
    }

    // Process using core combinatorial intersect filter
    const result = filterAndSortProducts(products, { categories, minPrice, maxPrice, minRating, sortBy });

    res.json({
      success: true,
      total: result.length,
      products: result
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve products',
      error: err.message
    });
  }
});

// Categories endpoint (for dynamic filter UI generation)
app.get('/api/categories', async (req, res) => {
  try {
    let categoriesSet = new Set();
    if (isMongoConnected) {
      const distinct = await Product.distinct('category');
      categoriesSet = new Set(distinct);
    } else {
      masterProducts.forEach(p => categoriesSet.add(p.category));
    }
    res.json({
      success: true,
      categories: Array.from(categoriesSet)
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve categories',
      error: err.message
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
