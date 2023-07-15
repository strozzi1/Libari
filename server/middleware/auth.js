import Jwt from "jsonwebtoken";


export const requireAuthentication = async (req, res, next) => {
   // console.log(req)
    let authHeader = req.header("Authorization");
    if(!authHeader){
        return res.status(401).send({message: "Access Denied"});
    }
    const authHeaderParts = authHeader.split(' ');
    const token = authHeaderParts[0] === 'Bearer' ?
        authHeaderParts[1] : null;
    const isCustomAuth = token.length < 500;
    
    try {
        if(isCustomAuth){
            const payload = Jwt.verify(token, process.env.JWT_SECRET);
            req.userId = payload.id;
            req.role = payload.role; //implement later to have admin, user, moderator
        } else {
            const payload = Jwt.decode(token)
            req.googleId = payload.sub
            
        }
        
        next();
    } catch (err) {
        console.log(err.message)
        res.status(400).json({message: "Invalid Authorization Token"});
    }
}

export const checkAuthentication = function (req, res, next) {
    /*
     * Authorization: Bearer <token>
     */
    let authHeader = req.header("Authorization") || '';
    
    if(authHeader === ''){
        console.log("no auth")
        next();
        return
    }
    const authHeaderParts = authHeader.split(' ');
    const token = authHeaderParts[0] === 'Bearer' ?
        authHeaderParts[1] : null;

    try {
        const payload = Jwt.verify(token, secretKey);
        req.userId = payload.userId;
        req.role = payload.role;
        next();
    } catch (err) {
        console.log("not logged in");
        next();
    }
};