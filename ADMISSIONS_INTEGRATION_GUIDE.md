# Admission Applications - Integration Guide

## Overview

This guide shows how to integrate the **Admission Applications** feature into your existing School ERP React application.

---

## Step 1: Prepare File Structure

### Create Directory

```bash
# Create the feature directory structure
mkdir -p frontend/src/features/admissions/pages
```

### Directory Layout

```
frontend/src/features/admissions/
├── pages/
│   ├── ApplicationsPage.jsx        # Main component
│   └── ApplicationsPage.css        # Component styling
└── [future directories]
    ├── components/                 # Sub-components (future)
    ├── contexts/                   # Context providers (future)
    ├── hooks/                      # Custom hooks (future)
    ├── services/                   # API services (future)
    └── styles/                     # Shared styles (future)
```

---

## Step 2: Add Files to Your Project

### Copy Component

```bash
# Copy the React component to your project
cp ApplicationsPage.jsx frontend/src/features/admissions/pages/
cp ApplicationsPage.css frontend/src/features/admissions/pages/
```

Or manually create the files and paste the content from:

- `ApplicationsPage.jsx` (from implementation)
- `ApplicationsPage.css` (from implementation)

---

## Step 3: Configure API URL

### Option A: Environment Variable (Recommended)

Create `.env` file in your React app root:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Or production:

```env
REACT_APP_API_URL=https://api.yourdomain.com/api
```

The component will automatically use: `process.env.REACT_APP_API_URL`

### Option B: Hardcode URL

In `ApplicationsPage.jsx`, update line 24:

```javascript
// Before
const API_BASE_URL =
  process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// After (if needed)
const API_BASE_URL = "http://your-api-url.com/api";
```

---

## Step 4: Set Up Routing

### In Your Main Router File

**Option 1: React Router v6**

```javascript
// In your main routing file (e.g., App.jsx or Router.jsx)
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ApplicationsPage from "./features/admissions/pages/ApplicationsPage";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Existing routes */}
        <Route path="/dashboard" element={<Dashboard />} />
        {/* New admissions route */}
        <Route path="/admissions" element={<ApplicationsPage />} />
        <Route path="/applications" element={<ApplicationsPage />} />{" "}
        {/* Alternative path */}
        {/* Other routes */}
      </Routes>
    </Router>
  );
}
```

**Option 2: React Router v5**

```javascript
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import ApplicationsPage from "./features/admissions/pages/ApplicationsPage";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/admissions" component={ApplicationsPage} />
        {/* Other routes */}
      </Switch>
    </Router>
  );
}
```

**Option 3: Next.js**

Create file: `pages/admissions.js` or `app/admissions/page.js`

```javascript
import ApplicationsPage from "@/features/admissions/pages/ApplicationsPage";

export default function AdminPage() {
  return <ApplicationsPage />;
}
```

---

## Step 5: Add Navigation Link

### Update Your Navigation Menu

**In your Header/Navigation component:**

```javascript
import { Link } from "react-router-dom";

export function Navigation() {
  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/students">Students</Link>
      <Link to="/admissions">Applications</Link> {/* NEW */}
      <Link to="/settings">Settings</Link>
    </nav>
  );
}
```

### In a Sidebar Menu

```javascript
const menuItems = [
  { label: "Dashboard", path: "/dashboard", icon: "📊" },
  { label: "Students", path: "/students", icon: "👨" },
  { label: "Applications", path: "/admissions", icon: "📋" }, // NEW
  { label: "Settings", path: "/settings", icon: "⚙️" },
];
```

---

## Step 6: Backend Integration

### Ensure Backend Routes are Registered

In your `backend/app.js`, verify admission routes are registered:

```javascript
// Check these lines exist in app.js
import admissionRoutes from "./routes/admissionRoutes.js";

// ...

app.use("/api/admissions", admissionRoutes);
```

### Verify Backend is Running

```bash
# In terminal
cd backend
npm start

# Should see output like:
# Available Endpoints:
#   GET    /api/admissions/stats
#   GET    /api/admissions/search?query=
#   GET    /api/admissions
#   GET    /api/admissions/:applicationId
```

---

## Step 7: CSS Integration

### Global Styles Impact

The `ApplicationsPage.css` file is self-contained and scoped to `.applications-page` class. It should not conflict with your existing styles.

### If You Have CSS Conflicts

You can scope the CSS further by modifying the component:

```javascript
// Add a unique class wrapper
return <div className="app-admissions-page">{/* existing content */}</div>;
```

Then update CSS selectors:

```css
.app-admissions-page { ... }
.app-admissions-page .statistics-section { ... }
```

### CSS Variables (Optional Enhancement)

Add to your global CSS:

```css
:root {
  --primary-color: #3498db;
  --success-color: #27ae60;
  --warning-color: #f39c12;
  --danger-color: #e74c3c;
  /* ... more variables */
}
```

---

## Step 8: Test the Integration

### 1. Start Backend Server

```bash
cd backend
npm start
```

### 2. Start Frontend Development Server

```bash
cd frontend
npm start
```

### 3. Navigate to Applications Page

Open browser and go to:

```
http://localhost:3000/admissions
```

### 4. Verify Functionality

**Check all features work:**

- ✓ Statistics cards load with numbers
- ✓ Search input accepts text
- ✓ Search button is clickable
- ✓ Results display in table
- ✓ Action buttons show correct text
- ✓ No console errors (F12)

---

## Step 9: Handle API Errors

### Optional: Add Error Boundary

Wrap the component in an Error Boundary:

