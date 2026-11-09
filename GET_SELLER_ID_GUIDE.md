# How to Get Seller ID from localStorage

This guide explains how to retrieve the seller ID from localStorage in your e-commerce application.

## 📍 Quick Answer

Use the **`getCurrentSellerId()`** utility function:

```tsx
import { getCurrentSellerId } from "../../utils/currentSeller";

// In your component or function
const sellerId = getCurrentSellerId();

if (!sellerId) {
  console.error("Seller ID not found");
  return;
}

// Use sellerId to fetch data
const orders = await fetchSellerOrders(sellerId);
```

---

## 🔧 Available Utility Functions

The `src/utils/currentSeller.ts` file provides several helper functions:

### 1. **getCurrentSellerId()** - Get Seller ID
```tsx
import { getCurrentSellerId } from "../../utils/currentSeller";

const sellerId = getCurrentSellerId();
// Returns: string | null
```
- Returns the seller's ID
- Tries multiple approaches to find the ID
- Returns `null` if not found
- Logs warnings if ID cannot be found

### 2. **getCurrentUserId()** - Get User ID
```tsx
import { getCurrentUserId } from "../../utils/currentSeller";

const userId = getCurrentUserId();
// Returns: string | null
```
- Returns the current user's ID
- Parses the user object from localStorage

### 3. **getCurrentUser()** - Get Full User Object
```tsx
import { getCurrentUser } from "../../utils/currentSeller";

const user = getCurrentUser();
// Returns: StoredUser | null
```
- Returns the entire user object
- Includes id, email, role, and other fields

### 4. **getCurrentSeller()** - Get Seller Object
```tsx
import { getCurrentSeller } from "../../utils/currentSeller";

const seller = getCurrentSeller();
// Returns: StoredSeller | null
```
- Returns the user object as a seller
- Type is `StoredSeller` which may include `sellerId` field

---

## 📦 localStorage Data Structure

The user data is stored in localStorage under the key `"user"` as a JSON string:

```json
{
  "id": "user-123",
  "email": "seller@example.com",
  "role": "SELLER",
  "sellerId": "seller-456",
  "storeName": "My Store",
  ...other fields
}
```

### What gets stored:
- `id` - User ID
- `sellerId` - Seller ID (if user is a seller)
- `email` - User's email
- `role` - User role (USER, SELLER, ADMIN)
- Other user-related fields

---

## 🚀 Real-World Example: SellerOrdersPage

Here's how it's implemented in the `SellerOrdersPage.tsx`:

```tsx
import { useState, useEffect } from "react";
import { getCurrentSellerId } from "../../utils/currentSeller";
import { fetchSellerOrders } from "./SellerHelper";

function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        // Get seller ID from localStorage
        const sellerId = getCurrentSellerId();
        
        // Check if seller ID exists
        if (!sellerId) {
          throw new Error("Seller ID not found. Please log in as a seller.");
        }

        console.log("Fetching orders for seller:", sellerId);
        
        // Fetch orders using seller ID
        const data = await fetchSellerOrders(sellerId);
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch orders");
      }
    };

    loadOrders();
  }, []);

  return (
    // ... render orders
  );
}
```

---

## ✅ Error Handling

Always check if `sellerId` is null before using it:

```tsx
const sellerId = getCurrentSellerId();

// ❌ BAD - will crash if sellerId is null
const orders = await fetchSellerOrders(sellerId);

// ✅ GOOD - check first
if (!sellerId) {
  setError("Seller not found. Please log in.");
  return;
}
const orders = await fetchSellerOrders(sellerId);
```

---

## 🔍 How It Works

The `getCurrentSellerId()` function uses this logic:

```
1. Get user object from localStorage
   ↓
2. Try to get direct sellerId field
   ↓
3. If not found, use user ID as fallback
   ↓
4. Return ID or null
```

### Pseudocode:
```typescript
function getCurrentSellerId(): string | null {
  const user = localStorage.getItem("user");
  
  if (!user) return null;
  
  const parsed = JSON.parse(user);
  
  // Try direct sellerId first
  if (parsed.sellerId) return parsed.sellerId;
  
  // Fall back to user ID
  if (parsed.id) return parsed.id;
  
  return null;
}
```

---

## 📋 Type Definitions

The utility file includes TypeScript types:

```typescript
interface StoredUser {
  id: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

interface StoredSeller extends StoredUser {
  sellerId?: string;
}
```

Use these types for type-safe code:

