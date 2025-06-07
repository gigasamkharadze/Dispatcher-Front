"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme-toggle"
import { Package, ClipboardList, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { removeAuthCookie } from "@/lib/auth"

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()

  const routes = [
    {
      href: "/bids",
      label: "Bids",
      icon: Package
    },
    {
      href: "/orders",
      label: "Orders",
      icon: ClipboardList
    }
  ]

  const handleLogout = () => {
    removeAuthCookie()
    router.push("/login")
  }

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4 container mx-auto">
        <div className="flex items-center space-x-4">
          {routes.map((route) => {
            const Icon = route.icon
            return (
              <Link
                key={route.href}
                href={route.href}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-md transition-colors",
                  pathname === route.href
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-muted"
                )}
              >
                <Icon className="h-4 w-4" />
                {route.label}
              </Link>
            )
          })}
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>
    </div>
  )
} 