import { Suspense } from "react";
import { Routing } from "@/pages";
import "@fontsource/forum";
import "@fontsource/playfair-display";
import "./index.scss";

export function App() {
  return (
    <Suspense fallback={"Loading..."}>
      <Routing />
    </Suspense>
  );
}
