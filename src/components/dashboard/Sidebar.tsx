import Link from "next/link";
import Image from "next/image";
import { LayoutGrid, Store, Box, Users, Settings, HelpCircle, ChevronLeft, Folder } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const mainMenuItems = [
  { name: "Overview", icon: LayoutGrid, href: "/dashboard" },
  { name: "Folder", icon: Folder, href: "/folder" },
  { name: "Explore", icon: Box, href: "/explore" },
  { name: "AI", icon: Users, href: "/ai" },
];

const otherMenuItems = [
  { name: "Setting", icon: Settings, href: "/settings" },
  { name: "Help Center", icon: HelpCircle, href: "/help" },
];

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const pathName = usePathname();

  // Cập nhật `current` cho mỗi item dựa trên pathname hiện tại
  const updatedMainMenuItems = mainMenuItems.map((item) => ({
    ...item,
    current: pathName === item.href, // so sánh đường dẫn hiện tại với href của item
  }));

  const updatedOtherMenuItems = otherMenuItems.map((item) => ({
    ...item,
    current: pathName === item.href, // tương tự cho mục khác
  }));

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 flex flex-col bg-background border-r border-border transition-all duration-300",
        isOpen ? "w-64" : "w-20"
      )}
    >
      {/* Logo */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-border">
        {isOpen ? (
          <Link href="/dashboard" className="flex items-center gap-2">
            <Image
              src="/fusion-logo.svg"
              alt="Fusion"
              width={24}
              height={24}
              className="w-6 h-6"
            />
            <span className="text-lg font-semibold text-foreground">Fusion</span>
          </Link>
        ) : (
          <Image
            src="/fusion-logo.svg"
            alt="Fusion"
            width={24}
            height={24}
            className="w-6 h-6 mx-auto"
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4">
        <div className="px-4">
          <div className="mb-2">
            {isOpen && <p className="text-xs font-medium text-muted-foreground px-4 mb-2">MAIN MENU</p>}
            <nav className="space-y-1">
              {updatedMainMenuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    item.current
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                    !isOpen && "justify-center px-2"
                  )}
                  title={!isOpen ? item.name : undefined}
                >
                  <item.icon className="w-5 h-5" />
                  {isOpen && item.name}
                </Link>
              ))}
            </nav>
          </div>

          {/* Other Menu */}
          <div className="mt-8">
            {isOpen && <p className="text-xs font-medium text-muted-foreground px-4 mb-2">OTHERS</p>}
            <nav className="space-y-1">
              {updatedOtherMenuItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                    item.current
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-accent",
                    !isOpen && "justify-center px-2"
                  )}
                  title={!isOpen ? item.name : undefined}
                >
                  <item.icon className="w-5 h-5" />
                  {isOpen && item.name}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-border">
        <button
          onClick={onToggle}
          className={cn(
            "w-full flex items-center gap-3 p-2 text-sm font-medium rounded-lg transition-colors text-muted-foreground hover:text-foreground hover:bg-accent",
            !isOpen && "justify-center"
          )}
        >
          <ChevronLeft className={cn("w-5 h-5 transition-transform", !isOpen && "rotate-180")} />
          {isOpen && "Collapse"}
        </button>
      </div>
    </aside>
  );
}
