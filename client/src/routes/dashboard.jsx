// @material-ui/icons
import Dashboard from "@material-ui/icons/Dashboard";
import Copyright from "@material-ui/icons/Copyright";
import Home from "@material-ui/icons/Home";
import BrightnessMedium from "@material-ui/icons/BrightnessMedium";
// import ContentPaste from "@material-ui/icons/ContentPaste";
import Notifications from "@material-ui/icons/Notifications";
// core components/views
import DashboardPage from "views/Dashboard/Dashboard.jsx";
import Switch from "views/Switch/Switch.jsx";
import DHT11 from "views/DHT11/DHT11.jsx";
import Motion from "views/Motion/Motion.jsx";
import AmbLight from "views/AmbLight/AmbLight.jsx";
import Plant1 from "views/Plant/PlantSensor_1.jsx";

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
  { path: "/motion",
    sidebarName: "Motion",
    navbarName: "Motion",
    icon: Home,
    component: Motion
  },
  { path: "/ambLight",
    sidebarName: "Light Intensity",
    navbarName: "Light Intensity",
    icon: BrightnessMedium,
    component: AmbLight
  },
  { path: "/plant",
    sidebarName: "Soil Moisture",
    navbarName: "Soil Moisture",
    icon: BrightnessMedium,
    component: Plant1
  },
  { redirect: true, path: "/", to: "/dashboard", navbarName: "Redirect" }
];

export default dashboardRoutes;
