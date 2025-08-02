import express from 'express';
import { registerUser, loginUser, logoutUser, authMiddleware} from '../../controllers/auth/auth-controller.js'


const router = express.Router();

router.post('/register',registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.get('/check-auth',authMiddleware, (req,res)=>{
    const user = req.user;
    try{
        res.status(200).json({
            success: true,
            message : " Authenticated user",
            user: user
        })
    }
    catch(err){
        res.status(500).json({
            success: false,
            message : "Error while checking authentication"
        })
    }
})

export default router;