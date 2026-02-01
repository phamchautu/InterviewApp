# InterviewApp - Movie Browser

A professional React Native application built with TypeScript, demonstrating modern architecture, state management, and API integration using The Movie Database (TMDB).

## 🚀 Getting Started

### 1. Environment Setup
Create a `.env` file in the root directory and add your TMDB configuration. 
**Note:** Ensure you replace the placeholder with your actual Read Access Token.

```env
API_URL=https://api.themoviedb.org
API_ACCESS_TOKEN={{your access token}}
API_IMAGE_URL=https://image.tmdb.org/t/p/w500
```

### 2. Installation
Install the project dependencies using Yarn (mandated for this project):

```bash
yarn install
cd ios && pod install && cd ..
```

### 3. Running the App
Start the Metro bundler first. Since this project uses absolute path aliases, it is recommended to reset the cache on the first run:

```bash
yarn start --reset-cache
```

In separate terminal windows, run the platform-specific commands:

**For iOS:**
```bash
yarn ios
```

**For Android:**
```bash
yarn android
```

---

## 🌟 Key Features

- **Home Screen:**
  - **Dynamic Browsing:** Switch between "Now Playing", "Upcoming", and "Popular" categories.
  - **Advanced Search:** Integrated search functionality with manual trigger logic.
  - **Custom Sorting:** Sort results by Alphabetical order, Rating, or Release Date.
  - **Pagination:** Smooth "Load More" functionality and "Pull to Refresh" support.
- **Watchlist Screen:**
  - **Persisted Favorites:** Save movies to your local device storage.
  - **User Profile:** Real-time fetching of your TMDB account profile and avatar.
  - **iOS-style Selection:** Custom modal-based sorting experience for a native feel.
- **Movie Details:**
  - **Comprehensive Data:** View runtime, genres, certification (PG-13, etc.), status, and tagline.
  - **Credits:** Highlights key Directors and Writers.
  - **Recommendations:** Browse similar movies through horizontal recommendation lists.

---

## 🛠 Tech Stack & Architecture

- **React Native & TypeScript:** For type-safe, cross-platform mobile development.
- **Zustand:** Atomic state management with high performance and minimal boilerplate.
- **Persistence:** Utilizes `zustand/middleware` and `AsyncStorage` to remember user preferences (Category, Sort By) and the Watchlist even after the app is closed.
- **React Navigation:** Typed stack and bottom-tab navigation with custom header components.
- **Axios:** Centralized API client with interceptors for automatic token injection and error handling.
- **Absolute Imports:** Configured with `@/` alias for cleaner, more maintainable import paths.

---

## 📐 Engineering Standards
This project follows strict engineering rules defined in `CODING_STANDARDS.md`. 
Highlights include:
- Separation of concerns (Logic in Stores, UI in Components).
- Mandatory `Props` interfaces for all components.
- Standardized UI spacing and theme constants.
- Global Error Handling via a centralized store and modal.
