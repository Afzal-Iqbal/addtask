import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import AppSidebarComp from "./side-bar"
import { ModeToggle } from "../components/ui/mode-toggle";

export default function Layout({children}) {
  return (
    <SidebarProvider>
      <AppSidebarComp />
      <main className="w-screen">
        <div className="p-2 flex justify-between items-center w-full border-2">
          <SidebarTrigger />
          <div className="flex items-center gap-2">
          
          <ModeToggle />
          {/* <ProfileMenu /> */}
          

          </div>
        </div>
        {children}
      </main>
    </SidebarProvider>
  );
}