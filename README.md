# School ERP - Full-Stack Web Application

A professional, scalable, feature-based architecture for a full-stack web application built with **React**, **Node.js/Express**, and **PostgreSQL**.

## 🎯 Project Architecture

This project follows a **feature-based architecture** (vertical slices) instead of traditional layer-based structure. Each feature is self-contained and includes all necessary components for that domain.

```
Frontend (React)           Backend (Node.js/Express)    Database (PostgreSQL)
┌──────────────────┐       ┌──────────────────┐         ┌──────────────┐
│   components     │       │   controller     │────────→│   Tables     │
│   pages          │──────→│   service        │         │   Views      │
│   services       │       │   model          │         │   Functions  │
│   hooks          │       │   routes         │         │              │
│   context        │       │                  │         │              │
└──────────────────┘       └──────────────────┘         └──────────────┘
```

## 📁 Project Structure

### Key Folders:

```
school_erp/
│
├── frontend/                           # React Application
│   └── src/features/
│       ├── auth/                       # Authentication module
│       ├── users/                      # User management module
│       ├── products/                   # Product module (template)
│       └── orders/                     # Order module (template)
│
├── backend/                            # Node.js/Express Application
│   └── src/features/
│       ├── auth/                       # Authentication module
│       ├── users/                      # User management module
│       ├── products/                   # Product module (template)
│       └── orders/                     # Order module (template)
│
├── PROJECT_STRUCTURE.md                # Detailed architecture docs
├── IMPLEMENTATION_GUIDE.md             # Step-by-step implementation guide
├── QUICK_REFERENCE.md                  # Quick reference & checklists
└── README.md                           # This file
```

## 🚀 Quick Start

### Prerequisites

- Node.js v16+
- PostgreSQL v12+
- npm or yarn

### Backend Setup

```bash
cd backend
npm install

# Create .env file
cp .env.example .env

# Update .env with your PostgreSQL credentials:
# DB_HOST=localhost
# DB_PORT=5432
# DB_NAME=school_erp
# DB_USER=postgres
# DB_PASSWORD=your_password

# Run migrations
npm run migrate

# Start development server
npm run dev
```

Server runs on: `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install

# Create .env file
cp .env.example .env

# Update .env with your API URL:
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev
```

App runs on: `http://localhost:3000` (or `http://localhost:5173` with Vite)

## 📚 Documentation

### 📖 [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)

Comprehensive guide covering:

- Full folder structure explanation
- Component responsibility
- Data flow architecture
- Best practices
- Technologies used

### 🛠️ [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md)

Step-by-step implementation examples:

- Database setup
- Feature implementation (Auth example)
- API service creation
- Custom hooks
- State management
- Adding new features
- Common patterns

### ⚡ [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

Quick guides:

- Architecture overview diagram
- Data flow examples
- Folder quick reference
- Key files checklist
- Naming conventions
- Debugging tips
- Common errors & solutions

## 🏗️ Architecture Principles

### 1. Feature-Based Organization

Each feature (auth, users, products) is self-contained with:

- **Controller** - Request handler
- **Service** - Business logic
- **Model** - Database layer
- **Routes** - API endpoints
- **Validation** - Input schemas
- **Tests** - Unit & integration tests

### 2. Clear Layer Separation

**Backend Flow:**

```
Request → Routes → Controller → Service → Model → Database → Response
```

**Frontend Flow:**

```
User Interaction → Component → Hook → Service → API → Backend
```

### 3. Separation of Concerns

- **Controllers** - Parse requests, call services
- **Services** - Business logic, data processing
- **Models** - Database queries only
- **Components** - UI rendering only
- **Hooks** - Logic that doesn't need React
- **Services** - API calls, external integrations

### 4. Scalability & Maintainability

- Add new features without modifying existing ones
- Easy to test individual layers
- Clear responsibility for each module
- Minimal circular dependencies
- Type-safe with TypeScript

## 🔧 Technology Stack

### Frontend

