import bcrypt from "bcryptjs"
import User from "../models/User.js"
import jwt from "jsonwebtoken"

export const register = async (req, res, next) => {
  try {
    const {name, email, password} = req.body;
    
    // Validate required fields
    if (!name || !email || !password) {
      return res.status(400).json({message:"All fields are required"});
    }
    
    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({message:"Please provide a valid email address"});
    }
    
    // Validate password length
    if (password.length < 8) {
      return res.status(400).json({message:"Password must be at least 8 characters long"});
    }
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({message:"Email already exists"});
    }

    // Hash password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    
    // Create new user
    const newUser = new User({
      name: name,
      email: email,
      password: hash
    })
    
    // Save user to database
    const savedUser = await newUser.save();
    
    if (!savedUser) {
      return res.status(500).json({message:"Failed to create user"});
    }
    
    // Generate JWT token
    const accessToken = jwt.sign(
      { id: savedUser._id, isAdmin: savedUser.isAdmin }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    // Set cookie options
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
      sameSite: 'lax' // Changed from 'strict' to 'lax' for better compatibility
    };

    // Remove password from response
    const { password: userPassword, isAdmin, ...otherDetails } = savedUser._doc;
    
    // Send response with cookie and user data
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json({ user: { ...otherDetails }, isAdmin: isAdmin });
  } catch(err) {
    console.error("Registration error:", err);
    return res.status(500).json({message: err.message || "An error occurred during registration"});
  }
}

export const login = async(req, res, next)=>{
  try{
    const { email, password } = req.body;
    
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({message:"Email and password are required"});
    }
    
    // Validate email format
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({message:"Please provide a valid email address"});
    }
    
    // Find user by email
    const user = await User.findOne({email: email})
    if (!user) {
      return res.status(400).json({message:"User not found. Please check your email or sign up."});
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({message:"Invalid password. Please try again."});
    }
    
    // Generate JWT token
    const accessToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin }, 
      process.env.JWT_SECRET, 
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    // Set cookie options
    const options = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 1 day expiration
      sameSite: 'lax' // Changed from 'strict' to 'lax' for better compatibility
    };

    // Remove password from response
    const { password: userPassword, isAdmin, ...otherDetails } = user._doc;
    
    // Send response with cookie and user data
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .json({ user: { ...otherDetails }, isAdmin: isAdmin });

  }catch(err){
    console.error("Login error:", err);
    return res.status(500).json({message: err.message || "An error occurred during login"});
  }
}

export const logout = async (req, res, next) => {
  try{
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
    });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (err) {
    next(err);
  }
};