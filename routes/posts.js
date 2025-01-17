
const router=require("express").Router();
const Post =require("../models/post")

//create a post 
  router.post("/", async(req,res)=>{
    const newPost= new Post(req.body);
    try{
        const savedPost =newPost.save();
        res.status(200).json("post created");

    }catch(err)
    {
        res.status(500).json("error in creating post ")
    }


  } )

//update a post 
router.put("/:id", async(req,res)=>{
    const pst = await Post.findById(req.params.id);
    try{
        if(pst.userId===req.body.userId)
        {
        await pst.updateOne({$set:req.body});
        res.status(200).json("the post has been updated")
    }
        else{
            res.status(403).json("you can update only your post");
        }

    }catch(err){
         res.status(500).json("error while updating");
    }
    
} );


// delete a post 

router.delete("/:id", async(req,res)=>{
    const pst = await Post.findById(req.params.id);
    try{
        if(pst.userId===req.body.userId)
        {
        await pst.deleteOne();
        res.status(200).json("the post has been deleted")
    }
        else{
            res.status(403).json("you can deleted only your post");
        }

    }catch(err){
         res.status(500).json("error while deleting");
    }
    
} );


//like a post 

router.put("/:id/like", async(req,res)=>{
    const pst = await Post.findById(req.params.id);
    try{
        if(!pst.likes.includes(req.body.userId))
        {
            await pst.updateOne({$push:{likes:req.body.userId}})
            res.status(200).json("the post has been liked")
        }
        else{ await pst.updateOne({$pull:{likes:req.body.userId}})
        res.status(200).json("the post has been disliked")
        }

    }catch(err){
         res.status(500).json("error while liking");
    }
    
} );

// get a post
  router.get("/:id", async(req,res)=>{
        
        try{
          const post=await Post.findById(req.params.id);
            res.status(200).json(post);
        }catch{
            res.status(500).json(err);

        }

  })

// get timeline post 

router.get("/timeline/all", async (req, res) => {
    try {
      const currentUser = await User.findById(req.body.userId);
      const userPosts = await Post.find({ userId: currentUser._id });
      const friendPosts = await Promise.all(
        currentUser.followings.map((friendId) => {
          return Post.find({ userId: friendId });
        })
      );
      res.json(userPosts.concat(...friendPosts))
    } catch (err) {
      res.status(500).json(err);
    }
  });








module.exports=router