import User from "../models/user.model";
import { apiError } from "../utils/apiError";
import { asyncHandler } from "../utils/asyncHandler";
import jwt from 'jsonwebtoken'

const VerifyJwt = asyncHandler((req,res,next) => {

   try {
     const token = req.cookie?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
 
     if(!token){
         throw new apiError(401,"unauthorized request")
     }
 
     const decodedToken = jwt.verify(token,process.env.ACCESS_TOKEN_SECRET);
 
     const user = User.findById(decodedToken?._id).select("-password -refreshToken")
 
     if(!user) throw new apiError(401,"invalid access token");
 
     req.user = user;
     
     next();

   } catch (error) {
    throw new apiError(401,"invalid access token")
   }

})