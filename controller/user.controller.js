import User from "../models/user.model.js";
import { uploadOnCloudinary } from "../services/cloudinary.services.js";
import { ApiError } from "../utils/apiError.js";
import { apiRresponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const generateAccessTokenandRefreshToken = async(userId) =>{
  console.log("userId", userId);
  try {
    const user =await User.findById({_id:userId});

    console.log("user:",user);

    const accessToken=user.generateAccessToken();
    const refreshToken=user.generateRefreshToken();

    user.refreshToken = refreshToken;

    await user.save({ validateBeforeSave: false });

    return {accessToken,refreshToken};

  } catch (error) {
    console.log('error:',error);
   throw new ApiError(500, "something went wrong while generating access or refresh tokens",error);    
  }
}

export const registerUser = asyncHandler( async (req, res) => {
  // check if user already exists: username, email
  // check for images, check for avatar
  // upload them to cloudinary, avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return res

  const { username, email, fullName, password } = req.body;
    if (
      [username, email, fullName, password].some(
        (item, index) => item.trim() === ""
      )
    ) {
      throw new ApiError(404, "all fields are required");
    }
    const exist_user =await User.findOne({ $or: [{ email }, { username }] });

    if (exist_user) {
      throw new ApiError(409, "user already exists");
    }

    const avatarlocalPath = req.files.avatar[0]?.path;

    console.log("avatar::::", avatarlocalPath);

    if (!avatarlocalPath) {
      throw new ApiError(404, "avatar file is required");
    }

    const avatarOnCloud = await uploadOnCloudinary(avatarlocalPath);

    const user = User.create(
      { 
      email, 
      password,
      fullName,
      username:username,
      avatar:avatarOnCloud?.url
    }
    );

    if (user) {
      return res.status(201).json({ msg: "User created successfully" });
    }
});

export const loginUser = asyncHandler( async (req, res) => {

  //request body data
  //usename and email
  //find the user
  //check password
  //access token and refresh token
  //send cookies

   const { username, email, password } = req.body;

    if (
      [username, email, password].some(
        (item, index) => !item || item.trim() === ""
      )
    ) {
      throw new ApiError(404, "all fields are required");
    }

   const user =await User.findOne({$or:[{username},{email}]})
 
   if(!user) {
     throw new ApiError(404, "user not found");
   }
 
   const isPasswordCorrect = user.isPasswordCorrect(password);
 
   if(!isPasswordCorrect) {
     throw new ApiError(404,"password incorrect");
   }
 
   const {accessToken,refreshToken} =await generateAccessTokenandRefreshToken(user._id);
 
   const loggedInUser = await User.findById(user._id).select("-password -refreshToken");
 
   const option = {
     httpOnly:true,
     secure:true,
   }
 
   return res.status(200)
          .cookie("accessToken",accessToken,option)
          .cookie("refreshToken",refreshToken,option)
          .json({msg:"user logged in successfully",user:loggedInUser,accessToken, refreshToken })
});

export const logoutUser = async (req, res) => {
  const user = req.user._id;

  await User.findByIdAndUpdate(
    {_id:user},
    {
      $set:{
        refreshToken:undefined,
      },
      },
      {
          new:true,
      })

      const option = {
        httpOnly:true,
        secure:true,
      }
      res.status(200)
      .clearCookie("accessToken",option)
      .clearCookie("refreshToken",option)
      .json(new apiRresponse(200,{},"Logout successfully"))
}

export const updateProfile = async (req, res) => {
  const { email, fullName } = req.body;

  if ([email, fullName].some((item, index) => item.trim() === "")) {
    throw new ApiError(404, "all fields are required");
  }

  const user = await User.findOneAndUpdate({
    email:email,
    fullName:fullName,
  })

  if (!user) {
    throw new ApiError(404, "user not found");
  }

  return res.status(201).json({ msg: "User updated successfully" });
};

export const user_delete = async (req, res) => {
  const { email, password} = req.body;

  if ([email, password].some((item, index) => item.trim() === "")) {
    throw new ApiError(404, "all fields are required");
  }

  const user = await User.findOneAndDelete({
    email:email,
    password:password,
  })

  if (!user) {
    throw new ApiError(404, "user not found");
  }

 return res.status(201).json({ msg: "User deleted successfully" });
}