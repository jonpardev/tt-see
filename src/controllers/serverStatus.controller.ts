import { Request, Response } from "express";

export const returnServerStatus = (req: Request, res: Response) => {
    res.status(200).json({
        officialServer: globalThis.isOfficialServerAlive,
        // dbServer: globalThis.isAtlasAlive,
    })
}