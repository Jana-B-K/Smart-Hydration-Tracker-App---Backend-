import jwt from 'jsonwebtoken'
export default function authMiddleware(req, res, next) {
    try{
        const token = req.headers.authorization?.split(' ')[1]; 
        
        if(!token){
            throw new Error("Token is not available")  
        }
        const decode = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); 
        req.user = decode;
        console.log("User verified")
        next();
    
    }catch(err) { 
        next(err);
    }
}