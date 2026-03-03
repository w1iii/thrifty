# Thrifty

A Tinder-style thrift shopping application that transforms the secondhand shopping experience into an engaging, swipe-based discovery platform. Built with a modern full-stack architecture.

![Thrifty](./src/assets/bg-green.jpg)

## About

Thrifty turns thrifting into a simple, addictive swipe experience. Browse a personalized feed of secondhand treasures, swipe right to save items you love, left to skip, and discover amazing deals—all in one smooth interface.

## Tech Stack

### Frontend
- **React 19** — UI library with hooks and modern functional components
- **Vite 7** — Next-generation build tool for fast development
- **React Router DOM** — Client-side routing and navigation
- **Axios** — HTTP client for API communication
- **Lucide React** — Icon library
- **CSS Modules** — Scoped styling

### Backend
- **Express.js 5** — Fast, minimalist web framework for Node.js
- **Node.js** — JavaScript runtime
- **PostgreSQL** — Relational database with connection pooling
- **JWT (jsonwebtoken)** — Token-based authentication
- **Bcrypt** — Password hashing
- **Cookie Parser** — HTTP cookie parsing
- **CORS** — Cross-origin resource sharing

## Features

### Authentication & Security
- User registration with email, password, and profile details
- Secure login with bcrypt password hashing
- JWT-based access tokens (15-minute expiry)
- Refresh token mechanism (7-day expiry) stored in httpOnly cookies
- Protected routes with middleware verification
- Password change functionality

### Swipe-Based Browsing
- Tinder-style card interface with drag gestures
- Swipe right to save (like), left to skip (pass)
- Touch and mouse support for swiping
- Visual feedback during swipe actions
- Personalized feed excluding user's own items
- Automatic tracking of swiped items (no duplicates)

### Saved Items
- View all liked/saved items in one place
- Chronological ordering (most recently saved first)
- Quick access to item details

### Sell Items
- List items for sale with:
  - Title and description
  - Price
  - Category
  - Condition
  - Image URL
  - Size
- Integration with user accounts

### User Settings
- Profile management
- Password change functionality
- Location settings (city, state)
- Contact information management

## Project Structure

```
thrifty/
├── src/                      # React frontend
│   ├── authContext.jsx       # Authentication context provider
│   ├── App.jsx               # Main app component with routing
│   ├── main.jsx             # Entry point
│   ├── components/
│   │   ├── Cards.jsx        # Swipe card component
│   │   ├── Dashboard.jsx    # Main dashboard layout
│   │   ├── Landingpage.jsx  # Landing/hero page
│   │   ├── Navbar.jsx       # Navigation bar
│   │   ├── Sidebar.jsx      # Side navigation
│   │   └── ...
│   ├── pages/
│   │   ├── SellItems.jsx    # Sell items form
│   │   ├── SavedItems.jsx   # Saved/liked items
│   │   ├── Settings.jsx      # User settings
│   │   └── SignupPage.jsx   # Registration page
│   └── assets/              # Static assets
│
├── server/                   # Express backend
│   ├── server.js            # Express server setup
│   ├── db/pool.js           # PostgreSQL connection pool
│   ├── controllers/         # Route handlers
│   │   ├── authController.js
│   │   ├── itemsController.js
│   │   └── swipeController.js
│   ├── routes/              # API route definitions
│   ├── middleware/          # Custom middleware
│   └── package.json
│
├── package.json             # Frontend dependencies
├── vite.config.js          # Vite configuration
└── eslint.config.js        # ESLint configuration
```

## Getting Started

### Prerequisites
- Node.js (v18+)
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd thrifty
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd server
   npm install
   ```

4. **Configure environment variables**

   Create a `.env` file in the `/server` directory:
   ```env
   PORT=5050
   DB_USER=your_db_user
   DB_PASSWORD=your_db_password
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=thrifty
   JWT_SECRET=your_jwt_secret
   REFRESH_TOKEN_SECRET=your_refresh_token_secret
   ```

   Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:5050
   ```

5. **Set up the database**
   
   Run the following SQL to create necessary tables:
   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     email VARCHAR(255) UNIQUE NOT NULL,
     password_hash VARCHAR(255) NOT NULL,
     first_name VARCHAR(100),
     last_name VARCHAR(100),
     phone_number VARCHAR(20),
     city VARCHAR(100),
     state VARCHAR(100),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE items (
     id SERIAL PRIMARY KEY,
     title VARCHAR(255) NOT NULL,
     description TEXT,
     price DECIMAL(10, 2) NOT NULL,
     category VARCHAR(100),
     condition VARCHAR(50),
     size VARCHAR(20),
     image_url TEXT,
     owner_id INTEGER REFERENCES users(id),
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );

   CREATE TABLE swipes (
     id SERIAL PRIMARY KEY,
     user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
     item_id INTEGER REFERENCES items(id) ON DELETE CASCADE,
     action VARCHAR(10) NOT NULL, -- 'liked' or 'passed'
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     UNIQUE(user_id, item_id)
   );
   ```

### Running the Application

**Development mode (runs both frontend and backend)**
```bash
cd server
npm run dev
```

**Run frontend only**
```bash
npm run dev
```

**Run backend only**
```bash
cd server
npm run server
```

The frontend will be available at `http://localhost:5173` and the backend API at `http://localhost:5050`.

## API Endpoints

### Authentication
- `POST /api/auth/signup` — User registration
- `POST /api/auth/login` — User login
- `POST /api/auth/logout` — User logout
- `POST /api/auth/refresh` — Refresh access token
- `GET /api/auth/user` — Get current user data
- `POST /api/auth/change-password` — Change password

### Items
- `POST /api/items/add` — Add new item for sale (protected)
- `GET /api/swipe/items` — Get items for swiping (protected)
- `POST /api/swipe/swipe` — Record swipe action (protected)
- `GET /api/swipe/saved` — Get saved/liked items (protected)

## Key Implementation Details

### Swipe Mechanism
The swipe functionality uses mouse/touch event handlers to track drag movements. The card rotates based on drag distance, providing visual feedback. When the drag exceeds a threshold (100px), the swipe is executed:

- **Right swipe (save)** — Records a "liked" action
- **Left swipe (skip)** — Records a "passed" action

### Token Management
The app uses a dual-token system:
- **Access token**: Short-lived (15 min), sent in Authorization header
- **Refresh token**: Long-lived (7 days), stored in httpOnly cookie

This provides security while maintaining user sessions across browser sessions.

### Database Optimization
- Items are fetched randomly for an engaging experience
- Swiped items are excluded from the feed using a subquery
- Connection pooling is used for efficient database connections

## License

ISC
