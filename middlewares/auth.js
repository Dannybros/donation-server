import jwt from 'jsonwebtoken';

const auth = async(req, res, next)=>{
    const authHeader = req.headers['authorization'];

    const token = authHeader && authHeader.split(' ')[1];

    if(!token) return res.status(403).json({message: "A token is required for authentication"});

    try {
        jwt.verify(token, process.env.AUTHKEY);
    } catch (err) {
        return res.status(401).send({message: "Invalid Token"});
    }

    return next();
}

export default auth