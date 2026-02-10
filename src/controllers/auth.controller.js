import { matchedData } from 'express-validator'
import jwt from 'jsonwebtoken';
import * as authService from '../services/auth.service.js'
import RefreshToken from '../models/refresh.model.js';
import Users from '../models/user.model.js';

export const createUser = async (req, res, next) => {
    const data = req.body;
    console.log(data);
    try{
        const newUser = await authService.createUser(data);
        res.status(201).json(newUser);
    }catch(err){
        next(err);
    }
}

export const loginUser = async (req, res, next) => {
    const data = req.body;
    try{
        const user = await authService.loginUser(data);
        const accessToken = authService.generateAccessToken(user);
        const refreshToken = authService.generateRefreshToken(user);
        
        await RefreshToken.create({
            token: refreshToken,
            userId: user._id
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,      // JS cannot access (XSS protection)
            secure: false,       // true in HTTPS
            sameSite: 'strict',  // CSRF protection
            maxAge: 60 * 60 * 1000
        })
        res.status(200).json({
            access_token: accessToken,
            refresh_token:refreshToken
        });

    }catch(err){
        next(err);
    }
}

export const refreshAccessToken = async (req, res, next) => {
    try{
        const token = req.cookies?.refreshToken || req.body?.refreshToken;
        if(!token){
            throw new Error("Refresh token is required");
        }

        const stored = await RefreshToken.findOne({ token });
        if(!stored){
            throw new Error("Invalid refresh token");
        }

        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        const user = await Users.findById(decoded.id);
        if(!user){
            throw new Error("User not found");
        }

        const accessToken = authService.generateAccessToken(user);
        res.status(200).json({ access_token: accessToken });
    }catch(err){
        next(err);
    }
}

export const logoutUser = async (req, res, next) => {
    try{
        const token = req.cookies?.refreshToken || req.body?.refreshToken;
        if(token){
            await RefreshToken.deleteOne({ token });
        }

        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: false,
            sameSite: 'strict',
        });

        res.status(200).json({ message: "Logged out" });
    }catch(err){
        next(err);
    }
}
