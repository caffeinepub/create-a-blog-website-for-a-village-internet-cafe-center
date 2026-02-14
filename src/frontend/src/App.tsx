import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from 'next-themes';
import HomePage from './pages/HomePage';
import BlogListPage from './pages/BlogListPage';
import BlogPostDetailPage from './pages/BlogPostDetailPage';
import ContactPage from './pages/ContactPage';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminPostsListPage from './pages/admin/AdminPostsListPage';
import AdminPostEditorPage from './pages/admin/AdminPostEditorPage';
import SiteLayout from './components/site/SiteLayout';
import { Toaster } from '@/components/ui/sonner';

// Root route with layout
const rootRoute = createRootRoute({
  component: () => (
    <>
      <SiteLayout>
        <Outlet />
      </SiteLayout>
      <Toaster />
    </>
  ),
});

// Public routes
const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: HomePage,
});

const blogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog',
  component: BlogListPage,
});

const blogPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/blog/$slug',
  component: BlogPostDetailPage,
});

const contactRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/contact',
  component: ContactPage,
});

// Admin routes
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin',
  component: AdminDashboardPage,
});

const adminPostsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/posts',
  component: AdminPostsListPage,
});

const adminPostNewRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/posts/new',
  component: AdminPostEditorPage,
});

const adminPostEditRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/admin/posts/$id/edit',
  component: AdminPostEditorPage,
});

// Create route tree
const routeTree = rootRoute.addChildren([
  indexRoute,
  blogRoute,
  blogPostRoute,
  contactRoute,
  adminRoute,
  adminPostsRoute,
  adminPostNewRoute,
  adminPostEditRoute,
]);

// Create router
const router = createRouter({ routeTree });

// Register router for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
}
