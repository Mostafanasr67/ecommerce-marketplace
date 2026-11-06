# E-Commerce Marketplace

A full-stack marketplace built with:

- React
- TypeScript
- Node.js
- Express
- PostgreSQL
- Prisma 7

## Status

🚧 Under development

## Seller dashboard API

Seller endpoints require a bearer token for a seller account. Each request is
restricted to that seller's own profile and data:

- `GET /seller/:userId` retrieves the profile belonging to the authenticated user.
- `GET /seller/:sellerId/products` retrieves the seller's products, categories,
  and images.
- `GET /seller/:sellerId/orders` retrieves the seller's orders, their items and
  products, and the parent order's shipping and payment summary.

The dashboard's gross order value and trend sum seller order subtotals excluding
cancelled orders; they are not a measure of settled payments. Inventory with
fewer than 10 units is marked as needing attention.