import { Router } from "express";
import * as mapController from "../controllers/map.controllers";
import * as alertController from "../controllers/alert.controllers";
import * as officialAlertController from "../controllers/officialAlert.controllers";

const apiRoutes = Router();
// map
apiRoutes.get('/map/latest', mapController.returnLatestMapId);
apiRoutes.get('/map', mapController.returnLatestMap);
apiRoutes.post('/map', mapController.updateMap);
// alerts
apiRoutes.get('/alerts', alertController.returnAlerts);
// officialAlerts(proxy)
apiRoutes.get('/official', officialAlertController.returnOfficialRoutes);

export default apiRoutes;