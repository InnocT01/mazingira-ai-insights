import {
  Sun, CloudRain, Map, TrendingUp, Bot, Newspaper,
  Info, Mail, Leaf, FlaskConical, LogIn, Radio
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import logo from "@/assets/logo_mazingira.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";

const AppSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const { user } = useAuth();
  const { t } = useLanguage();

  const mainNav = [
    { title: t("nav.current"), url: "/", icon: Sun },
    { title: t("nav.opendata"), url: "/open-data", icon: CloudRain },
    { title: t("nav.maps"), url: "/maps", icon: Map },
    { title: t("nav.trends"), url: "/trends", icon: TrendingUp },
    { title: t("nav.ai"), url: "/ai", icon: Bot },
    { title: t("nav.media"), url: "/media", icon: Newspaper },
    { title: "EcoKids Sentinel", url: "/ecokids", icon: Radio },
  ];

  const accountNav = user
    ? [
        { title: t("nav.farmer_dashboard"), url: "/dashboard", icon: Leaf },
        { title: t("nav.researcher_dashboard"), url: "/researcher", icon: FlaskConical },
      ]
    : [{ title: t("nav.signin"), url: "/login", icon: LogIn }];

  const moreNav = [
    { title: t("nav.about"), url: "/about", icon: Info },
    { title: t("nav.contact"), url: "/contact", icon: Mail },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-3">
        <a href="/" className="flex items-center gap-2">
          <img src={logo} alt="Mazingira" className="h-8 w-8 rounded-md object-cover" />
          {!collapsed && (
            <span className="font-display font-bold text-sm text-foreground">
              Mazingira Cloud
            </span>
          )}
        </a>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>{!collapsed && t("nav.data")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end className="hover:bg-muted/50" activeClassName="bg-primary/10 text-primary font-medium">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{!collapsed && t("nav.account")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {accountNav.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end className="hover:bg-muted/50" activeClassName="bg-primary/10 text-primary font-medium">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>{!collapsed && t("nav.more")}</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {moreNav.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink to={item.url} end className="hover:bg-muted/50" activeClassName="bg-primary/10 text-primary font-medium">
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        {!collapsed && (
          <p className="text-[10px] text-muted-foreground text-center">
            © {new Date().getFullYear()} Mazingira Cloud
          </p>
        )}
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
