# Admission Applications - Quick Setup Guide

## ⚡ Quick Start (5 Minutes)

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install pg dotenv cors express

# Check environment variables
# Ensure .env file exists with database credentials
cat .env

# Start the server
npm start
```

**Expected output:**

```
┌─────────────────────────────────────────────────┐
│  School ERP Backend Server Started Successfully │
├─────────────────────────────────────────────────┤
│ Server:      http://localhost:5000              │
│ Environment: DEVELOPMENT                        │
│ Database:    admission@localhost                │
│ Health Check: GET /api/health                   │
└─────────────────────────────────────────────────┘
```

### 2. Quick Test

```bash
# Test health check
curl http://localhost:5000/api/health

# Test admission statistics
curl http://localhost:5000/api/admissions/stats
```

### 3. Frontend Integration

```bash
# In your React app, create the component:
# src/features/admissions/pages/ApplicationsPage.jsx
# src/features/admissions/pages/ApplicationsPage.css

# In your router, add:
import ApplicationsPage from './features/admissions/pages/ApplicationsPage';

<Route path="/admissions" element={<ApplicationsPage />} />
```

### 4. Verify

Navigate to `http://localhost:3000/admissions` and verify:

- ✓ Statistics cards load
- ✓ Search works
- ✓ Results display in table

---

## 📋 Setup Checklist

### Database

- [ ] PostgreSQL installed and running
- [ ] Database "admission" created
- [ ] Tables created from schema.sql
- [ ] Sample data populated
- [ ] Verify with: `psql -U postgres -d admission -c "\dt"`

### Backend Files

- [ ] `backend/services/admissionService.js` created
- [ ] `backend/controllers/admissionController.js` created
- [ ] `backend/routes/admissionRoutes.js` created
- [ ] `backend/app.js` updated with admission routes
- [ ] `backend/server.js` updated with ES modules
- [ ] `backend/.env` configured with database credentials

### Backend Dependencies

- [ ] `npm install pg` (PostgreSQL driver)
- [ ] `npm install dotenv` (Environment variables)
- [ ] `npm install cors` (Cross-origin requests)
- [ ] `npm install express` (Web framework)

### Frontend Files

- [ ] `src/features/admissions/pages/ApplicationsPage.jsx` created
- [ ] `src/features/admissions/pages/ApplicationsPage.css` created
- [ ] Component imported in routing
- [ ] API base URL configured

### Testing

- [ ] Backend server starts without errors
- [ ] Health check endpoint responds: `GET /api/health`
- [ ] Statistics endpoint works: `GET /api/admissions/stats`
- [ ] Search endpoint works: `GET /api/admissions/search?query=aarav`
- [ ] React page loads without console errors
- [ ] Statistics cards display numbers
- [ ] Search functionality works

---

## 🔧 Configuration

### Backend .env File

```env
# Server Configuration
NODE_ENV=development
PORT=5000
HOST=localhost

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=tanmay@123
DB_NAME=admission

# Connection Pool
DB_POOL_MIN=2
DB_POOL_MAX=10

# Frontend URL
CORS_ORIGIN=http://localhost:3000
```

### Frontend .env File

```env
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 🚀 Running the Application

### Terminal 1: Start Backend Server

```bash
cd backend
npm start
```

### Terminal 2: Start Frontend Development Server

```bash
cd frontend
npm start
```

### Access the Application

- **Frontend:** http://localhost:3000
- **Admissions Page:** http://localhost:3000/admissions
- **API Base:** http://localhost:5000/api

---

## 📁 File Structure

```
school_erp/
├── backend/
│   ├── config/
│   │   └── db.js                     # Database connection
│   ├── controllers/
│   │   └── admissionController.js    # NEW ✨
│   ├── services/
│   │   └── admissionService.js       # NEW ✨
│   ├── routes/
│   │   └── admissionRoutes.js        # NEW ✨
│   ├── app.js                        # UPDATED ✨
│   ├── server.js                     # UPDATED ✨
│   ├── .env
│   └── package.json
│
├── frontend/
│   └── src/
│       └── features/
│           └── admissions/           # NEW ✨
│               └── pages/
│                   ├── ApplicationsPage.jsx      # NEW ✨
│                   └── ApplicationsPage.css      # NEW ✨
│
└── Documentation/
    ├── ADMISSIONS_IMPLEMENTATION.md              # NEW ✨
    ├── ADMISSIONS_API_REFERENCE.md               # NEW ✨
    └── ADMISSIONS_TESTING_GUIDE.md               # NEW ✨
