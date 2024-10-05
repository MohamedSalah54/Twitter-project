import { generateTokenAndSetcookie } from '../lib/utils/generateToken.js';
import User from '../models/user.model.js';
import bcrypt from 'bcryptjs';


export const signup = async(req,res) =>{
 try{
    const {username,fullName,email,password} = req.body;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!emailRegex.test(email)){
        return res.status(400).json({error:"invalid email format"})
    }
    const existingUser = await User.findOne({username})
    if(existingUser){
        return res.status(400).json({error:"Username is already taken"})
    }
    const existingEmail= await User.findOne({email})
    if(existingEmail){
        return res.status(400).json({error:"The email is already taken"})
    }
    if(password.length<6){
        return res.status(400).json({error:"password must have 6 characters at least."})
    }
    // hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password,salt);

    const user = new User({
        fullName,
        email,
        username,
        password:hashedPassword  
    })

    if(user){
        generateTokenAndSetcookie(user._id,res)
        await user.save();
        res.status(201).json({
            _id:user._id,
            fullName:user.fullName,
            username:user.username,
            email:user.email,
            followers:user.followers,
            following:user.following,
            profileImg:user.profileImg,
            coverImg:user.coverImg,

        })
    }else{
        res.status(400).json({error:"invalid user data"})

    }
 }catch (error){
    console.log("Error in signup controller",error.message);
    
    return res.status(500).json({error:"internal server Error"})
 }
}


export const signin = async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await User.findOne({ username });
      const ifPasswordCorrect = await bcrypt.compare(password, user?.password || "");
  
      if (!user || !ifPasswordCorrect) {
        return res.status(400).json({ error: "Invalid username or password" });
      }
  
      // Generate token and set cookie
      generateTokenAndSetcookie(user._id, res);
  
      return res.status(200).json({
        _id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email,
        followers: user.followers,
        following: user.following,
        profileImg: user.profileImg,
        coverImg: user.coverImg,
      });
    } catch (error) {
      console.log("Error in signin controller:", error.message);
      return res.status(500).json({ error: "Internal server Error" });
    }
  };
  


export const logout = async(req,res) =>{
   try{
     res.cookie("jwt", "",{maxAge:0})
     res.status(200).json({message:"Logout successfully.."})
   }catch(error){
    console.log("Error in logout controller :" ,error.message);
    return res.status(500).json({error:"internal error server"})
    
   }
}

export const getMe = async (req,res) =>{
    try{
        const user = await User.findById(req.user._id).select("-password");
         res.status(200).json(user);
    }catch (error){
        console.log("error",error.message);
       return res.status(500).json({error:"Internal server error controller"})
    }
}
