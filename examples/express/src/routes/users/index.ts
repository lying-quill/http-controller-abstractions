import express from "express";
import _get from "./_get";

const router = express.Router();

router.use("/users", _get);

export default router;
