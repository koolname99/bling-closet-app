# Bling Closet Backend — Phased Implementation Plan

## Phase 1 — Project Setup & Database Connection
> **Goal:** Get a running Express server that connects to MongoDB.

| File | What to do |
|------|------------|
| `package.json` | `npm init -y`, install `express`, `mongoose`, `dotenv`, `cors` |
| `.env.example` | Add `PORT=5000` and `MONGODB_URI=mongodb://localhost:27017/bling-closet` |
| `.env` | Copy from `.env.example`, fill in your real MongoDB URI |
| `.gitignore` | Ignore `node_modules/` and `.env` |
| `config/db.js` | `connectDB()` — connects Mongoose to `MONGODB_URI` |
| `server.js` | Load dotenv, call `connectDB()`, start Express on port 5000 |

**✅ Test:** Run `npm run dev` — should see "MongoDB connected" and "Server running on port 5000".

---

## Phase 2 — Item Model & Basic CRUD (No Images Yet)
> **Goal:** Create the Item schema and GET/POST/DELETE routes using a placeholder `imageUrl` string.

| File | What to do |
|------|------------|
| `models/Item.js` | Schema: `title`, `imageUrl`, `price`, `category`, `description`, `createdAt` |
| `controllers/itemController.js` | `getAllItems`, `getItemById`, `createItem`, `deleteItem` |
| `routes/items.js` | Express Router wiring the 4 endpoints |
| `server.js` | Mount `/api/items` routes |

**✅ Test:** POST/GET/DELETE with curl or Postman using placeholder URL strings.

---

## Phase 3 — AWS S3 Image Upload
> **Goal:** Replace placeholder URLs with real image uploads to S3.

| File | What to do |
|------|------------|
| Install deps | `npm install @aws-sdk/client-s3 multer multer-s3 uuid` |
| `.env.example` | Add `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_S3_BUCKET_NAME` |
| `config/s3.js` | Create and export `S3Client` |
| `middleware/upload.js` | Configure `multer` + `multer-s3` — uploads to `items/` prefix |
| `models/Item.js` | Add `s3Key` field |
| `controllers/itemController.js` | Update `createItem` to use file upload |
| `routes/items.js` | Add `upload.single('image')` middleware to POST |

**✅ Test:** POST with an image file → returns item with real S3 URL.

---

## Phase 4 — Update, Delete Cleanup & Frontend CORS
> **Goal:** Complete item API with update support, S3 cleanup on delete, CORS for React frontend.

| File | What to do |
|------|------------|
| `controllers/itemController.js` | Add `updateItem`, update `deleteItem` to remove S3 object |
| `routes/items.js` | Add PUT route with upload middleware |
| `server.js` | Configure `cors({ origin: 'http://localhost:5173' })` |

**✅ Test:** Update/delete items → S3 images cleaned up. React frontend can fetch without CORS errors.

---

## Phase 5 — Orders & Customer Tracking
> **Goal:** Add an orders system to log customer inquiries and track order status.

### Order Schema

```js
// models/Order.js
{
  customerName: String (required),
  customerPhone: String,
  customerEmail: String,
  customerSocial: String,           // Instagram/Facebook handle
  items: [{ 
    item: ObjectId → Item,          // reference to Item
    quantity: Number (default 1),
    price: Number                   // price at time of order
  }],
  totalPrice: Number,
  status: String (enum: "pending" → "confirmed" → "shipped" → "delivered" → "cancelled"),
  notes: String,                    // "Wants size S, pickup downtown"
  createdAt: Date,
  updatedAt: Date
}
```

### Files to Create/Modify

| File | What to do |
|------|------------|
| `models/Order.js` | Mongoose schema as shown above, with `ref: 'Item'` on items |
| `controllers/orderController.js` | 5 functions (see endpoints below) |
| `routes/orders.js` | Express Router for order endpoints |
| `server.js` | Mount `/api/orders` routes |

### REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/orders` | List all orders (newest first), populate item details |
| `GET` | `/api/orders/:id` | Get single order with full item details |
| `POST` | `/api/orders` | Create new order (customer info + item IDs) |
| `PUT` | `/api/orders/:id` | Update order (change status, edit notes, modify items) |
| `DELETE` | `/api/orders/:id` | Delete/cancel an order |
| `GET` | `/api/orders?status=pending` | Filter orders by status |

### Controller Details

- **`createOrder`** — Accepts customer info + array of item IDs, looks up items to calculate `totalPrice`, sets status to `"pending"`
- **`updateOrder`** — Main use: change `status` (e.g. pending → confirmed → shipped → delivered). Can also edit notes or customer info
- **`getAllOrders`** — Supports `?status=pending` query filter, uses `.populate('items.item')` to include full item details
- **`deleteOrder`** — Soft option: set status to `"cancelled"`. Hard option: actually remove from DB

**✅ Test:**
```bash
# Create an order
curl -X POST http://localhost:5000/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Mai Nguyen",
    "customerPhone": "832-555-1234",
    "customerSocial": "@mai_nguyen",
    "items": [{"item": "<item-id>", "quantity": 2}],
    "notes": "Wants size S"
  }'

# Update order status
curl -X PUT http://localhost:5000/api/orders/<order-id> \
  -H "Content-Type: application/json" \
  -d '{"status": "confirmed"}'

# Get pending orders
curl http://localhost:5000/api/orders?status=pending
```

---

## Full Summary

| Phase | Milestone | Depends On |
|-------|-----------|------------|
| **1** | Server + MongoDB connected | MongoDB running |
| **2** | Item CRUD with placeholder URLs | Phase 1 |
| **3** | Real S3 image uploads | Phase 2 + AWS creds |
| **4** | Full item API, frontend-ready | Phase 3 |
| **5** | Orders & customer tracking | Phase 2 (items exist) |
