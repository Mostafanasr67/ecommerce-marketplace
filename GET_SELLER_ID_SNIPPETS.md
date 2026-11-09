# Get Seller ID - Quick Snippets

Copy-paste ready code snippets for getting seller ID from localStorage.

## 🚀 Quickest Way

```tsx
import { getCurrentSellerId } from "../../utils/currentSeller";

const sellerId = getCurrentSellerId();
```

---

## 📋 Snippets by Use Case

### 1. Get Seller ID (Simplest)
```tsx
import { getCurrentSellerId } from "../../utils/currentSeller";

const sellerId = getCurrentSellerId();
if (!sellerId) {
  console.error("No seller found");
  return;
}

// Use it
console.log(sellerId); // "seller-123"
```

### 2. In a Component (SellerOrdersPage Pattern)
```tsx
import { useEffect, useState } from "react";
import { getCurrentSellerId } from "../../utils/currentSeller";
import { fetchSellerOrders } from "./SellerHelper";

function MyComponent() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const sellerId = getCurrentSellerId();
        if (!sellerId) {
          throw new Error("Seller not found");
        }
        
        const result = await fetchSellerOrders(sellerId);
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error");
      }
    };

    loadData();
  }, []);

  // ... render component
}
```

### 3. With Type Safety
```tsx
import { getCurrentSeller } from "../../utils/currentSeller";
import type { StoredSeller } from "../../utils/currentSeller";

const seller: StoredSeller | null = getCurrentSeller();

if (seller?.id) {
  const sellerId: string = seller.id;
  // Now sellerId is definitely a string
}
```

### 4. Multiple Sellers Check
```tsx
import { getCurrentSellerId, getCurrentSeller } from "../../utils/currentSeller";

const sellerId = getCurrentSellerId();
const seller = getCurrentSeller();

if (sellerId !== seller?.sellerId && sellerId !== seller?.id) {
  console.warn("Seller ID mismatch");
}
```

### 5. With Error Handling
```tsx
import { getCurrentSellerId } from "../../utils/currentSeller";

function getSellerId(): string {
  const sellerId = getCurrentSellerId();
  
  if (!sellerId) {
    throw new Error("Seller not found in localStorage. Please log in.");
  }
  
  return sellerId;
}

// Usage
try {
  const sellerId = getSellerId();
  // Use sellerId...
} catch (error) {
  console.error(error);
  // Redirect to login
}
```

### 6. In API Calls
```tsx
import { getCurrentSellerId } from "../../utils/currentSeller";

async function loadSellerData() {
  const sellerId = getCurrentSellerId();
  
  if (!sellerId) {
    console.error("No seller ID");
    return null;
  }

  const response = await fetch(`/api/seller/${sellerId}/orders`);
  return response.json();
}
```

### 7. In Route Guard
```tsx
import { getCurrentSellerId } from "../../utils/currentSeller";

function SellerRoute({ children }) {
  const sellerId = getCurrentSellerId();

  if (!sellerId) {
    return <div>Please log in as a seller</div>;
  }

  return children;
}
```

### 8. Store in State
```tsx
import { useEffect, useState } from "react";
import { getCurrentSellerId } from "../../utils/currentSeller";

function MyComponent() {
  const [sellerId, setSellerId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = getCurrentSellerId();
    setSellerId(id);
    setLoading(false);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (!sellerId) return <div>Not a seller</div>;

  return <div>Seller ID: {sellerId}</div>;
}
```

---

## ⚡ One-Liners

### Get ID and use immediately
```tsx
const orders = await fetchSellerOrders(getCurrentSellerId() || "");
```

### Check if user is seller
```tsx
const isSeller = !!getCurrentSellerId();
```

### Log seller info
```tsx
console.log("Seller:", getCurrentSeller());
```

### Get fallback value
```tsx
const sellerId = getCurrentSellerId() ?? "default-seller";
```

---

## 🔍 Debugging Snippets

