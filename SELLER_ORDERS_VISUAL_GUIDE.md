# Seller Orders Page - Visual Component Breakdown

## 📱 Page Layout

```
┌─────────────────────────────────────────────────────────────────┐
│                     OrdersPageHeader                             │
│  "Store Purchase Ledger" | Active Orders Count | Tier Badge      │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────────────────────────────┬─────────────────────┐   │
│  │          OrdersTable                │  SLAPerformanceCard │   │
│  │  ┌──────────────────────────────┐  │                     │   │
│  │  │  Table Header                │  │  ┌─────────────────┐ │   │
│  │  ├──────────────────────────────┤  │  │ Fulfillment SLA │ │   │
│  │  │ OrderTableRow (Active)       │  │  │ Performance     │ │   │
│  │  │  • Order ID + Date           │  │  │ • Progress Bar  │ │   │
│  │  │  • Customer & Location       │  │  │ • Metrics Grid  │ │   │
│  │  │  • Items Count               │  │  │ • Tier Status   │ │   │
│  │  │  • Seller Total + Currency   │  │  └─────────────────┘ │   │
│  │  │  • EscrowStatusBadge         │  │                     │   │
│  │  │  • StatusBadge (Active)      │  │                     │   │
│  │  ├──────────────────────────────┤  │                     │   │
│  │  │ OrderTableRow                │  │                     │   │
│  │  │ OrderTableRow                │  │                     │   │
│  │  │ OrderTableRow                │  │                     │   │
│  │  │ OrderTableRow                │  │                     │   │
│  │  └──────────────────────────────┘  │                     │   │
│  │         (5 rows per page)          │                     │   │
│  └─────────────────────────────────────┴─────────────────────┘   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    PaginationBar                            │ │
│  │  Page 1 of 3 · 15 Confirmed Orders  [◀] [▶]              │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Responsive Behavior

### Desktop (XL screens - 1280px+)
```
12-Column Grid
┌──────────────────────┬──────────────┐
│   Orders (7 cols)    │ SLA (5 cols) │
└──────────────────────┴──────────────┘
```

### Tablet/Mobile
```
Single Column (Full Width)
┌─────────────────────┐
│ Orders (Full Width) │
├─────────────────────┤
│ SLA (Full Width)    │
└─────────────────────┘
```

---

## 🎨 Component Hierarchy & Data Flow

```
SellerOrdersPage
│
├── State Management
│   ├── orders: SellerOrder[]
│   ├── currentPage: number
│   ├── activeOrderId: string
│   ├── loading: boolean
│   └── error: string | null
│
├── OrdersPageHeader
│   ├── pageTitle: "Store Purchase Ledger"
│   ├── pageDescription: "Manage and track all customer orders..."
│   └── totalOrders: 15
│
├── OrdersTable
│   ├── orders: SellerOrder[] (paginated 5 items)
│   ├── activeOrderId: string
│   ├── totalOrders: 15
│   ├── onViewOrder: (orderId) => void
│   │
│   └── [OrderTableRow × 5]
│       ├── order: SellerOrder
│       ├── isActive: boolean
│       ├── onViewClick: (orderId) => void
│       │
│       └── Nested Components:
│           ├── StatusBadge
│           │   ├── status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED"
│           │   └── isActive: boolean
│           │
│           └── EscrowStatusBadge
│               └── status: "CBE Held" | "Released" | "Pending"
│
├── PaginationBar
│   ├── currentPage: 1
│   ├── totalPages: 3
│   ├── totalOrders: 15
│   ├── onPrevious: () => void
│   └── onNext: () => void
│
└── SLAPerformanceCard
    ├── averageDispatchTime: "4.2 hours average"
    ├── onTimePercentage: 99
    └── tierStatus: "Tier 1 Sovereign Star"
```

---

## 🎯 Component Responsibilities

### SellerOrdersPage
- **Role:** Container/Orchestrator
- **Responsibilities:**
  - Fetch orders from API
  - Manage all state (orders, pagination, active order)
  - Handle loading and error states
  - Coordinate pagination logic
  - Pass data and callbacks to child components

### OrdersPageHeader
- **Role:** Informational Header
- **Responsibilities:**
  - Display page title and description
  - Show active order count
  - Display escrow tier badge

### OrdersTable
- **Role:** Table Container
- **Responsibilities:**
  - Render table structure
  - Render individual order rows
  - Handle empty state
  - Pass order data to each row

### OrderTableRow
- **Role:** Individual Data Row
- **Responsibilities:**
  - Display single order information
  - Show active/highlight state
  - Format data (currency, dates)
  - Render status badges
  - Handle view action callback

### StatusBadge
- **Role:** Status Indicator
- **Responsibilities:**
  - Color-code order status
  - Display status text
  - Toggle button variant for active orders

### EscrowStatusBadge
- **Role:** Escrow Status Indicator
- **Responsibilities:**
  - Show payment hold status
  - Display appropriate icon
  - Apply status-specific styling

### PaginationBar
- **Role:** Navigation Controls
- **Responsibilities:**
  - Show current page info
  - Provide prev/next buttons
  - Handle pagination callbacks
  - Disable buttons at boundaries

### SLAPerformanceCard
- **Role:** Metrics Display
- **Responsibilities:**
  - Show SLA performance data
  - Display animated progress bar
  - Show metrics grid
  - Display tier badge

---

## 📋 Data Structure Example

```typescript
interface SellerOrder {
    id: string;                    // UUID
    orderId: string;               // e.g., "#SOV-849204-EG"
    sellerId: string;
    status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    subTotal: string;              // e.g., "3,889"
    createdAt: string;             // ISO datetime
    updatedAt: string;
    
