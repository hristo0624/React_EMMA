import React from "react";

const agentsRoute = [
  {
    path: "/agentDetail/:id",
    component: React.lazy(() => import("./tables/agentTable"))
  }
];

export default agentsRoute;