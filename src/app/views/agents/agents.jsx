import React from "react";

const agentsRoute = [
  {
    path: "/agents",
    component: React.lazy(() => import("./tables/AppTable"))
  }
];

export default agentsRoute;