import Link from "next/link";
import Image from "next/image";
import { LayoutGrid, Store, Box, Users, Settings, HelpCircle, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

const mainMenuItems = [
  { name: "Overview", icon: LayoutGrid, href: "/dashboard" },
  { name: "Folder", icon: Store, href: "/folder" },
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
    <div className={cn(
      "bg-white h-screen fixed left-0 top-0 border-r border-gray-200 transition-all duration-300 z-30",
      isOpen ? "w-64" : "w-20"
    )}>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className="absolute -right-3 top-8 bg-white border border-gray-200 rounded-full p-1.5 hover:bg-gray-50"
      >
        <ChevronLeft className={cn(
          "w-4 h-4 text-gray-600 transition-transform duration-300",
          !isOpen && "rotate-180"
        )} />
      </button>

      {/* Logo */}
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8">
            <Image
              src="/enelys-logo.svg"
              alt="Enelys"
              width={32}
              height={32}
              className="w-full h-full"
            />
          </div>
          {isOpen && <span className="text-xl font-semibold">Enelys</span>}
        </Link>
      </div>

      {/* Main Menu */}
      <div className="px-4">
        <div className="mb-2">
          {isOpen && <p className="text-xs font-medium text-gray-400 px-4 mb-2">MAIN MENU</p>}
          <nav className="space-y-1">
            {updatedMainMenuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  item.current
                    ? "bg-teal-600 text-white"
                    : "text-gray-600 hover:bg-gray-50",
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
          {isOpen && <p className="text-xs font-medium text-gray-400 px-4 mb-2">OTHERS</p>}
          <nav className="space-y-1">
            {updatedOtherMenuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  item.current
                    ? "bg-teal-600 text-white"
                    : "text-gray-600 hover:bg-gray-50",
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

      {/* User Profile */}
      {isOpen && (
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-2">
            <div className="w-10 h-10 rounded-full overflow-hidden">
              <Image
                src="/avatar-placeholder.svg"
                alt="User"
                width={40}
                height={40}
                className="w-full h-full"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Miguel Allesandro
              </p>
              <p className="text-xs text-gray-500 truncate">
                mig.allesandro@email.com
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
