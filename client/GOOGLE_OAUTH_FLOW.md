# Google OAuth Flow Implementation - Complete Explanation

## Architecture Overview

The Google OAuth flow has **4 main components**:

```
┌─────────────┐        ┌──────────────────┐        ┌─────────────┐
│   Frontend  │        │    Google Servers│        │   Backend   │
│  LoginPage  │◄──────►│   (OAuth 2.0)    │◄──────►│  Auth Route │
└─────────────┘        └──────────────────┘        └─────────────┘
       │                                                   │
       │                                                   │
       └──────────────┐        ┌────────────────────────────┘
                      │        │
                      ▼        ▼
                 ┌─────────────────────┐
                 │  Frontend Callback  │
                 │  AuthCallback.tsx   │
                 └─────────────────────┘
                      │
                      ▼
                   HomePage
```

---

## Step-by-Step Flow

### **Step 1: User Clicks "Continue with Google" (LoginPage.tsx)**

```typescript
const handleGoogleAuth = () => {
  window.location.href = "http://localhost:5000/auth/google?redirect_uri=http://localhost:3000/auth/callback";
};
```

**What happens:**
- Frontend redirects browser to backend's Google auth endpoint
- Includes `redirect_uri` parameter telling backend where to send user after Google approves
- Browser leaves your app entirely

---

### **Step 2: Backend Initiates Google OAuth (auth.routes.ts)**

```typescript
router.get("/google", 
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);
```

**What happens:**
- Passport.js library redirects to Google's OAuth consent screen
- User sees: "This app wants access to your email and profile"
- User logs in with Google account (if not already)
- User grants permissions to your app

---

### **Step 3: Google Redirects Back to Backend**

Google redirects to:
```
http://localhost:5000/auth/google/callback?code=4/0AUn6Hd_64f8HGzfYX3VCcge0LgtvWiBHGE8oggkqVXWW...&state=...
```

The `code` parameter contains authorization code (not the token yet)

---

### **Step 4: Backend Exchanges Code for Token (auth.routes.ts callback)**

**Before (what your server does internally):**
```typescript
router.get("/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    // Passport.js already:
    // 1. Took the "code" from URL
    // 2. Exchanged it with Google for tokens
    // 3. Fetched user profile from Google
    // 4. Created/updated user in your database
    // Result: req.user now contains the user object
    
    const token = createToken((req.user as any).id);  // Create JWT
    
    // UPDATED: Redirect to frontend callback
    const redirectUrl = new URL("http://localhost:3000/auth/callback");
    redirectUrl.searchParams.append("token", token);
    redirectUrl.searchParams.append("user", JSON.stringify(user));
    res.redirect(redirectUrl.toString());
  }
);
```

**What this does:**
1. Passport exchanges Google's auth code for tokens
2. Fetches user profile from Google
3. Looks up/creates user in your database
4. Creates a JWT token for your API
5. **Redirects browser to frontend** with token and user data

---

### **Step 5: Frontend AuthCallback Captures Token (AuthCallback.tsx)**

Browser is now at: `http://localhost:3000/auth/callback?token=eyJhbGc...&user={...}`

```typescript
function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");      // Extract from URL
    const userJson = searchParams.get("user");

    if (token) {
      localStorage.setItem("auth_token", token);  // Save token
      
      if (userJson) {
        const user = JSON.parse(userJson);
        localStorage.setItem("user", JSON.stringify(user)); // Save user
      }

      navigate("/", { replace: true });  // Redirect to homepage
    } else {
      navigate("/login", { replace: true }); // Error: no token
    }
  }, [searchParams, navigate]);

  return <LoadingSpinner />;  // Show "Completing login..." message
}
```

**What this does:**
1. Extracts `token` and `user` from URL query parameters
2. Saves them to `localStorage`
3. Redirects to homepage
4. Shows loading spinner while processing

---

### **Step 6: Frontend API Requests Include Token (apiClient.ts)**

After logging in, every API request includes the token:

```typescript
export async function apiCall(url: string, options: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem("auth_token");
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);  // Add to every request
  }

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {  // Token expired
    localStorage.removeItem("auth_token");
    window.location.href = "/login";  // Redirect to login
  }

  return response;
}
```

**Why this matters:**
- Backend validates token in each request
- Knows who the user is from the token
- Can return user-specific data (orders, profile, etc.)

---

### **Step 7: useAuth Hook Checks Token on App Load (useAuth.ts)**