- **React** - UI library
- **TypeScript** - Type safety
- **Vite/Webpack** - Build tool
- **React Router** - Routing
- **Context API/Redux** - State management
- **Axios/Fetch** - HTTP client
- **CSS Modules/Styled Components** - Styling

### Backend

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Sequelize/TypeORM/Knex** - ORM
- **TypeScript** - Type safety
- **Jest** - Testing framework
- **JWT** - Authentication
- **Joi/Zod** - Validation

### DevOps

- **Git** - Version control
- **Docker** - Containerization (optional)
- **GitHub Actions** - CI/CD (optional)

## 📋 Feature Template

### Adding a New Feature

#### Backend Feature Structure

```
backend/src/features/featureName/
├── controller/
│   └── featureNameController.ts
├── service/
│   └── featureNameService.ts
├── routes/
│   └── featureNameRoutes.ts
├── model/
│   └── FeatureName.ts
├── validation/
│   └── featureNameValidation.ts
└── tests/
    └── featureName.test.ts
```

#### Frontend Feature Structure

```
frontend/src/features/featureName/
├── components/
├── pages/
├── services/
├── hooks/
├── context/
├── styles/
├── types/
└── index.tsx
```

## 🔐 Security Considerations

- ✅ Environment variables for sensitive data
- ✅ JWT for authentication
- ✅ CORS configuration
- ✅ Input validation & sanitization
- ✅ Password hashing (bcrypt)
- ✅ Rate limiting
- ✅ Error messages without stack traces in production
- ✅ HTTPS in production
- ✅ Database connection pooling

## 🧪 Testing Strategy

### Backend Testing

```bash
npm test                    # Run all tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
```

### Frontend Testing

```bash
npm test                    # Run tests
npm run test:watch         # Watch mode
npm run test:coverage      # Coverage report
```

## 📦 Deployment

### Backend Deployment

```bash
npm run build
NODE_ENV=production npm start

# Or use Docker
docker build -t school-erp-backend .
docker run -p 5000:5000 --env-file .env school-erp-backend
```

### Frontend Deployment

```bash
npm run build
npm start  # Serve dist/ folder

# Or deploy dist/ to static hosting (Netlify, Vercel, AWS S3)
```

## 🔄 Development Workflow

### 1. Create a new feature

```bash
backend/src/features/newFeature/
frontend/src/features/newFeature/
```

### 2. Implement in order

- Backend: Model → Validation → Service → Controller → Routes
- Frontend: Service → Hooks → Components → Pages

### 3. Test

- Write unit tests for services
- Write integration tests for features
- Manual testing in application

### 4. Deploy

- Commit to git
- Push to staging/production branch
- CI/CD pipeline runs tests
- Deploy to production

## 📝 Environment Variables

### Backend (.env)

```
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/school_erp
JWT_SECRET=your_secret_key
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env)

```
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=School ERP
```

## 🤝 Contributing

1. Create a new branch for your feature
2. Follow the naming conventions
3. Write tests for new features
4. Submit a pull request
5. Ensure all tests pass

## 📞 Support

For issues or questions, refer to:

- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - Architecture details
- [IMPLEMENTATION_GUIDE.md](./IMPLEMENTATION_GUIDE.md) - Implementation examples
- [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) - Quick answers

## 📄 License

This project is MIT licensed.

## 🎓 Learning Resources

- [React Patterns](https://react-patterns.com/)
- [Express.js Best Practices](https://expressjs.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Feature-Driven Development](https://en.wikipedia.org/wiki/Feature-driven_development)
- [REST API Best Practices](https://restfulapi.net/)

---

**Created:** March 2026

**Architecture:** Feature-Based Vertical Slices

**Status:** 🟢 Ready for Development

---

### Next Steps:

1. ✅ Review `PROJECT_STRUCTURE.md` to understand the architecture
2. ✅ Follow `IMPLEMENTATION_GUIDE.md` to build features
3. ✅ Set up database and migration files
4. ✅ Implement authentication feature (provided in guide)
5. ✅ Add your business logic
6. ✅ Write tests
7. ✅ Deploy to production

**Happy coding! 🚀**