### See what's in localStorage
```tsx
console.log("User in localStorage:", localStorage.getItem("user"));
```

### Parse and inspect
```tsx
const user = JSON.parse(localStorage.getItem("user") || "{}");
console.log("User object:", user);
console.log("Seller ID:", user.sellerId || user.id);
```

### Test the function
```tsx
import { getCurrentSellerId, getCurrentSeller } from "../../utils/currentSeller";

console.log("Seller ID:", getCurrentSellerId());
console.log("Seller object:", getCurrentSeller());
console.log("User ID:", getCurrentUserId());
```

### Check all available methods
```tsx
import * as sellerUtils from "../../utils/currentSeller";
console.log("Available functions:", Object.keys(sellerUtils));
```

---

## 📦 Import Variations

### Single import
```tsx
import { getCurrentSellerId } from "../../utils/currentSeller";
```

### Multiple imports
```tsx
import { 
  getCurrentSellerId, 
  getCurrentSeller, 
  getCurrentUserId 
} from "../../utils/currentSeller";
```

### With types
```tsx
import { getCurrentSeller } from "../../utils/currentSeller";
import type { StoredSeller } from "../../utils/currentSeller";

const seller: StoredSeller | null = getCurrentSeller();
```

### Namespace import
```tsx
import * as currentSeller from "../../utils/currentSeller";

const sellerId = currentSeller.getCurrentSellerId();
```

---

## ❌ DON'T Do This

```tsx
// ❌ Bad: Directly accessing localStorage
const user = JSON.parse(localStorage.getItem("user") || "{}");
const sellerId = user.sellerId; // Might not exist

// ✅ Good: Use the utility
const sellerId = getCurrentSellerId();
```

```tsx
// ❌ Bad: No error checking
const orders = await fetchSellerOrders(getCurrentSellerId());

// ✅ Good: Validate first
const sellerId = getCurrentSellerId();
if (!sellerId) throw new Error("No seller ID");
const orders = await fetchSellerOrders(sellerId);
```

```tsx
// ❌ Bad: Assuming ID exists
function loadOrders() {
  const sellerId = getCurrentSellerId(); // Could be null!
  return fetchSellerOrders(sellerId); // Error!
}

// ✅ Good: Check for null
function loadOrders() {
  const sellerId = getCurrentSellerId();
  if (!sellerId) return Promise.reject(new Error("No seller"));
  return fetchSellerOrders(sellerId);
}
```

---

## 📝 Copy-Ready Templates

### Template 1: Simple Fetch
```tsx
const sellerId = getCurrentSellerId();
if (!sellerId) return;
const data = await fetchSellerOrders(sellerId);
```

### Template 2: With Error Handling
```tsx
try {
  const sellerId = getCurrentSellerId();
  if (!sellerId) throw new Error("Seller not found");
  const data = await fetchSellerOrders(sellerId);
  setData(data);
} catch (error) {
  setError(error instanceof Error ? error.message : "Error");
}
```

### Template 3: In useEffect
```tsx
useEffect(() => {
  const sellerId = getCurrentSellerId();
  if (!sellerId) {
    setError("Not a seller");
    return;
  }
  
  loadData(sellerId);
}, []);
```

---

## 🎯 Most Common Usage

**In 90% of cases, use this:**

```tsx
const sellerId = getCurrentSellerId();
if (!sellerId) {
  // Handle error
  return;
}

// Use sellerId for API calls
```

**That's it!** 🎉

---

## 📞 Functions Reference

| Function | Returns | Use For |
|----------|---------|---------|
| `getCurrentSellerId()` | `string \| null` | Get the ID only |
| `getCurrentSeller()` | `StoredSeller \| null` | Get full seller object |
| `getCurrentUser()` | `StoredUser \| null` | Get user object |
| `getCurrentUserId()` | `string \| null` | Get user ID |

---

**File Location:** `src/utils/currentSeller.ts`
