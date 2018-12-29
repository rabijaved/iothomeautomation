// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Copyright from "@material-ui/icons/Copyright";
// import ContentPaste from "@material-ui/icons/ContentPaste";
import Notifications from "@material-ui/icons/Notifications";
// core components/views
import DashboardPage from "views/Dashboard/Dashboard.jsx";
import Switch from "views/Switch/Switch.jsx";
import DHT11 from "views/DHT11/DHT11.jsx";

const dashboardRoutes = [
  {
    path: "/dashboard",
    sidebarName: "Dashboard",
    navbarName: "",
    icon: Dashboard,
    component: DashboardPage
  },
  {
    path: "/dht11",
    sidebarName: "Temperature",
    navbarName: "Temperature & Humidity",
    icon: Notifications,
    component: DHT11
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
