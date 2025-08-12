import { Home, BookOpen, ListChecks } from "lucide-react"; // ✅ Import icons only once

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const items = [
  // {
  //   title: "add-student",
  //   url: "add-student",
  //   icon: Home,
  // },
  // {
  //   title: "add-course",
  //   url: "add-course",
  //   icon: BookOpen,
  // },
  {
    title: "task-list", // ✅ This will now show Add Task page
    url: "task-list",
    icon: ListChecks,
  },
];

function AppSidebarComp() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Task Manager</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={`/${item.url}`} className="flex items-center gap-2">
                      <item.icon className="w-4 h-4" />
                      <span className="capitalize">{item.title.replace("-", " ")}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

export default AppSidebarComp;