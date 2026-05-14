import { RouterProvider } from "@tanstack/react-router";
import { useState } from "react";
import { getRouter } from "./router";

export default function App() {
  const [router] = useState(() => getRouter());

  return <RouterProvider router={router} />;
}
