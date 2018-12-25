// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Copyright from "@material-ui/icons/Copyright";
// import ContentPaste from "@material-ui/icons/ContentPaste";
import Notifications from "@material-ui/icons/Notifications";
// core components/views
import DashboardPage from "views/Dashboard/Dashboard.jsx";
import NotificationsPage from "views/Notifications/Notifications.jsx";
import Switch from "views/Switch/Switch.jsx";

const dashboardRoutes = [
  {
    path: "/dashboard",
    sidebarName: "Dashboard",
    navbarName: "Material Dashboard",
    icon: Dashboard,
    component: DashboardPage
  },
  {
    path: "/notifications",
    sidebarName: "Notifications",
    navbarName: "Notifications",
    icon: Notifications,
    component: NotificationsPage
  },
  { path: "/switch",
    sidebarName: "Switch",
    navbarName: "Switch",
    icon: Copyright,
    component: Switch
  },
  { redirect: true, path: "/", to: "/dashboard", navbarName: "Redirect" }
];

export default dashboardRoutes;