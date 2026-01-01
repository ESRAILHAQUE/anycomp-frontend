# Anycomp Frontend

A modern, responsive frontend application for the Anycomp Company Registration and Management Platform, built with Next.js, React, TypeScript, and Material-UI.

## 🚀 Features

- **Next.js 14** - React framework with App Router
- **TypeScript** - Full type safety
- **Material-UI (MUI)** - Beautiful, responsive UI components
- **Redux Toolkit** - State management
- **React Hook Form** - Form handling with validation
- **Zod** - Schema validation
- **Axios** - HTTP client for API calls
- **Toast Notifications** - User feedback with react-toastify
- **SweetAlert2** - Beautiful confirmation dialogs
- **Fully Responsive** - Mobile-first design
- **Custom Fonts** - Proxima Nova & Red Hat Display
- **Dark Mode Ready** - Theme customization support

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** (v9.0.0 or higher) or **yarn**
- **Backend API** - Running backend server (see backend README)

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **UI Library**: Material-UI (MUI) v5
- **State Management**: Redux Toolkit
- **Form Handling**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS + MUI sx prop
- **Notifications**: react-toastify, sweetalert2
- **Icons**: Material-UI Icons

## 📦 Installation

1. **Navigate to the frontend directory**:

```bash
cd frontend
```

2. **Install dependencies**:

```bash
npm install
```

3. **Create environment file**:

Create a `.env.local` file in the root of the frontend directory:

```env
# Backend API URL
NEXT_PUBLIC_API_URL=http://localhost:5000/api

# For production, use:
# NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

### Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `NEXT_PUBLIC_API_URL` | Backend API base URL | Yes | - |

## 🚀 Running the Application

### Development Mode

```bash
npm run dev
```

The application will start on `http://localhost:3000`.

### Production Build

1. **Build the project**:

```bash
npm run build
```

2. **Start the production server**:

```bash
npm start
```

### Linting

```bash
npm run lint
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── dashboard/
│   │   │   └── page.tsx              # Dashboard/All Specialists page
│   │   ├── specialists/
│   │   │   ├── create/
│   │   │   │   └── page.tsx          # Create Specialist page
│   │   │   └── edit/
│   │   │       └── [id]/
│   │   │           └── page.tsx      # Edit Specialist page
│   │   ├── globals.css               # Global styles and fonts
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                 # Home/Marketplace page
│   │   └── providers.tsx            # Redux and MUI providers
│   ├── components/
│   │   ├── forms/
│   │   │   ├── ImageUpload.tsx       # Image upload component
│   │   │   └── MultiSelectDropdown.tsx # Multi-select dropdown
│   │   ├── layout/
│   │   │   ├── DashboardLayout.tsx   # Dashboard layout wrapper
│   │   │   ├── Header.tsx            # Dashboard header
│   │   │   ├── PublicHeader.tsx      # Public header
│   │   │   ├── PublicLayout.tsx      # Public layout wrapper
│   │   │   └── Sidebar.tsx           # Dashboard sidebar
│   │   ├── EditServiceDrawer.tsx     # Edit service drawer
│   │   ├── Pagination.tsx            # Pagination component
│   │   ├── PublishModal.tsx          # Publish confirmation modal
│   │   ├── SearchBar.tsx             # Search bar component
│   │   ├── SpecialistCard.tsx        # Specialist card for grid view
│   │   ├── SpecialistsTableNew.tsx   # Specialists table component
│   │   └── TabsFilter.tsx            # Tab-based filter component
│   ├── services/
│   │   └── api.ts                    # API client configuration
│   ├── store/
│   │   ├── hooks.ts                  # Typed Redux hooks
│   │   ├── slices/
│   │   │   └── specialistsSlice.ts   # Specialists Redux slice
│   │   └── store.ts                 # Redux store configuration
│   └── types/
│       └── specialist.types.ts      # TypeScript type definitions
├── .env.local                        # Environment variables (not in git)
├── .gitignore                       # Git ignore file
├── next.config.js                   # Next.js configuration
├── package.json                     # Dependencies and scripts
├── postcss.config.js                # PostCSS configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
└── README.md                        # This file
```

## 🎨 Pages & Features

### Public Pages

#### Home Page (`/`)
- Marketplace view of published specialists
- Grid layout with specialist cards
- Search and filter functionality
- Responsive design

### Dashboard Pages

#### All Specialists (`/dashboard`)
- Table view of all specialists
- Filter by status (All, Drafts, Published)
- Search functionality
- Pagination
- Bulk actions (select multiple)
- Edit and delete actions

#### Create Specialist (`/specialists/create`)
- Form to create new specialist
- Image upload
- Service details
- Pricing configuration
- Company secretary information
- Additional offerings

