import bycript from "bcryptjs";
import jwt from "jsonwebtoken";

import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export async function signup(req, res, next) {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        next(errorHandler(400, "All fields are required"));
    }

    const hashedPassword = bycript.hashSync(password, 10);

    const newUser = new User({ username, email, password: hashedPassword });

    try {
        await newUser.save();
        res.json({ message: "User created" });
    } catch (error) {
        next(error);
    }
}

export async function signin(req, res, next) {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(errorHandler(400, "All fields are required"));
    }
    try {
        const validUser = await User.findOne({ email });
        if (!validUser) {
            return next(errorHandler(404, "User not found"));
        }
        const validPassword = bycript.compareSync(password, validUser.password);
        if (!validPassword) {
            return next(errorHandler(400, "Invalid password"));
        }
        const { password: pass, ...user } = validUser._doc;
        const token = jwt.sign(
            {
                id: validUser._id,
                isAdmin: validUser.isAdmin,
            },
            process.env.JWT_SECRET
        );
        res.status(200)
            .cookie("access_token", token, {
                httpOnly: true,
            })
            .json(user);
    } catch (error) {
        next(error);
    }
}

export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user) {
            const token = jwt.sign(
                { id: user._id, isAdmin: user.isAdmin },
                process.env.JWT_SECRET
            );
            const { password, ...newUser } = user._doc;
            return res
                .status(200)
                .cookie("access_token", token, { httpOnly: true })
                .json(newUser);
        } else {
            const genaratedPassword =
                Math.random().toString(36).slice(-8) +
                Math.random().toString(36).slice(-8);
            const hashedPassword = bycript.hashSync(genaratedPassword, 10);
            const newUser = new User({
                username:
                    name.toLowerCase().split(" ").join("") +
                    Math.random().toString(9).slice(-4),
                email,
                password: hashedPassword,
                profilePicture: googlePhotoUrl,
            });
            await newUser.save();
            const token = jwt.sign(
                { id: newUser._id, isAdmin: newUser.isAdmin },
                process.env.JWT_SECRET
            );
            const { password, ...user } = newUser._doc;
            return res
                .status(200)
                .cookie("access_token", token, { httpOnly: true })
                .json(user);
        }
    } catch (error) {
        next(error);
    }
};
