import { Router, Request, Response } from "express";

const router = Router();

router.route("/").get((req: Request, res: Response) => {
    res.status(200).json({ "message": "Everything is fine here 👍...." })
})

export default router