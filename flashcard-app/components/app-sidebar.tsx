"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { PlusCircle, Star, Settings, LogOut, PanelLeft } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { CreateDeckDialog } from "@/components/create-deck-dialog";
import { useLogout } from "@/hooks/auth/useAuth";
import { useUserContext } from "@/context/userContext";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchDecks, selectActiveDecks } from "@/store/deckSlice";
import { clearDB } from "@/store/indexedDB";
import { useSyncData } from "@/hooks/sync/useSync";

// // Mẫu dữ liệu cho các bộ thẻ
// const cardDecks = [
//   { id: '1', name: 'Tiếng Anh cơ bản', count: 50 },
//   { id: '2', name: 'Toán học', count: 30 },
//   { id: '3', name: 'Lịch sử Việt Nam', count: 45 },
//   { id: '4', name: 'Khoa học', count: 25 },
//   { id: '5', name: 'Địa lý', count: 35 },
//   { id: '6', name: 'Văn học', count: 40 },
//   { id: '7', name: 'Sinh học', count: 28 },
//   { id: '8', name: 'Hóa học', count: 32 },
//   { id: '9', name: 'Vật lý', count: 27 },
//   { id: '10', name: 'Tin học', count: 22 },
//   { id: '11', name: 'Hóa học', count: 32 },
//   { id: '12', name: 'Vật lý', count: 27 },
//   { id: '13', name: 'Tin học', count: 22 },
//   { id: '14', name: 'Hóa học', count: 32 },
//   { id: '15', name: 'Vật lý', count: 27 },
//   { id: '16', name: 'Tin học', count: 22 },
// ];

function FloatingButton() {
  const { state, toggleSidebar } = useSidebar();

  if (state === "expanded") return null;

  return (
    <Button
      variant="secondary"
      size="icon"
      className="fixed left-4 top-4 z-50 shadow-md bg-opacity-30"
      onClick={toggleSidebar}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Mở sidebar</span>
    </Button>
  );
}

export function AppSidebar() {
  const pathname = usePathname();
  const [isCreateDeckOpen, setIsCreateDeckOpen] = useState(false);
  const router = useRouter();
  const { user, removeUser } = useUserContext();
  const [hoverEnabled, setHoverEnabled] = useState(false);
  const logoutMutation = useLogout();
  const decks = useSelector(selectActiveDecks);
  const dispatch = useDispatch<AppDispatch>();
  const { syncData, isSyncing } = useSyncData();

  const handleLogout = async () => {
    await syncData();
    logoutMutation.mutate(undefined, {
      onSuccess: async () => {
        removeUser();
        clearDB();
        router.push("/login");
      },
    });
  };

  useEffect(() => {
    dispatch(fetchDecks());
  }, [dispatch]);

  useEffect(() => {
    const checkHoverSetting = () => {
      const setting = localStorage.getItem("sidebar:hover");
      setHoverEnabled(setting === "true");
    };

    checkHoverSetting();

    const handleStorageChange = () => {
      checkHoverSetting();
    };

    window.addEventListener("storage", handleStorageChange);

    window.addEventListener("sidebar-settings-changed", checkHoverSetting);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener(
        "sidebar-settings-changed",
        handleStorageChange
      );
    };
  }, []);

  return (
    <>
      <Sidebar
        className={
          hoverEnabled ? "group hover:data-[state=collapsed]:left-0" : ""
        }
      >
        <SidebarHeader className="px-2 py-2">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center">
              <SidebarTrigger />
              <h1 className="ml-2 text-xl font-bold">FlashCards</h1>
            </div>
            <ThemeToggle />
          </div>
          <Button
            className="mt-3 w-full justify-start"
            variant="outline"
            disabled={isSyncing}
            onClick={() => setIsCreateDeckOpen(true)}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Tạo bộ thẻ mới
          </Button>
          <Button
            className=" w-full justify-start"
            variant="outline"
            disabled={isSyncing}
            onClick={() => {
              const fetchSyncData = async () => {
                await syncData();
              };
              fetchSyncData();
            }}
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Đồng bộ hoá dữ liệu
          </Button>
        </SidebarHeader>

        <SidebarContent className="overflow-y-auto">
          <SidebarGroup>
            <SidebarGroupLabel>Thư viện</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    asChild
                    disabled={isSyncing}
                    isActive={pathname === "/dashboard"}
                  >
                    <Link href="/dashboard">
                      <Star className="mr-2 h-4 w-4" />
                      <span>Đã đánh dấu sao</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>

          <SidebarGroup>
            <SidebarGroupLabel>Bộ thẻ của tôi</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {decks.map((deck) => (
                  <SidebarMenuItem key={deck._id}>
                    <SidebarMenuButton
                      asChild
                      disabled={isSyncing}
                      isActive={pathname === `/dashboard/deck/${deck._id}`}
                    >
                      <Link href={`/dashboard/deck/${deck._id}`}>
                        <span>{deck.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                disabled={isSyncing}
                isActive={pathname === "/dashboard/settings"}
              >
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Cài đặt</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem onClick={handleLogout}>
              <SidebarMenuButton>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Đăng xuất</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
          <div className="flex items-center gap-2 p-2">
            <Link href="/dashboard/settings">
              <Avatar className="h-8 w-8 cursor-pointer">
                <AvatarImage src="/avatar.jpg" alt="Avatar" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
            </Link>
            <div className="grid gap-0.5 text-sm">
              <p className="font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">
                {user?.email ?? ""}
              </p>
            </div>
          </div>
        </SidebarFooter>

        <CreateDeckDialog
          open={isCreateDeckOpen}
          onOpenChange={setIsCreateDeckOpen}
        />
      </Sidebar>
      {/* Nút nổi để mở sidebar khi đã đóng */}
      <FloatingButton />
    </>
  );
}
