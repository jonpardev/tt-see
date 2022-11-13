import { Request, Response } from "express";
import { getOfficialRoutes } from "../services/officialAlert.service";

export const returnOfficialRoutes = (req: Request, res: Response) => {
    getOfficialRoutes()
        .then((routes => res.status(200).json(routes)))
        .catch(() => res.sendStatus(500));
}