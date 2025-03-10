"use client";
import type React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useUserContext } from "@/context/userContext";
import { GET_USER } from "@/lib/graphql/userGraphQL";
import { useQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { syncData } from "@/lib/graphql/syncGraphQL";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser } = useUserContext();
  const [isSyncLoading, setIsSyncLoading] = useState<boolean>(true);
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
    try {
      const fetchDecksData = async () => {
        await syncData();
      };
      fetchDecksData();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSyncLoading(false);
    }
  }, []);

  if (loading || isSyncLoading) return <div>Loading...</div>;

  return (
    <SidebarProvider>
      <div className="flex flex-1 h-screen">
        <AppSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </SidebarProvider>
  );
}
