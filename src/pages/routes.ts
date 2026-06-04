import { lazy } from "react";

const ChatPage = lazy(() => import("./Chat"));

export default [
  {
    path: "/",
    component: ChatPage,
    index: true,
  },
];
