import React from "react";
import { Redirect } from "react-router-dom";

import dashboardRoutes from "./views/dashboard/DashboardRoutes";
import utilitiesRoutes from "./views/utilities/UtilitiesRoutes";
import sessionRoutes from "./views/sessions/SessionRoutes";

import materialRoutes from "./views/material-kit/MaterialRoutes";
import dragAndDropRoute from "./views/Drag&Drop/DragAndDropRoute";

import formsRoutes from "./views/forms/FormsRoutes";
import mapRoutes from "./views/map/MapRoutes";
import operatorsRoute from './views/Operators/operatorsRoute';
import operatorRoute from './views/Operator/operatorRoute';
import agentsRoute from './views/agents/agents';
import agentRoute from './views/agent/agent';

const redirectRoute = [
  {
    path: "/",
    exact: true,
    component: () => <Redirect to="/operators" />
  }
];

const errorRoute = [
  {
    component: () => <Redirect to="/session/404" />
  }
];

const routes = [
  ...sessionRoutes,
  ...dashboardRoutes,
  ...materialRoutes,
  ...utilitiesRoutes,
  ...dragAndDropRoute,
  ...formsRoutes,
  ...mapRoutes,
  ...operatorsRoute,
  ...operatorRoute,
  ...agentsRoute,
  ...agentRoute,
  ...redirectRoute,
  ...errorRoute,
];

export default routes;
