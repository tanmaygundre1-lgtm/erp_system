# Quick Reference Guide - School ERP Architecture

## 📊 Architecture Overview

```
        ┌─────────────────────────────────────────────────────────┐
        │                    FRONTEND/REACT                        │
        │  Components → Hooks → Context → Services → API Calls    │
        └──────────────────────┬──────────────────────────────────┘
                               │ HTTP Requests (JSON)
                               ↓
        ┌─────────────────────────────────────────────────────────┐
        │                BACKEND/EXPRESS.JS                        │
        │  Routes → Controller → Service → Model → Database       │
        └──────────────────────┬──────────────────────────────────┘
                               │
                               ↓
        ┌─────────────────────────────────────────────────────────┐
        │          DATABASE / PostgreSQL / SQL                     │
        │              (Data Persistence Layer)                    │
        └─────────────────────────────────────────────────────────┘
```

---

## 🔄 Data Flow

### **POST /api/auth/login Request Flow**

```
1. FRONTEND
   LoginForm Component
         ↓
   useAuth Hook (calls AuthService.login())
         ↓
   AuthService hits POST /api/auth/login
         ↓
   API Interceptor adds JWT token to request
         ↓
   HTTP Request sent to backend

2. BACKEND
   authRoutes receives POST /api/auth/login
         ↓
   AuthController.login() extracts request data
         ↓
   AuthService.login() contains business logic
         ↓
   AuthService calls User.findByEmail() from Model
         ↓
   User Model executes SQL query on PostgreSQL Database
         ↓
   Database returns user record
         ↓
   AuthService processes data, generates JWT token
         ↓
   AuthController formats response
         ↓
   HTTP Response (200) sent back with { token, user }

3. FRONTEND
   LoginForm receives response
         ↓
   useAuth hook saves token to localStorage
         ↓
   AuthContext updates with user data
         ↓
   App navigates to dashboard
```

---

## 📁 Quick Folder Reference

### **Backend Structure**

| Folder                        | Purpose                | Contains                                       |
| ----------------------------- | ---------------------- | ---------------------------------------------- |
| `features/[name]/controller/` | HTTP Request Handlers  | Input extraction, calling services             |
| `features/[name]/service/`    | Business Logic         | Validation, data processing, orchestration     |
| `features/[name]/routes/`     | Endpoint Definitions   | Express route definitions                      |
| `features/[name]/model/`      | Database Queries       | SQL queries, data access                       |
| `features/[name]/validation/` | Input Validation       | Schemas, validation rules                      |
| `middleware/`                 | Cross-cutting Concerns | Auth, error handling, logging, CORS            |
| `config/`                     | Setup & Config         | Database, environment variables                |
| `utils/`                      | Helper Functions       | Password hashing, token generation, formatters |
| `database/`                   | Migrations & Seeds     | Schema migrations, initial data                |

### **Frontend Structure**

| Folder                        | Purpose            | Contains                           |
| ----------------------------- | ------------------ | ---------------------------------- |
| `features/[name]/components/` | Feature Components | LoginForm, UserCard, ProductList   |
| `features/[name]/pages/`      | Page Components    | Full page views, routes            |
| `features/[name]/services/`   | API Service Layer  | Axios calls, API endpoints         |
| `features/[name]/hooks/`      | Custom Hooks       | useAuth, useProducts, useFetch     |
| `features/[name]/context/`    | State Management   | Context providers, Redux slices    |
| `features/[name]/styles/`     | Feature Styles     | CSS modules, SCSS, scoped styles   |
| `shared/components/`          | Reusable UI        | Button, Modal, Input, Card         |
| `shared/hooks/`               | Shared Hooks       | useLocalStorage, useDebounce       |
| `shared/contexts/`            | Global State       | Theme, Language, Notifications     |
| `shared/utils/`               | Helpers            | API config, validators, formatters |

---

## 🔑 Key Files to Update When Adding Features

### **Step 1: Create Feature Folders** (Backend)

```
backend/src/features/productName/
├── controller/
├── service/
├── routes/
├── model/
├── validation/
└── tests/
```

### **Step 2: Implement Layers** (Backend)

**Order matters!**

1. **Model** - Database queries
2. **Validation** - Input schemas
3. **Service** - Business logic
4. **Controller** - Request handlers
5. **Routes** - URL mapping
6. **app.ts** - Register routes

### **Step 3: Create Feature** (Frontend)

```
frontend/src/features/productName/
├── components/
├── pages/
├── services/
├── hooks/
├── context/
├── styles/
└── types/
```

### **Step 4: Connect** (Frontend)

