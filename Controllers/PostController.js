import mongoose from "mongoose";
import PostModel from "../Models/postModel.js";
import userModel from "../Models/userModel.js";

export const createPost = async(req, res, next) =>{
 const newPost = new PostModel(req.body);
 try{
    await newPost.save();
    res.status(200).json("Post Created");

 } catch(error){
    res.status(500).json(error);
 }
}

export const getPost=async (req, res) => {
   try{
      const post = await PostModel.findById(req.params.id);
      res.status(200).json(post);

   } catch(err){
      res.status(500).json(err);
   }
}

export const updatePost=async(req, res)=>{
   const postId=req.params.id;
   const {userId}=req.body;
   try{
      const post = await PostModel.findById(postId);
      if(postId === userId) {
         await PostModel.updateOne({$set:req.body});
         res.status(200).json("updated successfully");
      } else{
         req.status(403).json("Action forbidden")
      }

   } catch(err){
      req.status(500).json(err);
   }
}

export const deletePost = async(req, res)=>{
   const postId=req.params.id;
   const {userId}=req.body;
   try {
      const post = await PostModel.findById(postId);
      if(postId===userId) {
         await post.deleteOne();
         res.status(200).json("post deleted")
      } else{
         res.status(403).json("Action forbidden")
      }
   } catch (error) {
      res.status(500).json(err);
   }
}

// likes/dislikes post

export const likesPost =async(req,res) => {
   const id=req.params.id;
   const {userId}=req.body;
   try {
      const post = await PostModel.findById(id);
      if(!post.likes.includes(userId)) {
         await post.updateOne({$push:{likes:userId}});
         res.status(200).json("liked done")
      } else{
         await post.updateOne({$pull:{likes:userId}})
         res.status(200).json("dislike done")
      }

   } catch (error) {
      res.status(500).json(err)
      
   }
}

// get timeline post
export const getTimeline=async(req, res)=>{
   const userId=req.params.id;
   try {
      const currentUserPost = await PostModel.find({userId:userId});
      const followingPosts = await userModel.aggregate([
         {
            $match: {
               _id: new mongoose.Types.ObjectId(userId)
            }
         },
         {
            $lookup :{
               from : "posts",
               localField: "following",
               foreignField: "userId",
               as: "followingPosts"
            }
         },{
            $project: {
               followingPosts:1,
               _id:0
            }
         }
      ]
         
      );
      res.status(200).json(currentUserPost.concat(...followingPosts[0].followingPosts)
      .sort((a,b) => b.createdAt - a.createdAt));
      
   } catch (error) {
      console.log(error);
      res.status(500).json(error)
   }

}