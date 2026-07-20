import type { ReactNode } from "react";
import { MapShell } from "@/components/layout/map-shell";

export default function MapLayout({ children }: { children: ReactNode }) {
  return <MapShell>{children}</MapShell>;
}