```javascript
import React from "react";
import ApplicationsPage from "./features/admissions/pages/ApplicationsPage";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error in ApplicationsPage:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>Failed to load applications page. Please refresh.</div>;
    }

    return <ApplicationsPage />;
  }
}

export default ErrorBoundary;
```

Then use it:

```javascript
<Route
  path="/admissions"
  element={
    <ErrorBoundary>
      <ApplicationsPage />
    </ErrorBoundary>
  }
/>
```

---

## Step 10: Customize (Optional)

### Change Page Title

In `ApplicationsPage.jsx`, line 138:

```javascript
// Before
<h1>Applications</h1>

// After
<h1>Admission Applications</h1>
```

### Change Colors

In `ApplicationsPage.css`, update color variables:

```css
.stat-card-primary {
  border-left-color: #your-color;
}

.stat-card-primary .stat-value {
  color: #your-color;
}

.search-button {
  background: linear-gradient(135deg, #your-color1 0%, #your-color2 100%);
}
```

### Add Additional Features

Example: Add an "Export" button

```javascript
// Add to ApplicationsPage.jsx
const handleExport = () => {
  // Export results to CSV
  const csv = applications
    .map((app) => `${app.application_id},${app.student_name},${app.status}`)
    .join("\n");

  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "applications.csv";
  a.click();
};

// Add in results section
<button onClick={handleExport} className="export-button">
  Export Results
</button>;
```

---

## Troubleshooting Integration

### Issue 1: Component Not Found

```
Error: Module not found: Can't resolve './features/admissions/pages/ApplicationsPage'
```

**Solution:**

- Verify file path is correct
- Check file name matches exactly (case-sensitive on Linux/Mac)
- Ensure files are in correct directory structure

### Issue 2: API Calls Failing

```
Error: Failed to fetch http://localhost:5000/api/admissions/stats
```

**Solution:**

```bash
# Check backend is running
curl http://localhost:5000/api/health

# Check CORS configuration
# Verify CORS_ORIGIN in backend .env matches frontend URL
```

### Issue 3: Statistics Not Loading

```
Data shows 0 for all counts
```

**Solution:**

```bash
# Verify database has data
psql -U postgres -d admission -c "SELECT COUNT(*) FROM admission;"

# Run database setup if needed
node backend/setup-db.js
```

### Issue 4: Styling Issues

```
Components look misaligned or broken
```

**Solution:**

- Check CSS file is loaded (Network tab in DevTools)
- Verify no CSS conflicts with global styles
- Check browser console for CSS errors
- Clear browser cache (Ctrl+Shift+Delete)

### Issue 5: CORS Errors

```
Access to XMLHttpRequest blocked by CORS policy
```

**Solution:**

1. Check `.env` file has correct CORS_ORIGIN:

```env
CORS_ORIGIN=http://localhost:3000
```

2. Or update in `backend/app.js`:

```javascript
app.use(
  cors({
    origin: "*", // Allow all (development only)
    credentials: true,
  }),
);
```

---

## Production Deployment

### 1. Environment Variables

Update `.env` for production:

```env
# Backend
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com

# Frontend
REACT_APP_API_URL=https://yourdomain.com/api
```

### 2. Build Frontend

```bash
npm run build
```

### 3. Start Backend

```bash
npm start
```

### 4. Serve Frontend

```bash
# Option 1: Use static server
serve -s build

# Option 2: Use production server (e.g., Nginx)
# Configure reverse proxy to backend
```

### 5. Verify Production URLs

- Update database connection strings
- Verify CORS settings
- Test all API endpoints
- Check error handling

---

## Performance Optimization

### Frontend Optimization

```javascript
// Add lazy loading
import { lazy, Suspense } from "react";

const ApplicationsPage = lazy(
  () => import("./features/admissions/pages/ApplicationsPage"),
);

// In routing
<Suspense fallback={<div>Loading...</div>}>
  <ApplicationsPage />
</Suspense>;
```

### Backend Optimization

```javascript
// Add caching headers (in server.js)
app.use((req, res, next) => {
  if (req.path.includes("/stats")) {
    res.set("Cache-Control", "max-age=300"); // 5 minutes
  }
  next();
});
```

---

## Security Considerations

### CORS Configuration

```javascript
// Don't use * in production
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  }),
);
```

### API Authentication (Future)

```javascript
// Add token validation
const validateToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ success: false });
  // Verify token...
  next();
};

// Apply to routes
router.get("/stats", validateToken, getStats);
```

---

## Monitoring & Logging

### Dashboard Integration

Add stats to your main dashboard:

```javascript
import { useEffect, useState } from "react";

export function StatsWidget() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/admissions/stats`)
      .then((r) => r.json())
      .then((d) => d.success && setStats(d.data));
  }, []);

  return (
    <div className="widget">
      <h3>Admission Stats</h3>
      {stats && (
        <p>
          Total: {stats.total}, Submitted: {stats.submitted}
        </p>
      )}
    </div>
  );
}
```

---

## Next Steps

1. ✅ Copy files to project
2. ✅ Configure API URL
3. ✅ Add routing
4. ✅ Add navigation link
5. ✅ Test functionality
6. ✅ Customize as needed
7. ✅ Deploy to production

---

## Support Resources

- **Main Documentation:** `ADMISSIONS_IMPLEMENTATION.md`
- **API Reference:** `ADMISSIONS_API_REFERENCE.md`
- **Testing Guide:** `ADMISSIONS_TESTING_GUIDE.md`
- **Quick Setup:** `ADMISSIONS_QUICK_SETUP.md`
- **Component README:** `README_ADMISSIONS.md`

---

**Version:** 1.0  
**Last Updated:** 2026-03-06  
Status: Ready for Integration ✅
