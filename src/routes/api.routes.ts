import { Router } from "express";
import * as mapController from "../controllers/map.controllers";
import * as alertController from "../controllers/alert.controllers";

const apiRoutes = Router();
// map
apiRoutes.get('/map/latest', mapController.returnLatestMapId);
apiRoutes.get('/map', mapController.returnMap);
// alerts
apiRoutes.get('/alerts', alertController.returnAlerts);

export default apiRoutes;