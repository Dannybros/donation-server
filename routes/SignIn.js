import express from 'express'
import bcrypt from 'bcryptjs';
import UserCollection from '../models/UserModel.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv'

dotenv.config();
const route = express.Router();

route.post('/', async(req, res)=>{
    const {username, password} = req.body;

    const existingUser = await UserCollection.findOne({username: username});

    if(!existingUser) return res.status(403).json({status:"error", message:"Username or Password is incorrect"})
    
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password); //123

    if(!isPasswordCorrect) return res.status(403).json({status:"error", message:"Username or Password is incorrect"})

    const secret_key = process.env.AUTHKEY

    const user = {name:username}

    const token = jwt.sign(user, secret_key, {expiresIn: '5h' });

    await res.json({status:"success", token:token})

})

export default route;