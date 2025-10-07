import {
  BarChart3,
  Grid3X3,
  Package,
  ShoppingCart,
  Sun,
  Moon,
  Sparkles,
} from "lucide-react";
import React, { type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useTheme } from "next-themes";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "../ui/button";

// ------------------ Small Header Components ------------------

export const DashboardHeader = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <header className={`mb-6 space-y-2 ${className}`}>{children}</header>
);

export const DashboardTitle = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <h1 className={`text-2xl font-bold tracking-tight ${className}`}>
    {children}
  </h1>
);

export const DashboardDescription = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <p className={`text-muted-foreground ${className}`}>{children}</p>
);

// ------------------ Main Layout ------------------

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const menuItems = [
    // {
    //   icon: ShoppingCart,
    //   label: "Create Order",
    //   href: "/dashboard",
    // },
    {
      icon: Grid3X3,
      label: "Category Management",
      href: "/categories",
    },
    {
      icon: Package,
      label: "Product Management",
      href: "/products",
    },
    {
      icon: BarChart3,
      label: "Sales Dashboard",
      href: "/sales",
    },
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <div className="flex h-screen w-full bg-gradient-to-br from-background via-background to-muted/30">
        {/* SIDEBAR */}
        <Sidebar className="border-r bg-gradient-to-b from-white/90 to-gray-50 dark:from-gray-900/90 dark:to-gray-950/90 backdrop-blur-md shadow-sm">
          {/* Header */}
          <SidebarHeader className="flex items-center gap-2 p-4 border-b border-border/50">
            <Sparkles className="text-primary h-6 w-6" />
            <h2 className="text-lg font-semibold tracking-tight">Simple POS</h2>
          </SidebarHeader>
          

          {/* Menu */}
          <SidebarContent className="px-3 py-4 space-y-1">
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  tooltip="Create Order"
                  isActive={router.pathname.includes("/dashboard")}
                >
                  <Link href="/dashboard">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Create Order
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

          <SidebarSeparator className="my-2" />
              {menuItems.map(({ icon: Icon, label, href }) => {
                const isActive = router.pathname.includes(href);
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={label}
                      className={`group flex items-center rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-primary/10 text-primary border border-primary/20"
                          : "text-muted-foreground hover:bg-muted/40 hover:text-foreground"
                      }`}
                    >
                      <Link href={href}>
                        <Icon className="mr-2 h-4 w-4 transition-transform" />
                        {label}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>

          {/* Footer */}
          <SidebarFooter className="p-4 border-t border-border/50 mt-auto flex flex-col gap-3">
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="flex items-center justify-center gap-2"
            >
              {theme === "dark" ? (
                <>
                  <Sun className="w-4 h-4" /> Light Mode
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4" /> Dark Mode
                </>
              )}
            </Button> */}
            <p className="text-xs text-muted-foreground text-center">
              Simple POS <span className="text-foreground/80">v1.0</span>
            </p>
          </SidebarFooter>
        </Sidebar>

        {/* MAIN CONTENT */}
        <main className="relative flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
};