When app starts, check if token exists:

```typescript
export function useAuth() {
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");
    const storedUser = localStorage.getItem("user");

    if (storedToken) {
      setToken(storedToken);  // User was previously logged in
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return {
    user,
    token,
    isAuthenticated: !!token,
    logout: () => { /* clear storage */ }
  };
}
```

**Why this matters:**
- Users don't need to log in every time they refresh the page
- Tokens persist across browser sessions (until they expire)
- If token expired, API calls return 401 and user is redirected to login

---

## Summary of New Files Created

### 1. **AuthCallback.tsx** (Frontend Callback Page)
- **Purpose**: Receives token from backend, saves to localStorage, redirects to homepage
- **Route**: `/auth/callback`
- **Triggered by**: Backend redirect after Google approves

### 2. **apiClient.ts** (API Utility)
- **Purpose**: Wraps fetch() to automatically add token to all requests
- **Features**:
  - Adds `Authorization: Bearer {token}` header
  - Handles 401 responses by redirecting to login
  - TypeScript types for JSON responses

### 3. **useAuth.ts** (Custom Hook)
- **Purpose**: Manages authentication state globally
- **Features**:
  - Loads token/user from localStorage on app startup
  - Provides logout function
  - Exposes `isAuthenticated` boolean for route guards

### 4. **Updated auth.routes.ts** (Backend)
- **Change**: Instead of returning JSON, now redirects to frontend callback with token in URL
- **Benefits**: Browser automatically follows redirect, token reaches frontend

---

## Complete Flow Diagram

```
User clicks "Continue with Google"
        ↓
Frontend: window.location.href = "http://localhost:5000/auth/google"
        ↓
Backend: Passport initiates Google OAuth flow
        ↓
Google: Shows login & consent screen
        ↓
User: Approves permissions
        ↓
Google: Redirects to http://localhost:5000/auth/google/callback?code=...
        ↓
Backend: 
  - Exchanges code for token from Google
  - Fetches user profile from Google
  - Creates JWT token
  - Redirects to http://localhost:3000/auth/callback?token=...&user=...
        ↓
Frontend AuthCallback.tsx:
  - Extracts token from URL
  - Saves to localStorage
  - Redirects to homepage
        ↓
Homepage loads:
  - useAuth() hook reads token from localStorage
  - App knows user is logged in
  - All API calls include Authorization header
```

---

## How to Use the New Components

### **In App.tsx** (Already added):
```typescript
import AuthCallback from "./pages/AuthCallback";

// In Routes:
<Route path="/auth/callback" element={<AuthCallback />} />
```

### **In other components** (To check if user is logged in):
```typescript
import { useAuth } from "../hooks/useAuth";

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      <p>Welcome, {user?.name}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### **In any component** (To make API calls):
```typescript
import { apiCallJson } from "../utils/apiClient";

async function getOrders() {
  const orders = await apiCallJson<Order[]>(
    "http://localhost:5000/orders",
    { method: "GET" }
  );
  return orders;
}
```

---

## Security Features Implemented

✅ **Token in localStorage** - Persists across sessions  
✅ **Authorization header** - Sent with every API request  
✅ **401 Handling** - Redirects to login if token expired  
✅ **Secure redirect** - Only redirects to frontend URL  
✅ **Error handling** - Catches parsing errors gracefully  

---

## What Happens on Logout

```typescript
const { logout } = useAuth();

logout(); // This:
// 1. Removes auth_token from localStorage
// 2. Removes user from localStorage
// 3. Redirects to /login
// 4. Next API request returns 401 (no token)
```

---

## Common Issues & Solutions

| Issue | Cause | Solution |
|-------|-------|----------|
| Token not saved | AuthCallback not triggered | Check `/auth/callback` route exists |
| Token not in requests | Using fetch() instead of apiCall() | Use `apiCallJson()` from apiClient.ts |
| Keep redirecting to login | Token expired | Backend needs to handle refresh tokens |
| User data not available | useAuth not called | Use `useAuth()` hook in component |
| 401 on every request | Token format wrong | Check JWT format: `Bearer {token}` |

---

## Next Steps (Optional Enhancements)

1. **Refresh Token Flow** - Automatically refresh expired tokens without re-login
2. **Protected Routes** - Redirect unauthenticated users to login
3. **Role-Based Access** - Show different UI based on user role
4. **User Profile Update** - Allow users to edit their profile
5. **Logout Everywhere** - Invalidate all tokens when user logs out
