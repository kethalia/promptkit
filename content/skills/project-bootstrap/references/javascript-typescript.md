# JavaScript/TypeScript Projects

Guide to bootstrapping JavaScript and TypeScript projects.

## Node.js Application

### Quick Setup

```bash
mkdir my-app && cd my-app
npm init -y
npm install -D typescript @types/node ts-node-dev
npx tsc --init
```

### Project Structure

```
my-app/
├── src/
│   ├── index.ts
│   ├── config/
│   │   └── index.ts
│   ├── services/
│   ├── utils/
│   └── types/
├── tests/
│   └── index.test.ts
├── package.json
├── tsconfig.json
├── .eslintrc.js
├── .prettierrc
├── .gitignore
└── README.md
```

### package.json

```json
{
  "name": "my-app",
  "version": "1.0.0",
  "description": "",
  "main": "dist/index.js",
  "scripts": {
    "dev": "ts-node-dev --respawn src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src --ext .ts",
    "lint:fix": "eslint src --ext .ts --fix",
    "format": "prettier --write \"src/**/*.ts\""
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "typescript": "^5.0.0",
    "ts-node-dev": "^2.0.0",
    "vitest": "^1.0.0",
    "eslint": "^8.0.0",
    "@typescript-eslint/eslint-plugin": "^6.0.0",
    "@typescript-eslint/parser": "^6.0.0",
    "prettier": "^3.0.0"
  }
}
```

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### src/index.ts

```typescript
import { config } from './config';

async function main() {
  console.log('Starting application...');
  console.log(`Environment: ${config.env}`);
}

main().catch(console.error);
```

## React Application (Vite)

### Quick Setup

```bash
npm create vite@latest my-react-app -- --template react-ts
cd my-react-app
npm install
```

### Add Common Dependencies

```bash
# Routing
npm install react-router-dom

# State management
npm install zustand
# or
npm install @tanstack/react-query

# UI components
npm install @radix-ui/react-dialog @radix-ui/react-dropdown-menu
npm install tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Forms
npm install react-hook-form zod @hookform/resolvers
```

### Project Structure

```
my-react-app/
├── src/
│   ├── main.tsx
│   ├── App.tsx
│   ├── components/
│   │   ├── ui/           # Reusable UI components
│   │   └── features/     # Feature-specific components
│   ├── hooks/            # Custom hooks
│   ├── lib/              # Utilities
│   ├── pages/            # Page components
│   ├── services/         # API services
│   ├── stores/           # State management
│   └── types/            # TypeScript types
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

### vite.config.ts

```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
  },
});
```

## Next.js Application

### Quick Setup

```bash
npx create-next-app@latest my-next-app --typescript --tailwind --eslint --app --src-dir
cd my-next-app
```

### Project Structure (App Router)

```
my-next-app/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── globals.css
│   │   ├── api/
│   │   │   └── route.ts
│   │   └── [dynamic]/
│   │       └── page.tsx
│   ├── components/
│   ├── lib/
│   └── types/
├── public/
├── next.config.js
├── tailwind.config.ts
└── package.json
```

### next.config.js

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
      },
    ],
  },
};

module.exports = nextConfig;
```

## Express API

### Quick Setup

```bash
mkdir my-api && cd my-api
npm init -y
npm install express cors helmet
npm install -D typescript @types/express @types/node @types/cors ts-node-dev
npx tsc --init
```

### Project Structure

```
my-api/
├── src/
│   ├── index.ts
│   ├── app.ts
│   ├── config/
│   │   └── index.ts
│   ├── routes/
│   │   ├── index.ts
│   │   └── users.ts
│   ├── controllers/
│   │   └── users.ts
│   ├── services/
│   │   └── users.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   └── errorHandler.ts
│   ├── models/
│   └── types/
├── tests/
├── package.json
└── tsconfig.json
```

### src/app.ts

```typescript
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { errorHandler } from './middleware/errorHandler';
import routes from './routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', routes);

// Error handling
app.use(errorHandler);

export default app;
```

### src/index.ts

```typescript
import app from './app';
import { config } from './config';

const PORT = config.port || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

## ESLint Configuration

### .eslintrc.js

```javascript
module.exports = {
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json'],
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};
```

## Prettier Configuration

### .prettierrc

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

## GitHub Actions CI

### .github/workflows/ci.yml

```yaml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npx tsc --noEmit

      - name: Test
        run: npm test

      - name: Build
        run: npm run build
```

## Bootstrap Checklist

```markdown
- [ ] Initialize package.json
- [ ] Add TypeScript
- [ ] Configure tsconfig.json
- [ ] Add ESLint + Prettier
- [ ] Add testing (Vitest/Jest)
- [ ] Create src/ structure
- [ ] Add .gitignore
- [ ] Add .editorconfig
- [ ] Add README.md
- [ ] Initialize git
- [ ] Add CI workflow
```
