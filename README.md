
# NU Ranting System

This is a comprehensive, client-side only application for managing NU Ranting (branch) activities. All data is stored locally in your browser.

## How to Run Locally

This project is a standard React application built with Vite and does not require a backend server.

1.  **Prerequisites:**
    *   Node.js (v18 or newer)
    *   npm or yarn

2.  **Installation:**
    *   Unzip the project files into a new directory.
    *   Open your terminal in that directory.
    *   Install the required dependencies:
        ```bash
        npm install react react-dom react-router-dom recharts jspdf html2canvas html-to-image papaparse idb lucide-react
        ```
    *   Install development dependencies:
        ```bash
        npm install -D typescript @types/react @types/react-dom @vitejs/plugin-react tailwindcss postcss autoprefixer
        ```

3.  **Running the Development Server:**
    *   Start the development server:
        ```bash
        npx vite
        ```
    *   Open your browser and navigate to the URL provided by Vite (usually `http://localhost:5173`).

## How to Deploy to Vercel

Since this is a client-side only application (a Single Page Application), deploying it to Vercel is straightforward.

1.  **Push to a Git Repository:**
    *   Initialize a git repository in your project folder.
    *   Commit all the files.
    *   Push the repository to GitHub, GitLab, or Bitbucket.

2.  **Deploy on Vercel:**
    *   Log in to your Vercel account.
    *   Click "Add New..." -> "Project".
    *   Import the Git repository you just created.
    *   Vercel should automatically detect that it's a Vite project. It will use the following settings by default, which are correct:
        *   **Framework Preset:** `Vite`
        *   **Build Command:** `vite build`
        *   **Output Directory:** `dist`
    *   Click "Deploy".
    *   Vercel will build and deploy your site. Once finished, you'll be given a public URL to access your live application.

That's it! Your NU Ranting System is now live.
