import { Outlet, Link, createRootRoute, HeadContent, Navigate, Scripts, useLocation } from "@tanstack/react-router";

import appCss from "../styles.css?url";
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
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "FootyVerse" },
      { name: "description", content: "FootyVerse football intelligence dashboard." },
      { name: "author", content: "FootyVerse" },
      { property: "og:title", content: "FootyVerse" },
      { property: "og:description", content: "FootyVerse football intelligence dashboard." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:site", content: "@FootyVerse" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      {
        rel: "icon",
        type: "image/png",
        href: "/favicon.png",
      },
      {
        rel: "apple-touch-icon",
        href: "/favicon.png",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

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
