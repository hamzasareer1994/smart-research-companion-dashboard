"use client";

import { Theme } from "@radix-ui/themes";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function RadixThemeProvider({ children }: { children: React.ReactNode }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Use Amber/Light as default for SSR to avoid layout shift
  const currentTheme = mounted ? (resolvedTheme as "light" | "dark") : "light";
  const accentColor = currentTheme === "dark" ? "tomato" : "amber";

  return (
    <Theme
      accentColor={accentColor}
      appearance={currentTheme}
      panelBackground="translucent"
      radius="large"
    >
      {children}
    </Theme>
  );
}
