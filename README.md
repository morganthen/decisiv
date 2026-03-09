# Decisiv

Decisiv is a modern, full-stack Next.js application for managing and prioritizing your to-do tasks. It features user authentication, a personalized dashboard, and AI-powered task prioritization using LLMs. The app is styled with Tailwind CSS and leverages Supabase for authentication and data storage.

## Features

- **User Authentication**: Secure sign up, login, and logout using Supabase Auth.
- **Personal Dashboard**: Each user has a private dashboard to manage their to-dos.
- **To-Do Management**: Add, delete, and view tasks with real-time updates.
- **AI Prioritization**: Uses an LLM API to automatically assign priority scores and explanations to tasks.
- **Responsive UI**: Built with React, Next.js, and styled using Tailwind CSS and shadcn/ui components.
- **Theme Support**: Light/dark mode toggle via next-themes.

## Technologies Used

- **Next.js** (App Router)
- **React 19**
- **Supabase** (Auth & Database)
- **Tailwind CSS**
- **shadcn/ui** & **Radix UI**
- **sonner** (toast notifications)
- **LLM API** (DeepInfra)
- **TypeScript**

## Folder Structure

```
app/                # Next.js app directory (routing, pages, layouts)
  (auth)/           # Auth pages (login, signup)
  (dashboard)/      # Dashboard and todo pages
  api/              # API routes (e.g., test-priorities)
  auth/             # Auth callback route
components/         # Reusable UI and feature components
  todos/            # To-do list components
  ui/               # UI primitives (button, card, input, etc.)
  theme-provider.tsx# Theme context provider
lib/                # Server/client utilities, data, types, helpers
  auth/             # Supabase client and auth actions
public/             # Static assets
middleware.ts       # Route protection and redirects
next.config.ts      # Next.js configuration
postcss.config.mjs  # PostCSS config
package.json        # Project dependencies and scripts
```

## Setup & Development

1. **Clone the repository:**
   ```sh
   git clone <repo-url>
   cd decisiv
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Configure environment variables:**
   - Create a `.env.local` file with your Supabase and LLM API keys:
     ```env
     NEXT_PUBLIC_PROJECT_URL=your_supabase_url
     NEXT_PUBLIC_PUBLISHABLE_KEY=your_supabase_anon_key
     LLM_API_KEY=your_deepinfra_api_key
     ```
4. **Run the development server:**
   ```sh
   npm run dev
   ```
5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Usage

- **Sign Up / Login:**
  - Access `/signup` or `/login` to create an account or log in.
- **Dashboard:**
  - After login, you are redirected to `/todo` where you can add, delete, and view your tasks.
- **Prioritize Tasks:**
  - Click the "prioritise" button to use the LLM to assign priority scores and explanations to your tasks.
- **Logout:**
  - Use the logout button in the dashboard header.

## Authentication & Middleware

- Route protection is enforced via `middleware.ts`:
  - Unauthenticated users are redirected to `/login`.
  - Authenticated users are redirected away from `/login` and `/signup` to `/todo`.
- Supabase handles all authentication and user session management.

## API

- `/api/test-priorities`:
  - Protected route that fetches the user's tasks and returns LLM-prioritized results as JSON.

## Components

- Modular UI built with shadcn/ui and Radix primitives.
- Key components:
  - `ToDoClientShell`, `ToDoList`, `ToDoItem`, `TaskInputForm`, `PrioritizeButton`
  - UI primitives in `components/ui/`

## License

This project is for educational and portfolio purposes.
