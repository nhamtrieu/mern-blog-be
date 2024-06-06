import express from "express";
import {
    updateUser,
    deleteUser,
    signout,
    getusers,
    getuser,
} from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const route = express.Router();

route.get("/test", (req, res) => {
    res.json({ message: "User route" });
});

route.put("/update/:userId", verifyToken, updateUser);
route.delete("/delete/:userId", verifyToken, deleteUser);
route.post("/signout", signout);
route.get("/getusers", verifyToken, getusers);
route.get("/:userId", getuser);

export default route;
