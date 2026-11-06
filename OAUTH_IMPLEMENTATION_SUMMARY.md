# Google OAuth Implementation - Quick Summary

## ✅ What Was Created

### **Frontend Components**

1. **AuthCallback.tsx** (`/auth/callback`)
   - Receives token from backend URL: `?token=...&user=...`
   - Saves token + user to localStorage
   - Shows loading spinner
   - Redirects to homepage
   - **File**: `client/src/pages/AuthCallback.tsx`

2. **apiClient.ts** (API Utility)
   - Wraps fetch() requests
   - Auto-adds `Authorization: Bearer {token}` header
   - Handles 401 responses (token expired)
   - Type-safe JSON responses
   - **File**: `client/src/utils/apiClient.ts`

3. **useAuth.ts** (Custom Hook)
   - Checks localStorage for token on app load
   - Provides user, token, isAuthenticated state
   - Logout functionality
   - **File**: `client/src/hooks/useAuth.ts`

### **Backend Changes**

4. **auth.routes.ts** (Updated)
   - Changed from JSON response to redirect
   - Redirects to `http://localhost:3000/auth/callback?token=...&user=...`
   - Backend exchanges Google code for token internally
   - **File**: `server/src/routes/auth.routes.ts`

### **App Configuration**

5. **App.tsx** (Updated)
   - Added `/auth/callback` route
   - Route renders AuthCallback component
   - Hides header/footer on login page

---

## 🔄 Complete Flow

```
1. User clicks "Continue with Google"
        ↓
2. Frontend: window.location.href = "...auth/google"
        ↓
3. Backend: Initiates Google OAuth (Passport.js)
        ↓
4. Google: Shows login screen
        ↓
5. User: Approves permissions
        ↓
6. Google: Redirects back to backend with auth code
        ↓
7. Backend: Exchanges code for token, redirects to frontend
        ↓
8. Frontend (AuthCallback): Extracts token, saves to localStorage
        ↓
9. Frontend: Redirects to homepage
        ↓
10. App: useAuth() reads token, user is logged in
        ↓
11. All API calls: Include "Authorization: Bearer {token}"
```

---

## 📝 How to Use

### **Check if User is Logged In**
```typescript
import { useAuth } from "../hooks/useAuth";

function MyComponent() {
  const { user, isAuthenticated, logout } = useAuth();

  return isAuthenticated ? (
    <div>Welcome, {user?.name}</div>
  ) : (
    <div>Please log in</div>
  );
}
```

### **Make API Calls (Automatic Token)**
```typescript
import { apiCallJson } from "../utils/apiClient";

const orders = await apiCallJson("http://localhost:5000/orders");
// Token automatically included! No need to manually add it.
```

### **Logout User**
```typescript
const { logout } = useAuth();
<button onClick={logout}>Logout</button>
// Clears token, clears user, redirects to login
```

---

## 🔐 Security Features

✅ Token stored in localStorage  
✅ Sent with every API request automatically  
✅ Expired tokens trigger re-login  
✅ Token validated by backend on each request  
✅ User profile cached in localStorage  

---

## 📂 File Structure

```
client/
├── src/
│   ├── pages/
│   │   ├── LoginPage.tsx (updated - redirects with redirect_uri)
│   │   └── AuthCallback.tsx (NEW - handles redirect)
│   ├── hooks/
│   │   └── useAuth.ts (NEW - auth state management)
│   └── utils/
│       └── apiClient.ts (NEW - API with auto token)
├── App.tsx (updated - added /auth/callback route)
└── GOOGLE_OAUTH_FLOW.md (detailed explanation)

server/
└── src/
    └── routes/
        └── auth.routes.ts (updated - redirects instead of JSON)
```

---

## ✨ What Happens on Each Route

| Route | Component | Action |
|-------|-----------|--------|
| `/login` | LoginPage | Show Google button, redirect to auth/google |
| `/auth/google` | Backend Passport | Initiate Google OAuth |
| `/auth/google/callback` | Backend | Exchange code for token |
| `/auth/callback` | AuthCallback (Frontend) | Extract token, redirect to / |
| `/` | HomePage | Check auth with useAuth(), user is logged in |

---

## 🎯 End Result

1. **User logs in** → Goes through Google → Returns to your app
2. **Token saved** → In localStorage (persists across refreshes)
3. **Automatic headers** → Every API call includes token
4. **Session persistent** → User stays logged in until token expires
5. **Logout ready** → Use useAuth().logout() to sign out

---

## 🚀 Testing the Flow

1. Start both servers: `npm run dev` (in both client and server folders)
2. Go to `http://localhost:3000/login`
3. Click "Continue with Google"
4. Select your Google account
5. Approve permissions
6. Should redirect to homepage
7. Open browser DevTools → Application → LocalStorage
8. See `auth_token` and `user` saved
9. Check network tab → All requests have `Authorization` header

---

## 📚 Full Documentation

See `GOOGLE_OAUTH_FLOW.md` for:
- Detailed step-by-step explanation
- Code breakdown for each component
- Security features
- Common issues & solutions
- Future enhancements (refresh tokens, protected routes, etc.)