```tsx
import { getCurrentSeller } from "../../utils/currentSeller";
import type { StoredSeller } from "../../utils/currentSeller";

const seller: StoredSeller | null = getCurrentSeller();

if (seller) {
  console.log(seller.id);      // ✅ Type safe
  console.log(seller.sellerId); // ✅ Type safe
  console.log(seller.email);    // ✅ Type safe
}
```

---

## 🎯 Common Use Cases

### 1. Fetch Seller Orders
```tsx
const sellerId = getCurrentSellerId();
if (!sellerId) return;

const orders = await fetchSellerOrders(sellerId);
setOrders(orders);
```

### 2. Fetch Seller Products
```tsx
const sellerId = getCurrentSellerId();
if (!sellerId) return;

const products = await fetchSellerProducts(sellerId);
setProducts(products);
```

### 3. Fetch Seller Profile
```tsx
const sellerId = getCurrentSellerId();
if (!sellerId) return;

const seller = await fetchSeller(sellerId);
setSellerInfo(seller);
```

### 4. Check if User is Seller
```tsx
const sellerId = getCurrentSellerId();
const isSeller = !!sellerId;

if (isSeller) {
  // Show seller features
} else {
  // Show buyer features
}
```

### 5. Update Seller Data
```tsx
const sellerId = getCurrentSellerId();
if (!sellerId) return;

const updatedSeller = await updateSeller(sellerId, data);
```

---

## 🔐 Security Considerations

### localStorage stores data in plain text:
- ✅ Safe for non-sensitive IDs
- ✅ Safe for session tokens (passed in Authorization header)
- ❌ Never store passwords in localStorage
- ❌ Never store credit card info in localStorage

### Current implementation is safe:
- Stores only IDs and basic user info
- Token is stored separately for API auth
- No sensitive data stored

---

## 🐛 Troubleshooting

### Problem: `getCurrentSellerId()` returns null

**Cause 1:** User not logged in
```tsx
// Check if user exists
const user = getCurrentUser();
if (!user) {
  // Navigate to login
}
```

**Cause 2:** User is not a seller
```tsx
// Check user role
const user = getCurrentUser();
if (user?.role !== "SELLER") {
  // Show error message
}
```

**Cause 3:** User object is corrupted
```tsx
// Try to get raw data
const rawUser = localStorage.getItem("user");
console.log("Raw user data:", rawUser);
```

### Problem: `sellerId` doesn't match backend

**Solution:** Verify the field name
```tsx
// Check what's actually stored
const user = getCurrentUser();
console.log("User object:", user);
console.log("Available fields:", Object.keys(user || {}));
```

---

## 📂 File Location

```
src/utils/
├── currentUser.ts    ← User utilities
└── currentSeller.ts  ← Seller utilities ← YOU ARE HERE
```

---

## 🔗 Related Files

- **Usage:** `src/pages/seller/SellerOrdersPage.tsx`
- **API Helper:** `src/pages/seller/SellerHelper.ts`
- **User Utils:** `src/utils/currentUser.ts`
- **Type Definitions:** `src/types/seller.ts`

---

## ✨ Best Practices

1. **Always check for null:**
   ```tsx
   const sellerId = getCurrentSellerId();
   if (!sellerId) return handleError();
   ```

2. **Use the right function:**
   - `getCurrentSellerId()` - for just the ID
   - `getCurrentSeller()` - for full seller object
   - `getCurrentUser()` - for user object

3. **Log for debugging:**
   ```tsx
   const sellerId = getCurrentSellerId();
   console.log("Seller ID:", sellerId);
   ```

4. **Handle errors gracefully:**
   ```tsx
   const sellerId = getCurrentSellerId();
   if (!sellerId) {
     setError("Please log in as a seller");
     return;
   }
   ```

5. **Use TypeScript types:**
   ```tsx
   import type { StoredSeller } from "../../utils/currentSeller";
   
   const seller: StoredSeller | null = getCurrentSeller();
   ```

---

## 📞 Summary

| Task | Function | Returns |
|------|----------|---------|
| Get seller ID | `getCurrentSellerId()` | `string \| null` |
| Get user ID | `getCurrentUserId()` | `string \| null` |
| Get full user | `getCurrentUser()` | `StoredUser \| null` |
| Get seller data | `getCurrentSeller()` | `StoredSeller \| null` |

---

**Status:** ✅ Ready to use  
**Last Updated:** 2026-11-08  
**File:** `src/utils/currentSeller.ts`
