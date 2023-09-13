import userModel from "../Models/userModel.js";
import jwt from 'jsonwebtoken';

export const getAllUser=async (req, res, next) =>{
    try {
        let users = await userModel.find();
        users = users.map(user => {
            console.log(user);
            const {password, ...otherDetails} = user._doc;
            console.log(otherDetails)
            return otherDetails;
        })
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json(error);
    }
}

export const getUser=async(req, res)=>{
    const id=req.params.id;
    try{
        const user = await userModel.findById(id);
        const {password, ...otherDetails} = user._doc;
        if(user){
            res.status(200).json(otherDetails);
        } else{
            res.status(404).json("No such user exist")
        }
    } catch(err){
        res.status(500).json(err);
    }
}

export const updateUser=async (req, res)=>{
    const id=req.params.id;
    const {_id,currentUserAdminStatus,password}=req.body;
    try{
        console.log("param id ",id)
        console.log("body id ",_id)
        if(_id==id){
            if(password){
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(password,salt)
            }
            const user = await userModel.findByIdAndUpdate(id,req.body,{new:true});
            if(user){
                const token = jwt.sign({username : user.username, id:user._id}, process.env.JWT_KEY, {expiresIn: '1h'})
                res.status(200).json(user);
            }
        } else{
            res.status(403).json("Access Denied! You can update only your own profile")
        }
    } catch(error){
        res.status(500).json(error);
    }
}

export const deleteUser = async(req, res) => {
    const id=req.params.id;
    const {currentUserId,currentUserAdminStatus}=req.body;
    if(currentUserId===id || currentUserAdminStatus){
        try{
            const user = await userModel.findByIdAndDelete(id);
            if(user){
                res.status(200).json("user deleted successfully");
            }
        } catch(err){
            res.status(500).json(err)
        }
    } else{
        res.status(403).json("Access Denied! You can delete only your own profile")
    }
}

// follow user
export const followUser=async(req,res)=>{
    const id=req.params.id;
    const {_id}=req.body;
    if(_id===id){
        res.status(403).json("You cannot follow yourself");
    } else{
        try{
            const followUser=await userModel.findById(id);
            const following=await userModel.findById(_id);
            if(!followUser.followers.includes(_id)){
                await followUser.updateOne({$push:{followers:_id}});
                await following.updateOne({$push:{following:id}});
                res.status(200).json('Users followed!')
            } else{
                res.status(403).json("user is already follow by you")
            }
            
        } catch(error){
            res.status(500).json(error);
        }
    }
}

// unfollow user
export const unFollowUser=async(req,res)=>{
    const id=req.params.id;
    const {currentUserId}=req.body;
    if(currentUserId===id){
        res.status(403).json("You cannot Unfollow yourself");
    } else{
        try{
            const followUser=await userModel.findById(id);
            const following=await userModel.findById(currentUserId);
            if(followUser.followers.includes(currentUserId)){
                await followUser.updateOne({$pull:{followers:currentUserId}});
                await following.updateOne({$pull:{following:id}});
                res.status(200).json('Users Unfollowed!')
            } else{
                res.status(403).json("user is not follow by you")
            }
            
        } catch(error){
            res.status(500).json(error);
        }
    }
}