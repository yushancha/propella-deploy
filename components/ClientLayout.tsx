"use client";
import React, { useEffect } from "react";
import { SessionProvider } from "next-auth/react";

import { usePathname } from "next/navigation";
import LeftSidebar from "./LeftSidebar";
import { ThemeProvider } from "../contexts/ThemeContext";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // 不需要侧边栏的页面
  const noSidebarPages = ['/login', '/auth/error', '/', '/landing'];
  const showSidebar = !noSidebarPages.includes(pathname);

  useEffect(() => {
    document.body.style.fontFamily =
      'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  }, []);

  return (
    <SessionProvider>
      <ThemeProvider>
        <div className="flex min-h-screen bg-bg-primary" id="app-container">
          {/* 左侧导航栏 */}
          {showSidebar && <LeftSidebar />}

          {/* 主内容区 */}
          <main
            className={`flex-1 min-h-screen transition-all duration-300 ease-in-out ${
              showSidebar ? 'lg:ml-64' : 'ml-0'
            }`}
            id="main-content"
          >
            <div className="relative min-h-screen">
              {/* 移动端顶部间距 */}
              {showSidebar && <div className="h-16 lg:hidden" />}
              {children}
            </div>
          </main>
        </div>
      </ThemeProvider>
    </SessionProvider>
  );
}