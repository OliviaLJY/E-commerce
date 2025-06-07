import { 
  HomeIcon, LineChartIcon, 
  ShoppingCartIcon, PackageIcon 
} from "lucide-react";
import Index from "./pages/Index.jsx";

export const navItems = [
  {
    title: "Dashboard",
    to: "/",
    icon: <HomeIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Analytics",
    to: "/dashboard",
    icon: <LineChartIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Orders",
    to: "/orders",
    icon: <ShoppingCartIcon className="h-4 w-4" />,
    page: <Index />,
  },
  {
    title: "Products",
    to: "/products",
    icon: <PackageIcon className="h-4 w-4" />,
    page: <Index />,
  }
];
