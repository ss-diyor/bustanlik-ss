import { createBrowserRouter } from "react-router";
import Root from "./pages/Root";
import ClassView from "./pages/ClassView";
import Home from "./pages/Home";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "class/:classId", Component: ClassView },
    ],
  },
]);
