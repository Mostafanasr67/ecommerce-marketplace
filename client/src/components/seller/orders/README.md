# Seller Orders Page Components

This directory contains reusable components for the Seller Orders Page. The components are organized to provide a modular, maintainable structure following the design system specifications.

## Components Overview

### 1. **SellerOrdersPage.tsx** (Main Page)
**Location:** `src/pages/seller/SellerOrdersPage.tsx`

The main page component that orchestrates all order-related functionality. It handles:
- Fetching seller orders from the API
- Managing pagination state (currently set to 5 items per page)
- Tracking active order selection
- Error handling and loading states
- Responsive grid layout (1 col on mobile, 12 col on XL)

**Props:** None (uses React hooks for state management)

**State:**
- `orders` - Array of SellerOrder objects
- `loading` - Loading state during API fetch
- `error` - Error message if fetch fails
- `currentPage` - Current pagination page
- `activeOrderId` - Currently selected order ID

**Key Features:**
- API integration ready (TODO: configure endpoint)
- Automatic active order selection on load
- Page navigation with prev/next buttons
- Error boundary UI

---

### 2. **OrdersTable.tsx**
**Location:** `src/components/seller/orders/OrdersTable.tsx`

Wrapper component that renders the orders table with header and rows. It's responsible for:
- Displaying table structure and styling
- Rendering individual order rows
- Showing order count and pagination info
- Empty state handling

**Props:**
- `orders: SellerOrder[]` - Array of orders to display
- `activeOrderId?: string` - ID of currently active order
- `onViewOrder: (orderId: string) => void` - Callback when View button clicked
- `totalOrders: number` - Total count of orders (for display purposes)

**Features:**
- Horizontally scrollable on mobile
- Responsive header with icon
- Consistent table styling with Material Design

---

### 3. **OrderTableRow.tsx**
**Location:** `src/components/seller/orders/OrderTableRow.tsx`

Individual row component that displays a single order. Each row shows:
- Order ID with date/time
- Customer name and location
- Item count badge
- Total amount with currency
- Escrow status badge
- Action button (Active or View)

**Props:**
- `order: SellerOrder` - The order data to display
- `isActive?: boolean` - Whether this is the active/highlighted order
- `onViewClick: (orderId: string) => void` - Callback for View button

**Features:**
- Conditional styling for active state (primary background highlight)
- Formatted currency display (EGP locale)
- Formatted date/time display
- Interactive hover effects
- Visual indicator (dot) for active row

---

### 4. **StatusBadge.tsx**
**Location:** `src/components/seller/orders/StatusBadge.tsx`

Reusable badge component for displaying order status. Supports all order statuses:
- PENDING
- CONFIRMED
- PROCESSING
- SHIPPED
- DELIVERED
- CANCELLED

**Props:**
- `status: SellerOrder["status"]` - The order status
- `isActive?: boolean` - Display as primary action button (for active status)

**Features:**
- Color-coded badges for each status
- Dynamic styling based on status
- Button variant for active orders
- Material Design color scheme

---

### 5. **EscrowStatusBadge.tsx**
**Location:** `src/components/seller/orders/EscrowStatusBadge.tsx`

Displays escrow/payment hold status with icon. Shows:
- CBE Held (verified user icon)
- Released (check circle icon)
- Pending (schedule icon)

**Props:**
- `status: "CBE Held" | "Released" | "Pending"` - Escrow status type

**Features:**
- Material Design icons
- Color-coded backgrounds
- Compact badge design

---

### 6. **PaginationBar.tsx**
**Location:** `src/components/seller/orders/PaginationBar.tsx`

Pagination controls for navigating through orders. Includes:
- Page counter (e.g., "Page 1 of 3")
- Total orders display
- Previous/Next buttons with disabled states
- Tier badge display

**Props:**
- `currentPage: number` - Current page number
- `totalPages: number` - Total number of pages
- `totalOrders: number` - Total count of orders
- `onPrevious: () => void` - Callback for previous button
- `onNext: () => void` - Callback for next button

**Features:**
- Disabled states when at first/last page
- Responsive button design
- Accessibility-friendly
- Material Design icons

---

### 7. **OrdersPageHeader.tsx**
**Location:** `src/components/seller/orders/OrdersPageHeader.tsx`

