import React from "react";

const operatorsRoute = [
  {
    path: "/operators",
    component: React.lazy(() => import("./tables/AppTable"))
  }
];

export default operatorsRoute;
