# React + TypeScript + Vite Project

This is a modern React application built with TypeScript and Vite, featuring a robust development environment with HMR (Hot Module Replacement) and comprehensive ESLint rules.

## Tech Stack

- **Framework**: React 19 with TypeScript
- **Build Tool**: Vite 6
- **Styling**: 
  - TailwindCSS
  - Chakra UI
  - Emotion
- **Icons**: 
  - Lucide React
  - React Icons
- **Theme Support**: next-themes
- **Development Tools**:
  - ESLint with TypeScript support
  - PostCSS
  - TypeScript 5.8

## Project Structure

```
client/
├── src/
│   ├── assets/        # Static assets
│   ├── components/    # React components
│   ├── data/         # Data files
│   ├── types/        # TypeScript type definitions
│   ├── App.tsx       # Main application component
│   ├── main.tsx      # Application entry point
│   └── index.css     # Global styles
├── public/           # Public static files
├── vite.config.ts    # Vite configuration
├── tsconfig.json     # TypeScript configuration
└── tailwind.config.js # Tailwind CSS configuration
```

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start development server:
   ```bash
   npm run dev
   ```

3. Build for production:
   ```bash
   npm run build
   ```

4. Preview production build:
   ```bash
   npm run preview
   ```

## Available Scripts

- `npm run dev` - Start development server with HMR
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run preview` - Preview production build

## ESLint Configuration

The project uses a comprehensive ESLint setup with TypeScript support. Here's the recommended configuration:

```js
export default tseslint.config({
  extends: [
    ...tseslint.configs.recommendedTypeChecked,
    ...tseslint.configs.strictTypeChecked,
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

For React-specific linting, you can add:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  plugins: {
    'react-x': reactX,
    'react-dom': reactDom,
  },
  rules: {
    ...reactX.configs['recommended-typescript'].rules,
    ...reactDom.configs.recommended.rules,
  },
})
```

## Development

The project uses Vite for fast development with features like:
- Hot Module Replacement (HMR)
- TypeScript support
- PostCSS processing
- TailwindCSS integration
- Path aliases (configured in vite.config.ts)

## Docker Support

A development Dockerfile is included (`Dockerfile.dev`) for containerized development.