Header section for the orders page. Displays:
- Page title
- Page description
- Active orders count badge
- Escrow tier badge

**Props:**
- `pageTitle: string` - Main heading (e.g., "Store Purchase Ledger")
- `pageDescription: string` - Subtitle/description text
- `totalOrders: number` - Count for active orders badge

**Features:**
- Border separator at bottom
- Multiple informational badges
- Consistent typography hierarchy

---

### 8. **SLAPerformanceCard.tsx**
**Location:** `src/components/seller/orders/SLAPerformanceCard.tsx`

Right sidebar card displaying Service Level Agreement (SLA) performance metrics. Shows:
- Average dispatch time
- On-time delivery percentage
- Tier status badge
- Visual progress bar
- Performance metrics grid (Orders Fulfilled, SLA On-Time %, Avg. Response)

**Props:**
- `averageDispatchTime: string` - Display text for avg time (e.g., "4.2 hours average")
- `onTimePercentage: number` - Percentage for progress bar (0-100)
- `tierStatus: string` - Tier description (e.g., "Tier 1 Sovereign Star")

**Features:**
- Animated progress bar
- Icon with badge styling
- Three-column metrics grid
- Responsive design

---

## Type Definitions

All components use TypeScript types from `src/types/seller.ts`:

```typescript
type SellerOrder = {
    id: string;
    orderId: string;
    sellerId: string;
    status: "PENDING" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";
    subTotal: string;
    createdAt: string;
    updatedAt: string;
    order: {
        id: string;
        fullname: string;
        city: string;
        area: string;
        payment: { method: "COD" | "ONLINE"; status: string; amount: string } | null;
    };
    orderItems: {
        id: string;
        productId: string;
        quantity: number;
        unitPrice: string;
        product: SellerProduct;
    }[];
};
```

---

## Usage Example

```tsx
import SellerOrdersPage from "../pages/seller/SellerOrdersPage";

function App() {
    return <SellerOrdersPage />;
}
```

Or import individual components:

```tsx
import { 
    OrdersTable, 
    OrderTableRow, 
    StatusBadge, 
    EscrowStatusBadge 
} from "../components/seller/orders";
```

---

## Styling & Design System

All components follow the project's Tailwind CSS design system with:
- Custom color tokens (primary, secondary, tertiary, error, surface variants)
- Material Design 3 typography scale
- Consistent spacing tokens (space-xs, space-sm, space-md, space-lg, space-xl)
- Material Symbols Outlined icons
- Rounded corners following design specifications

### Key Color Classes Used:
- `bg-primary` / `text-on-primary` - Primary actions
- `bg-secondary-container` / `text-on-secondary-fixed` - Secondary elements
- `bg-surface-container-*` - Background surfaces
- `bg-error-container` / `text-on-error-container` - Error states

---

## Layout Structure

The main page uses a 12-column grid on XL screens:
- **Left (7 cols):** Orders table with pagination
- **Right (5 cols):** SLA Performance card

On smaller screens, it stacks vertically (1 col).

---

## API Integration

**TODO:** Configure the API endpoint in `SellerOrdersPage.tsx`:

```tsx
const response = await fetch("/api/seller/orders");
```

Expected endpoint to return an array of `SellerOrder[]` objects.

---

## Future Enhancements

1. **Order Details Modal** - Implement clicking on an order to view details
2. **Filters** - Add status filter buttons above the table
3. **Search** - Add order ID or customer name search
4. **Bulk Actions** - Implement multi-select and bulk status updates
5. **Export** - Add CSV/PDF export functionality
6. **Real-time Updates** - WebSocket integration for live order updates
7. **Performance** - Virtual scrolling for large order lists

---

## Index Export

All components are exported through `index.ts` for cleaner imports:

```tsx
export { default as OrdersTable } from "./OrdersTable";
export { default as OrderTableRow } from "./OrderTableRow";
export { default as StatusBadge } from "./StatusBadge";
export { default as EscrowStatusBadge } from "./EscrowStatusBadge";
export { default as PaginationBar } from "./PaginationBar";
export { default as OrdersPageHeader } from "./OrdersPageHeader";
export { default as SLAPerformanceCard } from "./SLAPerformanceCard";
```
