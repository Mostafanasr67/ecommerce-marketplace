# Get Seller ID - Quick Reference Card

## 🎯 One-Liner
```tsx
const sellerId = getCurrentSellerId();
```

## 📦 Import
```tsx
import { getCurrentSellerId } from "../../utils/currentSeller";
```

## ✅ With Error Check (Recommended)
```tsx
const sellerId = getCurrentSellerId();
if (!sellerId) throw new Error("Seller not found");
```

## 📋 All Available Functions

| Function | Returns | Purpose |
|----------|---------|---------|
| `getCurrentSellerId()` | `string \| null` | Get seller ID |
| `getCurrentSeller()` | `StoredSeller \| null` | Get seller object |
| `getCurrentUserId()` | `string \| null` | Get user ID |
| `getCurrentUser()` | `StoredUser \| null` | Get user object |

## 🔥 Most Common Patterns

### Pattern 1: Simple Get
```tsx
const sellerId = getCurrentSellerId();
```

### Pattern 2: With Validation
```tsx
const sellerId = getCurrentSellerId();
if (!sellerId) {
  setError("Seller not found");
  return;
}
```

### Pattern 3: In useEffect
```tsx
useEffect(() => {
  const sellerId = getCurrentSellerId();
  if (!sellerId) return;
  loadData(sellerId);
}, []);
```

### Pattern 4: Type Safe
```tsx
import type { StoredSeller } from "../../utils/currentSeller";

const seller: StoredSeller | null = getCurrentSeller();
```

## 📱 Real-World Example

```tsx
import { useEffect, useState } from "react";
import { getCurrentSellerId } from "../../utils/currentSeller";
import { fetchSellerOrders } from "./SellerHelper";

function SellerOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const sellerId = getCurrentSellerId();
        if (!sellerId) {
          throw new Error("Seller not found");
        }
        
        const data = await fetchSellerOrders(sellerId);
        setOrders(data);
      } catch (err) {
        setError(err.message);
      }
    };

    loadOrders();
  }, []);

  return (
    // ... render orders
  );
}
```

## 📂 File Location
- **Utility:** `src/utils/currentSeller.ts`
- **Example:** `src/pages/seller/SellerOrdersPage.tsx`

## 📖 Documentation
- **Solution:** `SELLER_ID_SOLUTION.md`
- **Guide:** `GET_SELLER_ID_GUIDE.md`
- **Snippets:** `GET_SELLER_ID_SNIPPETS.md`

## ⚡ Quick Copy-Paste

### Get and Use
```tsx
const sellerId = getCurrentSellerId();
if (!sellerId) return;
const orders = await fetchSellerOrders(sellerId);
```

### With Types
```tsx
import { getCurrentSeller } from "../../utils/currentSeller";
import type { StoredSeller } from "../../utils/currentSeller";

const seller: StoredSeller | null = getCurrentSeller();
if (seller?.id) {
  // Use seller.id
}
```

---

**That's all you need to know!** ✅
