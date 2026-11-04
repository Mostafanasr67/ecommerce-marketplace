# Order Card - Elegant Expandable Redesign

## Overview
The OrderCard component has been completely redesigned with an elegant expandable interface to view order items.

## Visual Layout

### Collapsed State (Default)
```
┌────────────────────────────────────────────────────────┐
│ Order #abc123-def     ✓ Delivered                      │
│ Ordered on 11/04/2024             [🔽 Expand]         │
├────────────────────────────────────────────────────────┤
│ Items: 3 | Total: 2,500 EGP | Shipped To: Cairo       │
└────────────────────────────────────────────────────────┘
```

### Expanded State (When Clicked)
```
┌────────────────────────────────────────────────────────┐
│ Order #abc123-def     ✓ Delivered                      │
│ Ordered on 11/04/2024             [🔼 Collapse]       │
├────────────────────────────────────────────────────────┤
│ Items: 3 | Total: 2,500 EGP | Shipped To: Cairo       │
├────────────────────────────────────────────────────────┤
│ Order Items                                            │
│                                                        │
│ ┌───────────────────────────────────────────────────┐ │
│ │ 🏪 Seller 1              Subtotal: 1,200 EGP     │ │
│ ├───────────────────────────────────────────────────┤ │
│ │ [Image]  Product Name                    Qty: 2  │ │
│ │          SKU: P123                      1,000 EGP │ │
│ │                                                   │ │
│ │ [Image]  Wireless Mouse                  Qty: 1  │ │
│ │          SKU: P124                         200 EGP │ │
│ └───────────────────────────────────────────────────┘ │
│                                                        │
│ ┌───────────────────────────────────────────────────┐ │
│ │ 🏪 Seller 2              Subtotal: 1,300 EGP     │ │
│ ├───────────────────────────────────────────────────┤ │
│ │ [Image]  USB Cable                       Qty: 3  │ │
│ │          SKU: P125                       1,300 EGP │ │
│ └───────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────┘
```

## Component Features

### 1. **Elegant Expand/Collapse Button**
- **Location**: Top-right of order card header
- **State**: Shows different icon based on expanded state
  - Collapsed: `unfold_more` icon
  - Expanded: `unfold_less` icon
- **Text**: "Expand" / "Collapse" (hidden on mobile for space)
- **Styling**:
  - Background: Primary blue (`bg-primary`)
  - Text: White (`text-on-primary`)
  - Hover: Lighter blue background with subtle shadow
  - Transitions: Smooth 300ms duration

### 2. **Order Summary Section** (Always Visible)
Shows 3 key stats in a grid:
1. **Items**: Total item count across all sellers
2. **Total Amount**: Order total in EGP with currency formatting
3. **Shipped To**: Delivery area and city

### 3. **Expandable Items Section** (Hidden by Default)
When expanded, shows:

#### Seller Group
- Store icon (🏪)
- Seller number (Seller 1, Seller 2, etc.)
- Subtotal for that seller's items

#### Product Items (per seller)
- **Product Image** (16x16px thumbnail)
  - Falls back to image placeholder icon if not available
- **Product Details**:
  - Product name
  - SKU for tracking
- **Purchase Info**:
  - Quantity
  - Unit price
- **Styling**:
  - Hover effect with subtle background change
  - Proper spacing and alignment
  - Professional card-like appearance

## Technical Implementation

### State Management
```typescript
const [isExpanded, setIsExpanded] = useState(false);
```
- Toggle state on expand/collapse button click
- Controls visibility of items section

### Price Handling
All prices handle both string and number types:
```typescript
// For totalAmount
(typeof order.totalAmount === 'number' ? order.totalAmount : parseFloat(order.totalAmount.toString())).toLocaleString("en-EG")

// For unit prices
typeof item.unitPrice === 'number' ? item.unitPrice.toLocaleString("en-EG") : item.unitPrice
```

### Responsive Design
- **Mobile**: Button text hidden, only icon shown
- **Tablet+**: Full "Expand"/"Collapse" text visible
- **Product images**: Always 16x16px thumbnail
- **Grid layouts**: Responsive 3-column for stats

## Animation & Transitions

### Expand/Collapse Transition
- **Duration**: 300ms smooth transition
- **Icon rotation**: Changes instantly
- **Section appearance**: Fades in smoothly

### Hover Effects
- **Card**: Shadow enhancement on hover
- **Items**: Subtle background color change on product item hover
- **Button**: Color shift on hover with shadow

## Color Scheme

| Element | Color |
|---------|-------|
| Background | surface-container-lowest |
| Expanded section BG | surface-container-low (50% opacity) |
| Button (default) | primary blue |
| Button (hover) | primary-container (lighter) |
| Status badges | Color-coded by order status |
| Text | on-surface (dark) |
| Subtitles | on-surface-variant (gray) |
| Prices | primary (blue) |
| Borders | surface-container (light gray) |

## Icon Usage

- **Expand/Collapse**: `unfold_more` / `unfold_less`
- **Status**: `check_circle` (Delivered), `local_shipping` (Shipped), etc.
- **Seller**: `store`
- **Image missing**: `image`

## Styling Classes Used

- `rounded-xl`: Large border radius
- `shadow-sm` → `shadow-lg`: Shadow progression on hover
- `transition-all`: Smooth transitions
- `duration-300`: 300ms duration
- `hover:` prefixed classes: Hover state styling
- Material Design tokens for colors and typography

## User Experience Flow

1. **User views order list**
   - Sees all orders with key info (order ID, status, total)
   - Card shows subtle shadow

2. **User clicks Expand button**
   - Button icon changes to "collapse"
   - Items section smoothly appears below
   - Card shadow increases
   - User can now see all products organized by seller

3. **User clicks Collapse button**
   - Items section smoothly disappears
   - Button returns to "expand" state
   - Card returns to original appearance

4. **User hovers over items**
   - Individual items show subtle highlight effect
   - Enhances visual feedback

## Benefits

✨ **Elegant Design**: Modern, clean interface with smooth animations
📱 **Responsive**: Works perfectly on mobile and desktop
🎯 **Clear Information Hierarchy**: Important info always visible, details on demand
🎨 **Visual Consistency**: Uses same design tokens as rest of app
⚡ **Performance**: State-based rendering without unnecessary re-renders
🔍 **Product Visibility**: All product images and details visible when expanded
💰 **Price Clarity**: All prices properly formatted with currency

## Future Enhancements

- Add product quantity adjustment from order
- Add "Reorder" button for each product
- Add product reviews from order
- Add tracking details for each seller order
- Add action buttons (Cancel, Return, etc.) based on order status
