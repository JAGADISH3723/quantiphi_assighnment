# E-Commerce Product Multi-Filter Sidebar (MERN Stack)

![ApexMarket UI Preview]([<img width="1024" height="642" alt="image" src="https://github.com/user-attachments/assets/117746cb-b449-4c94-a4c1-fa05cba16a23" />](https://postimg.cc/wyBDpQTB)
)

This repository houses the complete solution for the **E-Commerce Product Multi-Filter Sidebar** application. The solution is engineered as a full-stack MERN application focusing on server-side computation, interactive user feedback, and premium visual aesthetics.


---

## 🚀 Project Overview

The mission of this application is to build a core browsing interface for a high-traffic e-commerce marketplace. Users can filter through a rich inventory dataset using three distinct criteria simultaneously:
1. **Category Checklist**: Filters products matching one or more selected categories.
2. **Dual-point Price Range Slider**: Dynamically adjusts the minimum and maximum price boundaries.
3. **Minimum Star Rating**: Radio selectors that filter for products meeting or exceeding a target rating (1 to 5 stars).
4. **Sort By Dropdown**: Instantly sorts the filtered products by *Price: Low to High*, *Price: High to Low*, or *Top Rated First*.

---

## 🛠️ Architecture & Tech Stack

Following industry-standard practices, the project is structured with a clean separation of concerns:
* **Frontend**: React (Vite, Javascript) & Vanilla CSS
* **Backend**: Node.js, Express, and MongoDB (via Mongoose)
* **Design & Aesthetics**: Dual-theme (Dark/Light) featuring glassmorphism, responsive grid layout, micro-animations, and shimmer loading skeletons.

### Directory Layout
```
quantiphi_assignment/
├── backend/
│   ├── server.js          # Express app, Mongoose schemas, and combinatorial filter logic
│   ├── package.json       # Backend configuration & dependencies
│   └── .env               # Server environment variables
├── frontend/
│   ├── src/
│   │   ├── App.jsx        # Root React component (UI state, debouncing, API integration)
│   │   ├── App.css        # Clean design system & custom CSS styles
│   │   ├── index.css      # Minimal layout reset
│   │   └── main.jsx       # Entry point
│   ├── index.html         # Document head, SEO tags, and Google Fonts
│   └── package.json       # Frontend dependencies & Vite scripts
└── README.md              # Documentation
```

---

## ⚙️ Core Server-Side Business Logic

To ensure the client remains lightweight and high-performing (especially on mobile devices), **all business logic, filtering, calculations, and sorting are executed on the server side**. 

The backend contains a dedicated **Combinatorial Intersect Filtering Array** processor. When a user updates a filter on the frontend:
1. An API request is sent to the backend with URL query parameters.
2. The server pulls the master inventory from the MongoDB database.
3. The server executes a filtering loop to ensure that products must satisfy **all active filters** (AND logic).
4. **Graceful Null Handling**: If all filters are cleared, the server bypasses the reduction filters and returns the base catalog.
5. The remaining matching products are then sorted according to the user's selection (`sortBy`) and returned as JSON.

---

## 💎 Key Features & Visuals

* **Real-time State Feedback**: Slider changes and checkbox clicks trigger queries immediately. The price range slider has a **200ms debounce** to prevent flooding the server with network requests while dragging.
* **Resilient Connection Fallback**: The backend connects to MongoDB if running. If MongoDB is unavailable, it automatically falls back to an in-memory mock catalog of 20 premium products with Unsplash thumbnails, ensuring the app runs flawlessly out-of-the-box.
* **Premium UX States**:
  * **Loading Skeleton**: Shimmer cards are displayed during fetches.
  * **Empty State Screen**: If no items match, the grid is replaced with a custom "No items match your criteria" screen featuring a "Reset Filters" button.
* **Dual-Point Slider**: Custom-built overlapping HTML range inputs styled with CSS gradients.
* **Theme Toggle**: Switch between a sleek space-dark mode (with glowing accents) and a clean light mode with a single click.

---

## 🚦 Setup and Installation Instructions

Follow these steps to run both the backend and frontend locally.

### Prerequisites
* **Node.js** (v16 or higher recommended)
* **MongoDB** (optional; the app falls back to a mock database if MongoDB is not running locally)

---

### Step 1: Run the Backend Server
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   The backend will run on **[http://localhost:5000](http://localhost:5000)**. It will automatically connect to MongoDB or fallback to in-memory mode, seeding the database if empty.

---

### Step 2: Run the Frontend Application
1. Open a new terminal window and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on **[http://localhost:5173](http://localhost:5173)**. Open this link in your browser to view the application.

---

## 📈 API Endpoints Reference

### 1. `GET /api/products`
Retrieves products matching active filter criteria.

**Query Parameters:**
* `categories` (string): Comma-separated categories (e.g. `Electronics,Apparel`).
* `minPrice` (number): Minimum price bound.
* `maxPrice` (number): Maximum price bound.
* `minRating` (number): Minimum star rating (1-5).
* `sortBy` (string): Sort order (`price_asc`, `price_desc`, `rating_desc`).

### 2. `GET /api/categories`
Retrieves all unique categories present in the database to build filter sidebar controls dynamically.
