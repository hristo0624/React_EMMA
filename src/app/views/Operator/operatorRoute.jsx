import React from "react";

const operatorRoute = [
  {
    path: "/operatorDetail/:id",
    component: React.lazy(() => import("./tables/operatorTable"))
  }
];

export default operatorRoute;
