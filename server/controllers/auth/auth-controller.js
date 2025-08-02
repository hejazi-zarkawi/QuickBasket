import jwt from "jsonwebtoken";
import User from "../../models/User.js";
import bcrypt from "bcryptjs";

export const registerUser = async (req,res)=>{
    const { userName, email, password} = req.body;
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    try{

        if (!usernameRegex.test(userName)) {
            return res.status(400).json({
                success: false,
                message: "Username must be 3-20 characters long and can only contain letters, numbers, and underscores."
            });
        }
        const hashPassword = await bcrypt.hash(password, 12);

        if(!userName || !email || !password){
            return res.status(400).json({success: false, message: "Please fill all the fields!"})
        }

        const existingUser = await User.findOne({$or : [{userName},{email}]});
        if(existingUser){
            return res.status(400).json({success: false, message: "User Already Exists!"})
        }

        const newUser = new User({
            userName,
            email,
            password: hashPassword,
        })

        await newUser.save();

        
        return res.status(201).json({ success: true, message: "User registered successfully",})
    }
    catch(err){
        console.log(err);
        return res.status(500).json({ success : false, message: "Error while registering user"});
    }
} 

export const loginUser = async(req,res) =>{
    const { email,password} = req.body;
   
    try{

        if(!email || !password){
            return res.status(400).json({success:false, message: "Please fill all the fields!"})
        }

        const existingUser = await User.findOne({email});
        if(!existingUser){
            return res.status(400).json({success: false, message: " User doesn't exist! Please register first."})
        }
        else{
            const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
            if(!isPasswordCorrect){
                return res.status(400).json({success: false, message: "Incorrect Password! Try again."})
            }
            else{

                const token = jwt.sign({
                    id: existingUser._id,
                    email: existingUser.email,
                    role: existingUser.role,
                    userName: existingUser.userName
                },'SECRET_KEY', { expiresIn: '1d'});

                // const cookieOptions ={
                //     httpOnly: true,
                //     secure: false,
                //     maxAge : 24 * 60 * 60 * 1000,
                // }

                // res.cookie('token', token, cookieOptions)
                const {password, ...userData} = existingUser._doc;
                console.log(userData)
                return res.status(200).json({
                    success: true,
                    message: "User logged in successfully",
                    token, 
                    user: userData
                });
            }

        }
    }
    catch(err){
        return res.status(500).json({success: false, message: "Error while logging in user"})
    }
}

export const logoutUser = async(req,res)=>{
    res.clearCookie('token');
    return res.status(200).json({
        success: true,
        message : "User logged out successfully!"
    })
}

// export const authMiddleware = async(req,res,next)=>{
//     const token = req.cookies.token;
//     if(!token){
//         return res.status(401).json({
//             success: false,
//             message : "Not Authenticated! Please login first."
//         })
//     }

//     try{
//         const decoded = jwt.verify(token, 'SECRET_KEY');
//         req.user = decoded;
//         next();
//     }
//     catch(error){
//         return res.status(500).json({
//             sucess: false,
//             message: "Error while authenticating user."
//         })
//     }
// }

export const authMiddleware = async(req,res,next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if(!token){
        return res.status(401).json({
            success: false,
            message : "Not Authenticated! Please login first."
        })
    }

    try{
        const decoded = jwt.verify(token, 'SECRET_KEY');
        req.user = decoded;
        next();
    }
    catch(error){
        return res.status(500).json({
            sucess: false,
            message: "Error while authenticating user."
        })
    }
}

