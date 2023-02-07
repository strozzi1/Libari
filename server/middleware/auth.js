import Jwt from "jsonwebtoken";


export const requireAuthentication = async (req, res, next) => {
    let authHeader = req.header("Authorization");
    if(!authHeader){
        return res.status(401).send({message: "Access Denied"});
    }
    const authHeaderParts = authHeader.split(' ');
    const token = authHeaderParts[0] === 'Bearer' ?
        authHeaderParts[1] : null;
    
    try {
        const payload = Jwt.verify(token, process.env.JWT_SECRET);
        
        req.userId = payload.id;
        req.role = payload.role; //implement later to have admin, user, moderator
        next();
    } catch (err) {
        console.log(err.message)
        res.status(400).json({error: "Invalid Authorization Token"});
    }
}

export const checkAuthentication = function (req, res, next) {
    /*
     * Authorization: Bearer <token>
     */
    const authHeader = req.get('Authorization') || '';
    const authHeaderParts = authHeader.split(' ');
    const token = authHeaderParts[0] === 'Bearer' ?
      authHeaderParts[1] : null;
  
    try {
      const payload = Jwt.verify(token, secretKey);
      req.userId = payload.userId;
      req.role = payload.role;
      next();
    } catch (err) {
      // if not valid user req.userId and req.role will not be defined
      //req.userId = null;
      //req.role = false;
      next();
    }
  };