1. Create service (API calls)
2. Create hooks (state logic)
3. Create components (UI)
4. Create pages (full views)
5. Add routes in App.tsx

---

## 🎯 Import Patterns

### **Backend: Feature-Specific Import**

```typescript
// ✅ Good - Feature-scoped
import { AuthService } from "./features/auth/service";
import { User } from "./features/auth/model";

// ❌ Bad - Cross-feature coupling
import { User as AuthUser } from "./features/auth/model";
import { User as DataUser } from "./features/users/model";
```

### **Frontend: Clean Barrel Exports**

```typescript
// In features/auth/hooks/index.ts
export { useAuth } from "./useAuth";
export { useLogin } from "./useLogin";

// Usage
import { useAuth, useLogin } from "./hooks"; // ✅ Clean

// Instead of
import { useAuth } from "./hooks/useAuth"; // ❌ Verbose
```

---

## 🛡️ Middleware Order (Backend)

```typescript
// app.ts - Correct order matters!

import express from "express";
import cors from "cors";
import authRoutes from "./features/auth/routes";
import userRoutes from "./features/users/routes";
import { authMiddleware } from "./middleware/authMiddleware";
import { errorHandler } from "./middleware/errorHandler";
import { loggingMiddleware } from "./middleware/loggingMiddleware";

const app = express();

// 1. Body parsing
app.use(express.json());

// 2. CORS
app.use(cors());

// 3. Logging
app.use(loggingMiddleware);

// 4. Public routes (auth)
app.use("/api/auth", authRoutes);

// 5. Protected middleware (guards private routes)
app.use(authMiddleware);

// 6. Private routes (users, products, etc)
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);

// 7. Error handling (last!)
app.use(errorHandler);

export default app;
```

---

## 🔐 Authentication Flow

### **Backend JWT Flow**

```
User Login Request
    ↓
AuthController validates credentials
    ↓
AuthService creates JWT: { userId, email, exp }
    ↓
JWT Token sent to Frontend
    ↓
---
Protected Route Request with Token
    ↓
authMiddleware extracts token from Authorization header
    ↓
Middleware verifies JWT signature
    ↓
If valid → req.user = decoded payload → proceed
If invalid → 401 Unauthorized
```

### **Frontend Token Management**

```
1. Login successful → Store token in localStorage
   localStorage.setItem('school_erp_token', token)

2. Every API request → Add token to header
   Authorization: Bearer {token}

3. Response 401 → Token expired
   → Clear localStorage
   → Redirect to login

4. Logout → Remove token
   localStorage.removeItem('school_erp_token')
```

---

## 📝 Naming Conventions

| Type             | Convention                   | Example                          |
| ---------------- | ---------------------------- | -------------------------------- |
| Controller files | `[featureName]Controller.ts` | `authController.ts`              |
| Service files    | `[featureName]Service.ts`    | `userService.ts`                 |
| Route files      | `[featureName]Routes.ts`     | `productRoutes.ts`               |
| Model files      | `[FeatureName].ts`           | `User.ts`, `Product.ts`          |
| Hook files       | `use[HookName].ts`           | `useAuth.ts`, `useProducts.ts`   |
| Component files  | `[ComponentName].tsx`        | `LoginForm.tsx`, `UserCard.tsx`  |
| Page files       | `[PageName]Page.tsx`         | `LoginPage.tsx`, `UsersPage.tsx` |
| Style files      | `[featureName].module.css`   | `auth.module.css`                |
| Type files       | `[featureName].types.ts`     | `user.types.ts`                  |
| Folders          | `lowercase`                  | `components/, services/, hooks/` |
| Context files    | `[FeatureName]Context.tsx`   | `AuthContext.tsx`                |

---

## ✅ Checklist for Adding a Feature

### **Backend Feature Checklist**

- [ ] Create folder: `backend/src/features/[featureName]/`
- [ ] Create model with database queries
- [ ] Create validation schemas
- [ ] Create service with business logic
- [ ] Create controller with request handlers
- [ ] Create routes file
- [ ] Create migration file (if adding new table)
- [ ] Create tests (unit + integration)
- [ ] Register routes in `app.ts`
- [ ] Update `.env.example` if needed
- [ ] Write README for feature

### **Frontend Feature Checklist**

- [ ] Create folder: `frontend/src/features/[featureName]/`
- [ ] Create service (API calls)
- [ ] Create custom hooks
- [ ] Create components
- [ ] Create pages
- [ ] Create context (if needed)
- [ ] Create types/interfaces
- [ ] Create styles (CSS modules)
- [ ] Create barrel exports (index files)
- [ ] Add routes in `App.tsx`
- [ ] Test API integration
- [ ] Add error handling
- [ ] Write component docs

