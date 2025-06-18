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
