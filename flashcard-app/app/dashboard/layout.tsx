"use client";
import type React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useUserContext } from "@/context/userContext";
import { GET_USER } from "@/lib/graphql/userGraphQL";
import { useQuery } from "@apollo/client";
import { useEffect } from "react";
import { toast } from "sonner";
import { useSyncData } from "@/hooks/sync/useSync";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser } = useUserContext();
  const { syncData, isSyncing } = useSyncData();
  const { loading } = useQuery(GET_USER, {
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      if (data?.whoami) {
        console.log(data.whoami);
        setUser(data.whoami);
      }
    },
  });

  useEffect(() => {
    const fetchDecksData = async () => {
      try {
        await syncData();
      } catch (error: any) {
        toast.error(error.message);
      }
    };
    fetchDecksData();
  }, [syncData]);

  if (loading || isSyncing) return <div>Loading...</div>;

  return (
    <SidebarProvider>
      <div className="flex flex-1 h-screen">
        <AppSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </SidebarProvider>
  );
}