---

## 🚀 Common Commands

### **Backend**

```bash
# Development
npm run dev              # Start dev server with hot reload
npm run build           # Build TypeScript
npm run start           # Run built code
npm run migrate         # Run database migrations
npm run seed            # Seed database
npm test                # Run tests
npm run lint            # Run linter

# Production
NODE_ENV=production npm start
```

### **Frontend**

```bash
# Development
npm run dev             # Start dev server (Vite/Webpack)
npm run build           # Build for production
npm run preview         # Preview production build
npm run lint            # Run ESLint
npm run lint:fix        # Fix lint errors
npm test                # Run tests
npm run test:watch      # Watch mode

# Production
npm run build
npm start               # Or deploy dist/ folder
```

---

## 🐛 Debugging Tips

### **Backend Debugging**

```typescript
// 1. Add logging in service
console.log("User login attempt:", { email, timestamp: Date.now() });

// 2. Check middleware order
// 3. Verify database connections
// 4. Check JWT secret in .env
// 5. Verify CORS settings
// 6. Use Postman/Insomnia to test endpoints
```

### **Frontend Debugging**

```typescript
// 1. Check console for errors
// 2. Use React DevTools extension
// 3. Check Network tab in DevTools
// 4. Verify .env configuration
// 5. Check token in localStorage
// 6. Use debugger statements in hooks
```

---

## 📚 Folder Expansion Pattern

When your project grows, expand features like this:

```
# Initial
features/auth/
├── components/
├── pages/
└── services/

# As it grows
features/auth/
├── components/
│   ├── LoginForm/
│   │   ├── LoginForm.tsx
│   │   ├── LoginForm.module.css
│   │   └── index.ts
│   ├── RegisterForm/
│   └── PasswordReset/
├── pages/
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   └── ChangePasswordPage.tsx
├── services/
│   ├── authService.ts
│   ├── passwordService.ts
│   └── sessionService.ts
├── hooks/
│   ├── useAuth.ts
│   ├── useLogin.ts
│   ├── useRegister.ts
│   └── usePasswordReset.ts
├── context/
│   ├── AuthContext.tsx
│   └── SessionContext.tsx
├── types/
│   ├── auth.types.ts
│   └── session.types.ts
├── utils/
│   ├── authHelper.ts
│   └── tokenManager.ts
├── styles/
│   ├── auth.module.css
│   ├── login.module.css
│   └── register.module.css
└── __tests__/
    ├── useAuth.test.ts
    ├── authService.test.ts
    └── LoginForm.test.tsx
```

---

## 🎓 When to Use What

| Scenario                        | Use This           | Not This                      |
| ------------------------------- | ------------------ | ----------------------------- |
| Shared across multiple features | `shared/`          | `features/[specificFeature]/` |
| Only used in one feature        | `features/[name]/` | `shared/`                     |
| Business logic                  | `service/`         | `controller/`                 |
| HTTP request handling           | `controller/`      | `route/`                      |
| Database operations             | `model/`           | `service/`                    |
| Input validation                | `validation/`      | `controller/`                 |
| UI logic                        | `component/`       | `hook/`                       |
| Stateful logic                  | `hook/`            | `component/`                  |
| Global state                    | `context/`         | `hook/`                       |
| API calls                       | `service/`         | `component/`                  |

---

## 📞 Common Errors & Solutions

| Error                     | Cause                       | Solution                                 |
| ------------------------- | --------------------------- | ---------------------------------------- |
| CORS error                | Wrong origin in CORS config | Update `CORS_ORIGIN` in `.env`           |
| 401 Unauthorized          | Invalid/missing JWT         | Check token in localStorage              |
| Cannot find module        | Wrong import path           | Check barrel exports/relative paths      |
| Database connection error | Wrong DATABASE_URL          | Verify `.env` credentials                |
| Component render error    | Missing context provider    | Wrap app with Context provider           |
| API timeout               | Long processing time        | Increase `VITE_API_TIMEOUT`              |
| Hot reload not working    | Wrong file pattern in watch | Check `nodemon.json` or `vite.config.ts` |

---

## 🌟 Pro Tips

1. **Use TypeScript** - Catch errors before runtime
2. **Create `index.ts` files** - Clean imports
3. **Separate concerns** - Don't mix layers
4. **Use constants** - DRY principle
5. **Error handling first** - Plan error scenarios
6. **Test early** - Unit test as you build
7. **Document** - Comment complex logic
8. **Logging** - Not just in development
9. **Validation** - Check inputs everywhere
10. **Performance** - Profile before optimizing

---

**Print this guide and keep it handy! 📄**
