import { Outlet, Link, createRootRoute, Navigate, useLocation } from "@tanstack/react-router";

import { AppProvider, AuthProvider, useAuth } from "../store/appContext";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/layout/Footer";
import { DeepNavyBackground } from "../components/three/DeepNavyBackground";
import { ParticleField } from "../components/three/ParticleField";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go home
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootComponent() {
  return (
    <AppProvider>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
    </AppProvider>
  );
}

function AuthGate() {
  const { isLoggedIn, isLoading } = useAuth();
  const location = useLocation();
  const isAuthRoute = location.pathname === "/login" || location.pathname === "/signup";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg px-4">
        <div className="glass-strong rounded-lg px-6 py-5 text-sm text-text-muted">Loading FootyVerse...</div>
      </div>
    );
  }

  if (!isLoggedIn && !isAuthRoute) {
    return <Navigate to="/signup" replace />;
  }

  if (isLoggedIn && isAuthRoute) {
    return <Navigate to="/" replace />;
  }

  if (isAuthRoute) {
    return <Outlet />;
  }

  return (
    <>
      <DeepNavyBackground />
      <ParticleField />
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
}
