# Code Studio

**Code Studio** is a modern web-based code editor built with React, TypeScript, and Vite. It features a sleek UI powered by Tailwind CSS and integrates with [Judge0](https://judge0.com/) for real-time code compilation and execution.

---

## Features

-  Real-time code editing with syntax highlighting
-  Code execution using Judge0 API
-  Fast build and development powered by Vite
-  Styled with Tailwind CSS
-  Type-safe code using TypeScript

---

## How to Run

- Clone the repository.
- Go to the directory and install all the dependencies.
- ```bash
  npm install
- Get your Judge0 API from https://rapidapi.com/judge0-official/api/judge0-ce. Create .env file and paste it there (e.g., VITE_JUDGE0_API_KEY=your_api_key_here).
- Start the development server.
- ```bash
  npm run dev

##  Project Structure

```bash
.
├── public/                  # Static assets
├── src/                     # Source code
│   ├── components/          # React components (e.g., EditorPage.tsx)
│   ├── services/            # API logic (e.g., Judge0 integration)
│   ├── index.css            # Tailwind styles
│   └── main.tsx             # App entry point
├── .env.example             # Environment variable template
├── package.json             # Project metadata and scripts
├── tailwind.config.js       # Tailwind configuration
├── vite.config.ts           # Vite config
└── tsconfig.json            # TypeScript config
