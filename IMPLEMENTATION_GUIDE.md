# Implementation Guide - School ERP Project

## 🚀 Getting Started with Feature-Based Architecture

This guide will help you implement the feature-based structure and understand how each component works.

---

## 📋 Table of Contents

1. [Project Setup](#project-setup)
2. [Backend Implementation](#backend-implementation)
3. [Frontend Implementation](#frontend-implementation)
4. [Adding New Features](#adding-new-features)
5. [Best Practices](#best-practices)
6. [Common Patterns](#common-patterns)

---

## Project Setup

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Initial Setup

```bash
# Clone the repository
git clone <repo-url>
cd school_erp

# Backend setup
cd backend
npm install
cp .env.example .env
# Update .env with your configuration
npm run build

# Frontend setup
cd ../frontend
npm install
cp .env.example .env
# Update .env with your API URL
```

---

## Backend Implementation

### 1. Database Connection Setup

**File: `backend/src/config/database.ts`**

```typescript
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  database: process.env.DB_NAME,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle client", err);
});

export default pool;
```

### 2. Creating Your First Feature

#### Example: Authentication Feature

**Step 1: Model (`backend/src/features/auth/model/User.ts`)**

```typescript
import { QueryResult } from "pg";
import pool from "../../../config/database";

export interface IUser {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
}

export class User {
  static async findByEmail(email: string): Promise<IUser | null> {
    const result: QueryResult = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email],
    );
    return result.rows[0] || null;
  }

  static async create(userData: Partial<IUser>): Promise<IUser> {
    const { email, password, firstName, lastName } = userData;
    const result: QueryResult = await pool.query(
      "INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *",
      [email, password, firstName, lastName],
    );
    return result.rows[0];
  }

  static async findById(id: string): Promise<IUser | null> {
    const result: QueryResult = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [id],
    );
    return result.rows[0] || null;
  }
}
```

**Step 2: Validation (`backend/src/features/auth/validation/authValidation.ts`)**

```typescript
import Joi from "joi";

export const signupSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const validateAuth = (schema: Joi.Schema, data: any) => {
  const { error, value } = schema.validate(data);
  if (error) {
    throw new Error(error.details[0].message);
  }
  return value;
};
```

**Step 3: Service (`backend/src/features/auth/service/authService.ts`)**

```typescript
import { User, IUser } from "../model/User";
import {
  validateAuth,
  signupSchema,
  loginSchema,
} from "../validation/authValidation";
import {
  hashPassword,
  comparePassword,
  generateToken,
} from "../../../utils/helpers";

export class AuthService {
  static async signup(userData: any): Promise<{ user: IUser; token: string }> {
    // Validate input
    validateAuth(signupSchema, userData);

    // Check if user exists
    const existingUser = await User.findByEmail(userData.email);
    if (existingUser) {
      throw new Error("User already exists");
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password);

    // Create user
    const user = await User.create({
      ...userData,
      password: hashedPassword,
    });

    // Generate token
    const token = generateToken(user.id);

    return { user, token };
  }

  static async login(
    credentials: any,
  ): Promise<{ user: IUser; token: string }> {
    // Validate input
    validateAuth(loginSchema, credentials);

    // Find user
    const user = await User.findByEmail(credentials.email);
    if (!user) {
      throw new Error("Invalid credentials");
    }

    // Verify password
    const isValidPassword = await comparePassword(
      credentials.password,
      user.password,
    );
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    // Generate token
    const token = generateToken(user.id);

    return { user, token };
  }
}
```

**Step 4: Controller (`backend/src/features/auth/controller/authController.ts`)**

```typescript
import { Request, Response } from "express";
import { AuthService } from "../service/authService";

export class AuthController {
  static async signup(req: Request, res: Response): Promise<void> {
    try {
      const { user, token } = await AuthService.signup(req.body);
      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: { user, token },
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }

  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { user, token } = await AuthService.login(req.body);
      res.status(200).json({
        success: true,
        message: "Login successful",
        data: { user, token },
      });
    } catch (error) {
      res.status(401).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }
}
```

**Step 5: Routes (`backend/src/features/auth/routes/authRoutes.ts`)**

```typescript
import { Router } from "express";
import { AuthController } from "../controller/authController";

const router = Router();

router.post("/signup", AuthController.signup);
router.post("/login", AuthController.login);

export default router;
```

**Step 6: Register in Main App (`backend/src/app.ts`)**

```typescript
import express from "express";
import authRoutes from "./features/auth/routes/authRoutes";
import userRoutes from "./features/users/routes/userRoutes";

const app = express();

app.use(express.json());

// Register feature routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

export default app;
```

### 3. Database Migrations

**File: `backend/src/database/migrations/001_create_users_table.sql`**

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
```

**Run migrations:**

```bash
npm run migrate
```

---

## Frontend Implementation

### 1. API Service Setup

**File: `frontend/src/shared/utils/api.ts`**

```typescript
import axios, { AxiosInstance } from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || "30000"),
});

// Request interceptor - Add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default api;
```

### 2. Feature Service

**File: `frontend/src/features/auth/services/authService.ts`**

```typescript
import api from "../../../shared/utils/api";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData extends LoginCredentials {
  firstName: string;
  lastName: string;
}

export class AuthService {
  static async login(credentials: LoginCredentials) {
    return api.post("/auth/login", credentials);
  }

  static async signup(data: SignupData) {
    return api.post("/auth/signup", data);
  }

  static logout() {
    localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
  }
}
```

### 3. Custom Hook

**File: `frontend/src/features/auth/hooks/useAuth.ts`**

```typescript
import { useState } from "react";
import { AuthService } from "../services/authService";

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.login({ email, password });
      localStorage.setItem(
        import.meta.env.VITE_AUTH_TOKEN_KEY,
        response.data.token,
      );
      return response.data;
    } catch (err) {
      const message = (err as any).response?.data?.message || "Login failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await AuthService.signup({
        email,
        password,
        firstName,
        lastName,
      });
      localStorage.setItem(
        import.meta.env.VITE_AUTH_TOKEN_KEY,
        response.data.token,
      );
      return response.data;
    } catch (err) {
      const message = (err as any).response?.data?.message || "Signup failed";
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { login, signup, loading, error };
}
```

### 4. Context (State Management)

**File: `frontend/src/features/auth/context/AuthContext.tsx`**

```typescript
import React, { createContext, useCallback, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Check if user is logged in on mount
    const token = localStorage.getItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
    if (token) {
      // Fetch user data from API
      // setUser(userData);
    }
  }, []);

  const login = useCallback((token: string, userData: User) => {
    localStorage.setItem(import.meta.env.VITE_AUTH_TOKEN_KEY, token);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(import.meta.env.VITE_AUTH_TOKEN_KEY);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
```

### 5. Login Component

**File: `frontend/src/features/auth/components/LoginForm.tsx`**

```typescript
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import styles from '../styles/auth.module.css';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      // Navigate to home or dashboard
    } catch (err) {
      console.error('Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="email">Email:</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password">Password:</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### 6. Login Page

**File: `frontend/src/features/auth/pages/LoginPage.tsx`**

```typescript
import React from 'react';
import { LoginForm } from '../components/LoginForm';

export function LoginPage() {
  return (
    <div>
      <h1>Login to School ERP</h1>
      <LoginForm />
    </div>
  );
}
```

---

## Adding New Features

### Backend: Adding a "Products" Feature

```bash
backend/src/features/products/
├── controller/
│   ├── productController.ts
│   └── index.ts
├── service/
│   ├── productService.ts
│   └── index.ts
├── routes/
│   ├── productRoutes.ts
│   └── index.ts
├── model/
│   ├── Product.ts
│   └── index.ts
├── validation/
│   ├── productValidation.ts
│   └── index.ts
└── tests/
    ├── product.test.ts
    └── product.integration.test.ts
```

**Complete the layer by layer:**

1. **Model** - Database queries
2. **Validation** - Input schemas
3. **Service** - Business logic
4. **Controller** - Request handlers
5. **Routes** - URL endpoints
6. **Tests** - Unit & integration tests

### Frontend: Adding a "Products" Feature

```bash
frontend/src/features/products/
├── components/
│   ├── ProductCard.tsx
│   ├── ProductForm.tsx
│   ├── ProductList.tsx
│   └── index.ts
├── pages/
│   ├── ProductsPage.tsx
│   ├── ProductDetailPage.tsx
│   └── index.ts
├── services/
│   ├── productService.ts
│   └── index.ts
├── hooks/
│   ├── useProducts.ts
│   ├── useProduct.ts
│   └── index.ts
├── context/
│   ├── ProductContext.tsx
│   └── index.ts
├── styles/
│   └── products.module.css
├── types/
│   ├── product.types.ts
│   └── index.ts
└── index.tsx
```

---

## Best Practices

### 1. Index Files (Barrel Exports)

Create `index.ts/index.tsx` in each folder for clean imports:

```typescript
// ✅ Good
export * from "./useAuth";
export * from "./useFetch";

// Usage:
import { useAuth, useFetch } from "./hooks";
```

### 2. Error Handling

```typescript
// ✅ Good error handling in service
export class UserService {
  static async getUser(id: string) {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      if (error.response?.status === 404) {
        throw new Error("User not found");
      }
      throw new Error("Failed to fetch user");
    }
  }
}
```

### 3. Type Safety

```typescript
// ✅ Define types/interfaces
interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

// Use in service
async function login(data: LoginRequest): Promise<LoginResponse> {
  // implementation
}
```

### 4. Middleware Order (Backend)

```typescript
app.use(express.json());
app.use(cors());
app.use(loggingMiddleware);
app.use(requestValidator);
app.use("/api/auth", authRoutes);
app.use(authMiddleware); // Protected routes below
app.use("/api/users", userRoutes);
app.use(errorHandler); // Last middleware
```

### 5. Component Props (Frontend)

```typescript
// ✅ Use interfaces for props
interface LoginFormProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

function LoginForm({ onSuccess, onError }: LoginFormProps) {
  // implementation
}
```

---

## Common Patterns

### Pattern 1: Custom Hook with API Call

```typescript
function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await UserService.getAll();
      setUsers(data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return { users, loading, error, refetch: fetchUsers };
}
```

### Pattern 2: Protected Route

```typescript
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const auth = useAuth();

  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
}
```

### Pattern 3: API Error Handling

```typescript
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    // Toast notification or error context
    return Promise.reject(new Error(message));
  },
);
```

### Pattern 4: Controller with Try-Catch

```typescript
export class ProductController {
  static async getAll(req: Request, res: Response) {
    try {
      const products = await ProductService.getAll();
      res.json({ success: true, data: products });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: (error as Error).message,
      });
    }
  }
}
```

---

## Running the Project

### Backend

```bash
cd backend
npm install
npm run dev          # Development mode with nodemon
npm run build        # Production build
npm run migrate      # Run migrations
npm test             # Run tests
```

### Frontend

```bash
cd frontend
npm install
npm run dev          # Development server
npm run build        # Production build
npm run lint         # Run linter
npm run test         # Run tests
```

---

## Deployment Considerations

- Use environment variables for all configuration
- Separate build and runtime configuration
- Implement proper logging and monitoring
- Use database migrations for schema changes
- Build Docker containers for consistency
- Set up CI/CD pipelines (GitHub Actions, GitLab CI)
- Implement API rate limiting
- Use HTTPS in production
- Implement comprehensive testing (unit, integration, e2e)

---

## Next Steps

1. Set up database and create migrations
2. Implement the auth feature completely
3. Add user management feature
4. Create shared components and utilities
5. Set up testing framework and write tests
6. Implement error boundaries and error pages
7. Add logging and monitoring
8. Deploy to staging environment
9. Get feedback and iterate

Good luck with your School ERP project! 🎉
