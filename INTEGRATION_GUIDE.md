# Shagaf Dashboard - Backend Integration Guide

This is a complete Next.js frontend dashboard fully integrated with your Express backend API.

## Project Structure

\`\`\`
├── app/
│   ├── login/              # Authentication page
│   ├── dashboard/          # Main dashboard with rooms/roofs
│   ├── customers/          # Customer management page
│   └── notifications/      # Booking requests & notifications
├── components/
│   ├── sidebar.tsx         # Navigation sidebar
│   └── booking-dialog.tsx  # Booking creation modal
├── lib/
│   ├── api-client.ts       # API client for all endpoints
│   ├── auth-context.tsx    # Authentication context & hooks
│   └── types.ts            # TypeScript interfaces
└── public/                 # Static assets
\`\`\`

## Setup Instructions

### 1. Environment Variables

Add these variables to your `.env.local` file:

\`\`\`env
NEXT_PUBLIC_API_URL=https://co-work-backend-test.up.railway.app
\`\`\`

Or update it in Vercel project settings:
- Go to **Settings → Environment Variables**
- Add `NEXT_PUBLIC_API_URL` with your backend URL

### 2. Install Dependencies

\`\`\`bash
npm install
# or
pnpm install
\`\`\`

### 3. Run Development Server

\`\`\`bash
npm run dev
\`\`\`

Visit `http://localhost:3000` to see the dashboard.

## Features Implemented

### Authentication
- **Login Page** (`/login`): Email/password authentication
- **Auth Context**: Global auth state management
- **Token Management**: Automatic token storage and retrieval

### Dashboard
- **Rooms Tab**: Display all rooms with status and pricing
- **Roofs Tab**: Display all roofs/terraces with status and pricing
- **Real-time Data**: Fetches from `GET /api/rooms` and `GET /roof`

### Notifications & Bookings
- **Pending Requests**: Show all pending booking requests
- **Approval/Rejection**: Accept or decline bookings
- **Payment Verification**: Display deposit screenshots
- **Status Filtering**: Filter bookings by status (Pending/Confirmed/Rejected)

### Customers
- Ready for customer list integration
- Sample metrics displayed

## API Integration Details

All API calls are handled through `lib/api-client.ts`:

### Authentication
- `POST /auth/login` - User login
- `GET /api/auth/me` - Get current user

### Rooms & Roofs
- `GET /api/rooms` - List all rooms
- `GET /api/rooms/:id` - Get single room
- `GET /api/rooms/branch/:branchId` - Rooms by branch
- `GET /roof` - List all roofs
- `GET /roof/:id` - Get single roof

### Bookings
- `POST /api/bookings/create` - Create new booking
- `GET /admin/pending-bookings` - Get pending bookings
- `POST /admin/booking/:id/approve` - Approve booking
- `POST /admin/booking/:id/reject` - Reject booking

### Notifications
- `GET /notification/my-notifications` - Get user notifications
- `POST /notification/mark-as-read` - Mark notification as read

## Customization

### Change Colors
Edit `app/globals.css` to modify the color scheme. The teal color (`#14b8a6`) is used throughout.

### Add New Pages
1. Create a new folder in `app/` or `app/dashboard/`
2. Add a `page.tsx` file
3. Update `components/sidebar.tsx` to add navigation link

### Update API Base URL
Change `API_BASE_URL` in `lib/api-client.ts`:

\`\`\`typescript
const API_BASE_URL = "your-new-backend-url"
\`\`\`

## Authentication Flow

1. User enters credentials on login page
2. Request sent to backend `/auth/login`
3. Token and user data stored in localStorage
4. AuthContext provides user state globally
5. Dashboard pages check authentication status
6. Unauthorized users redirected to login

## Deployment

### Deploy to Vercel
\`\`\`bash
npm run build
# Push to GitHub and connect to Vercel
\`\`\`

### Environment Variables on Vercel
1. Go to **Settings → Environment Variables**
2. Add `NEXT_PUBLIC_API_URL` with your backend URL
3. Deploy

## Troubleshooting

### Login fails
- Check `NEXT_PUBLIC_API_URL` is correct
- Ensure backend is running
- Check CORS settings on backend

### API errors
- Verify token is being sent with requests
- Check backend logs for detailed error messages
- Ensure all required fields are being sent

### Data not loading
- Open browser DevTools → Network tab
- Check API responses
- Verify database has data
- Check backend routes configuration

## Next Steps

1. **Payment Integration**: Add Stripe/payment gateway
2. **Email Notifications**: Configure email alerts
3. **Analytics**: Add dashboard metrics and charts
4. **User Management**: Build admin user management
5. **Booking Calendar**: Add calendar view for bookings