#### Edit Specialist (`/specialists/edit/[id]`)
- View specialist details
- Edit drawer for quick edits
- Publish functionality
- Image management
- Service offerings management

## 🎯 Key Components

### Layout Components

- **DashboardLayout**: Main layout for admin pages with sidebar and header
- **PublicLayout**: Layout for public marketplace pages
- **Sidebar**: Navigation sidebar with menu items
- **Header**: Top header with breadcrumbs and user actions
- **PublicHeader**: Public header with navigation and search

### Form Components

- **ImageUpload**: Image upload with preview and primary selection
- **MultiSelectDropdown**: Multi-select dropdown with chips

### Data Display Components

- **SpecialistCard**: Card component for grid view
- **SpecialistsTableNew**: Table component for list view
- **Pagination**: Pagination controls
- **TabsFilter**: Tab-based status filter

### Modal/Drawer Components

- **PublishModal**: Confirmation modal for publishing
- **EditServiceDrawer**: Slide-in drawer for editing service

## 🔌 API Integration

The frontend communicates with the backend API through the `api.ts` service file.

### API Client Configuration

```typescript
import { specialistApi } from '@/services/api';

// Get all specialists
const specialists = await specialistApi.getSpecialists({
  page: 1,
  limit: 10,
  status: 'published',
  search: 'company'
});

// Get specialist by ID
const specialist = await specialistApi.getSpecialistById(id);

// Create specialist
const newSpecialist = await specialistApi.createSpecialist(data);

// Update specialist
const updated = await specialistApi.updateSpecialist(id, data);

// Delete specialist
await specialistApi.deleteSpecialist(id);

// Toggle publish status
await specialistApi.togglePublishStatus(id, false);
```

## 🎨 Styling

### Fonts

- **Proxima Nova**: Custom font for headings
- **Red Hat Display**: Primary font family

### Colors

- **Primary**: #222222 (Dark gray)
- **Secondary**: #1976d2 (Blue)
- **Background**: #f5f5f5 (Light gray)
- **Text**: #222222, #666 (Gray)

### Responsive Breakpoints

- **xs**: 0px (Mobile)
- **sm**: 600px (Tablet)
- **md**: 900px (Desktop)
- **lg**: 1200px (Large Desktop)
- **xl**: 1536px (Extra Large)

## 📱 Responsive Design

All pages and components are fully responsive:

- **Mobile**: Optimized for screens 320px and above
- **Tablet**: Optimized for screens 600px and above
- **Desktop**: Optimized for screens 900px and above
- **Large Desktop**: Optimized for screens 1200px and above

## 🔄 State Management

Redux Toolkit is used for global state management:

- **Specialists State**: List, current specialist, pagination, filters
- **Loading States**: Track async operations
- **Error Handling**: Centralized error state

### Usage Example

```typescript
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchSpecialists } from '@/store/slices/specialistsSlice';

// In component
const dispatch = useAppDispatch();
const { specialists, loading } = useAppSelector(state => state.specialists);

useEffect(() => {
  dispatch(fetchSpecialists({ page: 1, limit: 10 }));
}, [dispatch]);
```

## 📝 Form Handling

Forms use React Hook Form with Zod validation:

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  base_price: z.string().min(1, 'Base price is required'),
});

const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(schema)
});
```

## 🔔 Notifications

### Toast Notifications

Success and error messages use react-toastify:

```typescript
import { toast } from 'react-toastify';

toast.success('Operation successful!');
toast.error('An error occurred!');
```

### Confirmation Dialogs

User confirmations use SweetAlert2:

```typescript
import Swal from 'sweetalert2';

await Swal.fire({
  title: 'Are you sure?',
  text: 'This action cannot be undone!',
  icon: 'warning',
  showCancelButton: true,
  confirmButtonColor: '#d33',
  cancelButtonColor: '#222222',
  confirmButtonText: 'Yes, delete it!'
});
```

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

### Environment Variables for Production

Set `NEXT_PUBLIC_API_URL` to your production backend URL:

```env
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

### Recommended Platforms

- **Vercel**: Optimized for Next.js (recommended)
- **Netlify**: Great for static sites
- **AWS Amplify**: Full-stack deployment
- **Docker**: Containerized deployment

### Vercel Deployment

1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

## 🐛 Troubleshooting

### API Connection Issues

- Verify `NEXT_PUBLIC_API_URL` is correct
- Check CORS configuration on backend
- Ensure backend is running

### Build Errors

- Clear `.next` directory: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run build`

### Font Loading Issues

- Ensure fonts are properly imported in `globals.css`
- Check font file paths
- Verify font-face declarations

## 📄 License

ISC

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📞 Support

For support, please open an issue in the repository or contact the development team.

---

**Built with ❤️ for ST Comp Holdings**