    order: {
        id: string;
        fullname: string;          // e.g., "Karim Mahmoud"
        city: string;              // e.g., "Cairo"
        area: string;              // e.g., "Dokki Hub"
        payment: {
            method: "COD" | "ONLINE";
            status: string;
            amount: string;
        } | null;
    };
    
    orderItems: {
        id: string;
        productId: string;
        quantity: number;
        unitPrice: string;
        product: {
            id: string;
            name: string;
            // ... other product details
        };
    }[];
}
```

---

## 🎨 Color Scheme

### Order Status Colors
| Status | Background | Text | Use Case |
|--------|-----------|------|----------|
| PENDING | `bg-secondary-fixed` | `text-on-secondary-fixed` | Awaiting confirmation |
| CONFIRMED | `bg-secondary-container` | `text-on-secondary-fixed` | Order confirmed |
| PROCESSING | `bg-tertiary-fixed` | `text-on-tertiary-fixed` | Being prepared |
| SHIPPED | `bg-secondary-container` | `text-on-secondary-container` | In transit |
| DELIVERED | `bg-primary-container` | `text-on-primary-container` | Completed |
| CANCELLED | `bg-error-container` | `text-on-error-container` | Cancelled |

### Escrow Status Colors
| Status | Icon | Background |
|--------|------|------------|
| CBE Held | `verified_user` | `bg-secondary-container` |
| Released | `check_circle` | `bg-primary-container` |
| Pending | `schedule` | `bg-surface-container` |

---

## 🔄 User Interaction Flow

```
User Opens Page
│
├─ Component Loads
│  └─ API Call: fetch("/api/seller/orders")
│
├─ Orders Loaded
│  ├─ Set activeOrderId = first order
│  └─ Display first 5 orders in table
│
├─ User Actions
│  ├─ Click "View" Button
│  │  └─ onViewClick(orderId) → setActiveOrderId
│  │
│  ├─ Click "Next" Button
│  │  └─ onNext() → setCurrentPage
│  │  └─ Fetch orders[5:10]
│  │
│  └─ Click "Previous" Button
│     └─ onPrevious() → setCurrentPage
│        └─ Fetch orders[0:5]
│
└─ Display Updated Data
   └─ Re-render affected components
```

---

## 📱 Responsive Breakpoints

### Mobile (< 640px)
- Table scrolls horizontally
- Single column layout
- Stacked cards

### Tablet (640px - 1024px)
- Table may still scroll
- Single column layout
- Stacked cards

### Desktop (1024px - 1280px)
- Full table visible
- Single column layout
- Stacked cards

### Large Desktop (1280px+)
- 12-column grid layout
- Orders: 7 columns (left)
- SLA Card: 5 columns (right)
- Side-by-side layout

---

## ⚡ Performance Considerations

- ✅ Pagination limits render to 5 items per page
- ✅ Components are memoized where appropriate
- ✅ No unnecessary re-renders
- ✅ Efficient data passing through props
- ✅ No inline object/function creation in render
- ✅ Consider virtual scrolling for 1000+ items (future enhancement)

---

## 🧪 Testing Points

1. **Pagination Logic**
   - Test: previous/next buttons work correctly
   - Test: disabled states at boundaries
   - Test: page counter updates

2. **Active Order Selection**
   - Test: first order selected on load
   - Test: highlighting works
   - Test: callback fires on view click

3. **Status Badge Display**
   - Test: all status colors render correctly
   - Test: active variant looks different

4. **Data Formatting**
   - Test: currency displays in EGP locale
   - Test: dates format correctly
   - Test: item count shows proper singular/plural

5. **Error & Loading States**
   - Test: loading spinner shows
   - Test: error message displays
   - Test: empty state renders

6. **Responsive Design**
   - Test: table scrolls on mobile
   - Test: grid layout on desktop
   - Test: card stacking on tablet
