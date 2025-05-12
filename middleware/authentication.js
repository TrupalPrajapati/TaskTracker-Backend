const  {getUser} = require("../services/jwtAuth");

const restrictToLoggedInUserOnly = async(req,res,next) => {
    
    //take the UID(token with Bearer) from the headers (it is with Bearer)
    const userUId = req.headers.authorization;
    console.log("Authorization Header:", req.headers.authorization);
    
    //we get the token part from the Bearer + token
    const token = userUId.split(" ")[1];
    console.log(token);
    

    //check for uid is there or not if not then return error
    if(!token){
        return res.status(404).json({message:"Token is wrong"})
    }

    //call the getUser() for verify the token is valid or not
    const user = getUser(token);

    if(!user){
        return res.status(404).json({message:"Login Failed"})
    }

    //fetch userId from the user
    try {
      const user = getUser(token);
      req.user = user;
      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid or expired token" });
    }


    //if the toen verification is complete then we can proceed to restricted apis
    // next();
}

module.exports = {
    restrictToLoggedInUserOnly
}
