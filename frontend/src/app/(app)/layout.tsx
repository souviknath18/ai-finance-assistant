import { cookies } from "next/headers";
import AppLayout from "@/components/layouts/AppLayout";

export default async function ProtectedAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore =
    await cookies();

  const sidebarCollapsed =
    cookieStore.get(
      "sidebarCollapsed"
    )?.value === "true";

  return (
    <AppLayout
      initialSidebarCollapsed={
        sidebarCollapsed
      }
    >
      {children}
    </AppLayout>
  );
}