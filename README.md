# QUICKBASKET

A full-stack ecommerce platform built with React, Redux Toolkit, Vite, Tailwind CSS (client), and Node.js, Express, MongoDB (server). The application supports user authentication, product management, shopping cart, order processing, PayPal integration, and admin features.

---

## Features

### User
- Browse products by category, brand, or search
- View product details and reviews
- Add products to cart and manage cart items
- Checkout with address selection and PayPal payment
- View order history and order details
- Write reviews for purchased products

### Admin
- Dashboard for managing products and orders
- Add, edit, and delete products
- View all orders and order details

---

## Tech Stack

- **Frontend:** React, Vite, Redux Toolkit, Tailwind CSS
- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Authentication:** JWT, Cookies
- **Payments:** PayPal integration
- **Image Upload:** Cloudinary

---

## Project Structure

```
client/      # React frontend
  src/
    components/
    pages/
    store/
    config/
    ...
server/      # Node.js backend
  controllers/
  models/
  routes/
  helpers/
  ...
```

---

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- MongoDB database
- Cloudinary account (for image uploads)
- PayPal developer account

### Environment Variables

Create `.env` files in both `client/` and `server/` directories.

#### Example for `server/.env`:
```
CLIENT_BASE_URL=http://localhost:5173
MONGO_URI=your_mongodb_connection_string
PORT=5000
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
PAYPAL_CLIENT_ID=your_paypal_client_id
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

#### Example for `client/.env`:
```
VITE_API_URL=http://localhost:5000
```

---

## Installation

### 1. Clone the repository

```sh
git clone https://github.com/yourusername/ecommerce-app.git
cd ecommerce-app
```

### 2. Install dependencies

#### Client

```sh
cd client
npm install
```

#### Server

```sh
cd ../server
npm install
```

---

## Running the Application

### Start the backend server

```sh
cd server
npm run dev
```

### Start the frontend development server

```sh
cd ../client
npm run dev
```

- Client: [http://localhost:5173](http://localhost:5173)
- Server: [http://localhost:5000](http://localhost:5000)

---

## Scripts

### Client

- `npm run dev` - Start Vite dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Server

- `npm run dev` - Start server with nodemon
- `npm start` - Start server

---

## License

MIT

---

## Author

- [Mohammad Umar Al Hejazi](https://github.com/yourusername)

---

## Live Website Link

- [QuickBasket.com](https://quickbasket-1-76pv.onrender.com/)

---

## Acknowledgements

- [React](https://react.dev/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Cloudinary](https://cloudinary.com/)
- [PayPal Developer](https://developer.paypal.com/)
