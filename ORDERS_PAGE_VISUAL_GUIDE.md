# Orders Page - Visual Summary

## Page Layout

```
┌────────────────────────────────────────────────────────────────┐
│                      ProfileSidebar                            │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Account Menu                                             │  │
│  │ ✓ My Profile      (ACTIVE when on /profile)             │  │
│  │ • My Orders       (ACTIVE when on /orders)  [Badge: 3]  │  │
│  │ • Wishlist & Saved                          [Badge: 3]  │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  When "My Orders" is clicked, ProfileSidebar highlights it     │
│  and navigates to /orders → AllOrdersPage renders             │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│                    AllOrdersPage (/orders)                     │
├─────────────────┬──────────────────────────────────────────────┤
│                 │ OrdersHeader                                 │
│                 │ ┌────────────────────────────────────────┐   │
│  OrdersFilter   │ │ My Orders                              │   │
│ ┌────────────┐  │ │ Track and manage your purchases        │   │
│ │ Filter by  │  │ │ 🛒 3 orders                            │   │
│ │ Status:    │  │ │                                        │   │
│ │            │  │ └────────────────────────────────────────┘   │
│ │ ✓ All      │  │                                              │
│ │ • Pending  │  │ OrdersList                                   │
│ │ • Process  │  │ ┌────────────────────────────────────────┐   │
│ │ • Shipped  │  │ │ Order #ORD-2024-001     ✓ Delivered   │   │
│ │ • Deliver  │  │ │ Ordered on Nov 1, 2024                │   │
│ │ • Cancel   │  │ │                                        │   │
│ │            │  │ │ Items: 3 | 2,500 EGP | Nov 04         │   │
│ │            │  │ │                    [View Details →]   │   │
│ │            │  │ └────────────────────────────────────────┘   │
│ │            │  │ ┌────────────────────────────────────────┐   │
│ │            │  │ │ Order #ORD-2024-002     📦 Shipped     │   │
│ │            │  │ │ Ordered on Oct 28, 2024               │   │
│ │            │  │ │                                        │   │
│ │            │  │ │ Items: 2 | 1,800 EGP | Nov 03         │   │
│ │            │  │ │                    [View Details →]   │   │
│ │            │  │ └────────────────────────────────────────┘   │
│ │            │  │ ┌────────────────────────────────────────┐   │
│ │            │  │ │ Order #ORD-2024-003     ✓ Delivered   │   │
│ │            │  │ │ Ordered on Oct 20, 2024                │   │
│ │            │  │ │                                        │   │
│ │            │  │ │ Items: 5 | 3,200 EGP | Oct 25         │   │
│ │            │  │ │                    [View Details →]   │   │
│ │            │  │ └────────────────────────────────────────┘   │
│ └────────────┘  │                                              │
└─────────────────┴──────────────────────────────────────────────┘
```

## Component Hierarchy

```
AllOrdersPage
├── ProfileSidebar (3 col)
│   └── Link items with dynamic active state
│
└── OrdersHeader (9 col section)
    ├── OrdersHeader
    └── Filtered Orders Container
        ├── OrdersFilter (4 col)
        │   └── Status buttons with icons
        │
        └── OrdersList (8 col)
            └── OrderCard[] (maps filtered orders)
                ├── Order ID + Status badge
                ├── Order date
                ├── View Details button
                └── 3-column stats (items, amount, update date)
```

## Features

### Navigation
- ✅ Click "My Orders" → Route to `/orders`
- ✅ Sidebar highlights active page
- ✅ Smooth transitions

### Filtering
- ✅ Click any status filter to show only that status
- ✅ "All Orders" shows everything
- ✅ Highlighted filter with primary color
- ✅ Icons for visual clarity

### Order Display
- ✅ Order number and status badge
- ✅ Color-coded status (Delivered=green, Shipped=blue, etc.)
- ✅ Order date and last update
- ✅ Item count and total amount (formatted locale)
- ✅ "View Details" button
- ✅ Hover effect with shadow

### Empty State
- ✅ Shows when no orders exist
- ✅ Large icon + helpful message
- ✅ Call-to-action text

## Styling Features

- ✅ Unified Material Design tokens
- ✅ Consistent spacing (space-xs to space-xl)
- ✅ Proper typography hierarchy
- ✅ Responsive grid layout (1 col mobile, 12 col desktop)
- ✅ Material Symbols icons throughout
- ✅ Smooth transitions and hover states

## Data Flow

```
AllOrdersPage (state: selectedStatus)
    ↓
Filter SAMPLE_ORDERS by selectedStatus
    ↓
Pass filtered array to OrdersList
    ↓
OrdersList maps each order to OrderCard
    ↓
OrderCard renders order details with proper styling
```

## Integration Steps (Next)

To connect to real data:

1. **Replace static data** in AllOrdersPage:
```typescript
const ordersQuery = useQuery({
  queryKey: ['orders'],
  queryFn: async () => {
    const response = await fetch('/api/orders', {
      headers: { 'Authorization': `Bearer ${getToken()}` }
    });
    return response.json();
  }
});

const filteredOrders = selectedStatus === 'all'
  ? ordersQuery.data
  : ordersQuery.data?.filter(o => o.status === selectedStatus);
```

2. **Add loading/error states**:
```typescript
if (ordersQuery.isLoading) return <LoadingSpinner />;
if (ordersQuery.isError) return <ErrorMessage />;
```

3. **Link "View Details"** to order detail page:
```typescript
href={`/orders/${order.id}`}
```

## Build Status
✅ TypeScript: No errors
✅ Vite build: Success (413 KB gzipped)
✅ All imports resolved
✅ Ready for use
