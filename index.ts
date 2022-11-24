import express from 'express';
import http from 'http';

import cors from 'cors';
import morgan from 'morgan';
import mongoose, { Error } from 'mongoose';
import cron from 'node-cron';

import { ORIGIN_URI, PORT, DB_URI } from './src/config/env';
import apiRoutes from './src/routes/api.routes';

import * as officialAlertService from './src/services/officialAlert.service';

const app = express();
const server = http.createServer(app);

/**
 * Global
 */

declare global {
    var isOfficialServerAlive: boolean | undefined;
}


/**
 * Middleware
 */

// morgan: to make logs
app.use(morgan('tiny'));

// cors: to set Cross-origin Resource Sharing policy
app.use(cors({
    origin: ORIGIN_URI
}));

// parse requests of content-type: application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: false }));
// parse requests of content-type: application/json
app.use(express.json());

// mongoose
mongoose.connect(DB_URI).then(() => {
    console.info(`[DB] Connected.`);
}).catch((err: Error) => {
    console.error(`[ERROR:DB] ${err.message}`);
});

// cron: scheduler
// cron.schedule('* * * * *', () => {
//     officialAlertService.updateOfficialAlerts()
//         .then()
//         .catch((err: Error) => console.error(`[ERROR:updateOfficialAlerts] ${err.message}`))
// });

/**
 * Routes
 */

app.use('/api', apiRoutes);

server.listen(PORT, () => {
    console.info(`Server on http://localhost:${PORT}`);
});