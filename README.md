# Jasmine Towels Full-Stack Platform

Modern full-stack website for Jasmine Towels with:
- Full brand pages (Home, About, Products, Facilities, Quality, Careers, Contact)
- Product selection by quantity and color
- Customer checkout with address capture
- Order management
- Admin panel for product CRUD, media upload, and order status tracking

## Stack
- Frontend: React + Vite + TailwindCSS + Ant Design + Framer Motion
- Backend: Node.js + Express + MongoDB (Mongoose)
- Media: Cloudinary integration endpoints

## Folder Structure
- `frontend/` - Client app
- `backend/` - REST API

## Setup
1. Backend env
   - Copy `backend/.env.example` to `backend/.env`
   - Add MongoDB and Cloudinary credentials
2. Frontend env
   - Copy `frontend/.env.example` to `frontend/.env`
3. Install dependencies
   - `cd backend && npm install`
   - `cd ../frontend && npm install`
4. Start both apps
   - Backend: `npm run dev` (port 5000)
   - Frontend: `npm run dev` (port 5173)

## Initial Data and Admin
- Seed products: `GET /api/products/seed`
- Create first admin:
  - Use the "Bootstrap Admin" tab in `/auth`
  - Pass the same `ADMIN_SETUP_KEY` from backend env

## Notes
- Cloudinary delete currently assumes image resource type; extend for video if needed.
- Replace placeholder visuals with production assets from admin uploads.
