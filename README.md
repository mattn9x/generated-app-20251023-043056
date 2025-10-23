# Zenith Ledger

A minimalist CRM for effortlessly tracking and managing your monthly spending with a visually stunning interface.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/mattn9x/generated-app-20251023-043021)

Zenith Ledger is a minimalist and visually stunning web application designed to help users manage their monthly spending with elegance and simplicity. It transforms the mundane task of expense tracking into a delightful experience. The application provides a clean dashboard overview of monthly expenditures, featuring an interactive chart for visual analysis and a list of recent transactions. Users can effortlessly add, categorize, and manage their expenses through an intuitive interface. The core philosophy is 'less is more,' focusing on clarity, usability, and a serene user experience, all built on a high-performance, serverless architecture powered by Cloudflare Workers.

## Key Features

-   **Minimalist Dashboard:** A clean, uncluttered overview of your current month's spending.
-   **Interactive Chart:** Visualize your expenses by category for quick insights.
-   **Recent Transactions:** See a running list of your latest expenses at a glance.
-   **Seamless Expense Entry:** Add new expenses quickly via a non-disruptive slide-over panel.
-   **Visually Stunning UI:** A beautiful, modern interface with smooth animations and micro-interactions.
-   **Responsive Design:** Flawless experience across all devices, from mobile to desktop.

## Technology Stack

-   **Frontend:**
    -   [React](https://react.dev/)
    -   [Vite](https://vitejs.dev/)
    -   [TypeScript](https://www.typescriptlang.org/)
    -   [Tailwind CSS](https://tailwindcss.com/)
    -   [shadcn/ui](https://ui.shadcn.com/)
    -   [Recharts](https://recharts.org/) for charting
    -   [Zustand](https://zustand-demo.pmnd.rs/) for state management
    -   [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/) for forms
-   **Backend:**
    -   [Hono](https://hono.dev/) running on [Cloudflare Workers](https://workers.cloudflare.com/)
-   **Storage:**
    -   [Cloudflare Durable Objects](https://developers.cloudflare.com/durable-objects/)

## Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/) (v18 or later)
-   [Bun](https://bun.sh/)
-   A [Cloudflare account](https://dash.cloudflare.com/sign-up)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/zenith-ledger.git
    cd zenith-ledger
    ```

2.  **Install dependencies:**
    This project uses Bun as the package manager.
    ```bash
    bun install
    ```

3.  **Authenticate with Cloudflare:**
    Log in to your Cloudflare account to be able to run the development server and deploy.
    ```bash
    bunx wrangler login
    ```

### Running the Development Server

To start the development server for both the frontend (Vite) and the backend (Wrangler), run:

```bash
bun dev
```

This will start the application, typically on `http://localhost:3000`. The frontend will be served by Vite, and API requests to `/api/*` will be proxied to your local Cloudflare Worker.

## Project Structure

-   `src/`: Contains the frontend React application source code.
    -   `pages/`: Main pages/views of the application.
    -   `components/`: Reusable React components.
    -   `lib/`: Utility functions and API client.
-   `worker/`: Contains the backend Hono application for the Cloudflare Worker.
    -   `user-routes.ts`: API route definitions.
    -   `entities.ts`: Durable Object entity definitions.
-   `shared/`: Contains TypeScript types and mock data shared between the frontend and backend.

## Deployment

This project is designed to be deployed to Cloudflare's serverless platform.

1.  **Build the application:**
    This command bundles the frontend and prepares the worker for deployment.
    ```bash
    bun run build
    ```

2.  **Deploy to Cloudflare:**
    This command deploys your application to your Cloudflare account.
    ```bash
    bun run deploy
    ```

Alternatively, you can deploy directly from your GitHub repository using the button below.

[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/mattn9x/generated-app-20251023-043021)

## Available Scripts

-   `bun dev`: Starts the local development server.
-   `bun build`: Builds the frontend application and worker for production.
-   `bun deploy`: Deploys the application to Cloudflare Workers.
-   `bun lint`: Runs ESLint to check for code quality issues.