```

---

## 🧪 Testing the APIs

### Test 1: Statistics

```bash
curl http://localhost:5000/api/admissions/stats
```

### Test 2: Search

```bash
curl "http://localhost:5000/api/admissions/search?query=aarav"
```

### Test 3: List All

```bash
curl "http://localhost:5000/api/admissions?limit=10&offset=0"
```

### Test 4: Details

```bash
curl "http://localhost:5000/api/admissions/APP001"
```

---

## 🐛 Troubleshooting

### Backend Won't Start

**Error:** `Cannot find module 'pg'`

```bash
npm install pg dotenv
```

**Error:** Database connection failed

```bash
# Verify .env file exists and has correct credentials
cat backend/.env

# Test database connection
psql -U postgres -d admission -c "SELECT COUNT(*) FROM admission;"
```

**Error:** Port 5000 already in use

```bash
# Find and kill process using port 5000
# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

### Frontend Won't Connect

**Error:** CORS errors in console

- Check `CORS_ORIGIN` in backend `.env`
- Should be `http://localhost:3000` for development

**Error:** "API request failed"

- Verify backend is running: `curl http://localhost:5000/api/health`
- Check API URL in frontend code

### No Results in Search

**Issue:** Search returns empty

1. Verify database has data:
   ```bash
   psql -U postgres -d admission -c "SELECT COUNT(*) FROM admission;"
   ```
2. Check if student records exist:
   ```bash
   psql -U postgres -d admission -c "SELECT * FROM student LIMIT 1;"
   ```
3. Try different search terms

---

## 📈 Performance Tips

### Database Optimization

```sql
-- Create indexes for faster searches
CREATE INDEX idx_admission_status ON admission(status);
CREATE INDEX idx_student_first_name ON student(first_name);
CREATE INDEX idx_student_last_name ON student(last_name);
CREATE INDEX idx_parent_father_mobile ON parent_detail(father_mobile);
CREATE INDEX idx_parent_mother_mobile ON parent_detail(mother_mobile);
```

### Frontend Performance

1. Cache statistics (refresh every 5 minutes)
2. Debounce search input (300ms delay)
3. Implement virtual scrolling for large tables
4. Use React.memo for stat cards

### Backend Performance

1. Use connection pooling (already configured)
2. Limit search results to 100
3. Add pagination to list endpoints
4. Consider query result caching

---

## 📚 Key Endpoints

| Endpoint                 | Method | Purpose              |
| ------------------------ | ------ | -------------------- |
| `/api/admissions/stats`  | GET    | Get statistics       |
| `/api/admissions/search` | GET    | Search admissions    |
| `/api/admissions`        | GET    | List all (paginated) |
| `/api/admissions/:id`    | GET    | Get details          |

---

## 🔒 Security Considerations

### SQL Injection Prevention

- ✓ All queries use parameterized statements with `$1`, `$2`, etc.
- ✓ No string concatenation in SQL queries

### CORS Configuration

- ✓ CORS origin is restricted to frontend URL
- ✓ Update CORS_ORIGIN in .env for different environments

### Input Validation

- ✓ Query parameters validated
- ✓ Invalid limits rejected (1-100)
- ✓ Empty search queries handled

### Error Handling

- ✓ Generic error messages in production
- ✓ Detailed logs in development
- ✓ No sensitive data in responses

---

## 📞 Support

### Common Issues & Solutions

| Issue                   | Solution                                         |
| ----------------------- | ------------------------------------------------ |
| Port already in use     | Change PORT in .env or kill process on port 5000 |
| CORS error in browser   | Update CORS_ORIGIN in .env                       |
| No database results     | Run setup-db.js and verify data exists           |
| Slow search             | Add database indexes (see SQL section)           |
| Component not rendering | Check import path and React Router setup         |

### Debugging

**Enable debug logs:**

```javascript
// In backend
console.log("DEBUG:", query, parameters);

// In frontend
console.log("API Response:", data);
```

**Check database directly:**

```bash
psql -U postgres -d admission
\dt                          # List tables
SELECT * FROM admission;     # View admissions
SELECT * FROM student;       # View students
```

---

## 🎯 Next Steps

1. **Setup Backend** - Follow backend setup steps
2. **Create Frontend Component** - Copy ApplicationsPage.jsx and CSS
3. **Test APIs** - Run curl tests to verify endpoints work
4. **Test Frontend** - Navigate to component and test search
5. **Deploy** - Follow deployment guide for production

---

## 📖 Documentation Files

- **ADMISSIONS_IMPLEMENTATION.md** - Complete technical documentation
- **ADMISSIONS_API_REFERENCE.md** - API endpoint quick reference
- **ADMISSIONS_TESTING_GUIDE.md** - Comprehensive testing guide
- **ADMISSIONS_QUICK_SETUP.md** - This file (quick start guide)

---

**Version:** 1.0  
**Last Updated:** 2026-03-06  
**Status:** Ready for Development
