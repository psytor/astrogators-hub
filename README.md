# astrogators-hub

Landing page and authentication hub for The Astrogator's Table - your command center for Star Wars: Galaxy of Heroes optimization tools.

## Features

- **Landing Page**: Showcase of available applications with chamfered card design
- **Authentication System**: Complete user management (registration, login, password reset, email verification)
- **User Profiles**: View account information and access applications
- **Protected Routes**: Secure access to authenticated-only pages
- **Responsive Design**: Mobile-friendly layout

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and building
- **React Router** for navigation
- **@psytor/astrogators-shared-ui** - Shared component library

## Prerequisites

- Node.js 18+
- npm or yarn
- Access to GitHub Packages (for @psytor/astrogators-shared-ui)

## Setup

### 1. Clone and Install

```bash
cd /home/psytor/projects/astro-table/astrogators-hub
npm install
```

### 2. Configure Environment

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and set your backend API URL:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### 3. Run Development Server

```bash
npm run dev
```

The application will be available at http://localhost:5173

## Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check without building
npm run type-check
```

## Project Structure

```
astrogators-hub/
├── src/
│   ├── components/
│   │   └── Layout.tsx       # Shared layout with TopBar/Footer
│   ├── pages/
│   │   ├── HomePage.tsx     # Landing page with app cards
│   │   ├── LoginPage.tsx    # User login
│   │   ├── RegisterPage.tsx # Account creation
│   │   ├── ForgotPasswordPage.tsx
│   │   ├── ResetPasswordPage.tsx
│   │   ├── VerifyEmailPage.tsx
│   │   └── ProfilePage.tsx  # User profile
│   ├── App.tsx              # Main app with routing
│   └── main.tsx             # Entry point
├── public/
├── index.html
├── vite.config.ts
└── package.json
```

## Routes

### Public Routes

- `/` - Landing page (application showcase)
- `/login` - User login
- `/register` - User registration
- `/forgot-password` - Request password reset
- `/reset-password?token=...` - Reset password with token
- `/verify-email?token=...` - Verify email address

### Protected Routes

- `/profile` - User profile (requires authentication)

## Integration with Backend

This application connects to the `astrogators-table` backend API for authentication:

- **Base URL**: Configured via `VITE_API_BASE_URL`
- **API Endpoints**:
  - `POST /api/v1/auth/register` - User registration
  - `POST /api/v1/auth/login` - User login
  - `POST /api/v1/auth/refresh-token` - Token refresh
  - `POST /api/v1/auth/forgot-password` - Request password reset
  - `POST /api/v1/auth/reset-password` - Reset password
  - `POST /api/v1/auth/verify-email` - Verify email
  - `GET /api/v1/users/me` - Get current user

**Authentication Flow**:
1. User logs in → JWT tokens stored in localStorage
2. API client automatically includes access token in requests
3. On 401 error, automatically refreshes token
4. On refresh failure, redirects to login

## Deployment

### Build for Production

```bash
npm run build
```

This creates optimized static files in `dist/` directory.

### Serve with nginx

Example nginx configuration (production):

```nginx
server {
    listen 80;
    server_name astrogators-table.com;

    # Serve static files
    location / {
        root /var/www/astrogators-hub/dist;
        try_files $uri $uri/ /index.html;
    }

    # Proxy API requests to backend
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Docker (Optional)

Create a simple nginx-based Docker container:

```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

## Development

### Adding New Pages

1. Create page component in `src/pages/`
2. Add route in `src/App.tsx`
3. Link from other pages or navigation

### Using Shared Components

Import from the shared UI library:

```tsx
import {
  TopBar,
  Button,
  Card,
  Input,
  useAuth,
} from '@psytor/astrogators-shared-ui';
```

### Styling

- Use CSS modules for component-specific styles
- Import shared CSS: `import '@psytor/astrogators-shared-ui/styles'`
- Use CSS variables from shared library for consistency

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Backend API base URL | `http://localhost:8000` |

## Troubleshooting

### "Cannot find module '@psytor/astrogators-shared-ui'"

Ensure you have a `.npmrc` file with:
```
@psytor:registry=https://npm.pkg.github.com
```

And authenticate with GitHub Packages (see shared-ui README).

### Build Errors

Run type check to see TypeScript errors:
```bash
npm run type-check
```

### API Connection Issues

- Verify `VITE_API_BASE_URL` in `.env`
- Check backend is running on specified port
- Check CORS configuration in backend

## Related Projects

- [astrogators-shared-ui](../astrogators-shared-ui) - Shared component library
- [astrogators-table](../astrogators-table) - Backend API service
- [mod-ledger](../mod-ledger) - Mod analysis backend
- [mod-ledger-ui](../mod-ledger-ui) - Mod analysis frontend (coming soon)

## License

MIT
