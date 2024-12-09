const router=require("express").Router();
const User = require("../models/user")
const bcrypt = require("bcrypt");

//update a user 

router.put("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      if (req.body.password) {
        try {
          const salt = await bcrypt.genSalt(10);
          req.body.password = await bcrypt.hash(req.body.password, salt);
        } catch (err) {
          return res.status(500).json("hashing error");
        }
      }
      try {
        const user = await User.findByIdAndUpdate(req.params.id, {
          $set: req.body,
        });
        res.status(200).json("Account has been updated");
      } catch (err) {
        return res.status(500).json("updation error");
      }
    } else {
      return res.status(403).json("You can update only your account!");
    }
  });


//delete a user

router.delete("/:id", async (req, res) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("Account has been deleted");
      } catch (err) {
        return res.status(500).json("deletion error");
      }
    } else {
      return res.status(403).json("You can delete only your account!");
    }
  });

 router.get("/:id" ,async(req,res)=>{
    try{
        
        const user=await User.findById(req.params.id);
        res.json(user);
    }catch(err)
    {
   res.status(500).json("error in retriving data")

    }

 })




//get a user 
router.get("/:id", async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      const { password, updatedAt,...other } = user._doc;
      console.log("saksahm");
      res.json(other);
    } catch (err) {
      res.status(500).json(err);
    }
  });



//follow a user 
router.put("/:id/follow", async (req,res)=>{
    if(req.body.userId !=req.params.id)
    {
      try{
        const user= await User.findById(req.params.id);
      const currentuser = await User.findById(req.body.userId);

      if(!user.followers.includes(req.body.userId) )
      {
        await user.updateOne({$push :{ followers : req.body.userId}});
        await currentuser.updateOne({$push :{ followings : req.body.userId}});
        res.status(200).json("user has been followed")
      }
      else{
        res.staus(200).json("you already follow the user")
      }
        }catch(err)
      {
          res.status(500).json("error occured while following")
      }
    }
})

 


// unfollow a user 

router.put("/:id/unfollow", async (req,res)=>{
    if(req.body.userId !=req.params.id)
    {
      try{
        const user= await User.findById(req.params.id);
      const currentuser = await User.findById(req.body.userId);

      if(user.followers.includes(req.body.userId) )
      {
        await user.updateOne({$pull :{ followers : req.body.userId}});
        await currentuser.updateOne({$pull :{ followings : req.body.userId}});
        res.status(200).json("user has been unfollowed")
      }
      else{
        res.staus(200).json("you are following the user already")
      }
        }catch(err)
      {
          res.status(500).json("error occured while following")
      }
    }
})








module.exports=router;