"use client";
import type React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useUserContext } from "@/context/userContext";
import { GET_USER } from "@/lib/graphql/user/useUser";
import { useQuery } from "@apollo/client";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { setUser } = useUserContext();
  const { loading } = useQuery(GET_USER, {
    fetchPolicy: "no-cache",
    onCompleted: (data) => {
      if (data?.whoami) {
        console.log(data.whoami);
        setUser(data.whoami);
      }
    },
  });

  if (loading) return <div>Loading...</div>;

  return (
    <SidebarProvider>
      <div className="flex flex-1 h-screen">
        <AppSidebar />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </SidebarProvider>
  );
}
