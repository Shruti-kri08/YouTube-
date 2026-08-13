const Comment = require('../models/Comment')
const jwt = require('jsonwebtoken')
const Video = require('../models/Video')
const User = require('../models/User')


const addComment = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = jwt.verify(token, process.env.JWT_SECRET)
        const video = await Video.findById(req.params.videoId)
        if (!video) {
            return res.status(500).json({
                error: "video not found",
            })
        }
        const comment = new Comment({
            commentBy: tokenData._id,
            videoId: video._id,
            commentText: req.body.commentText
        })
        const uploadedComment = await comment.save()
        res.status(200).json({
            message: "Comment uploaded successfully",
            uploadedComment
        })
        video.comment.push(uploadedComment._id)
        await video.save()
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        })

    }
}

const getComment = async (req, res) => {
    try {
        const video = await Video.findById(req.params.videoId).select('comment')
        const comment = await Comment.find({ videoId: req.params.videoId }).populate('commentBy', 'channelName profileImageUrl').select('commentBy commentText')
        if (!video) {
            return res.status(500).json({
                error: "video not found",
            })
        }
        if (!Comment) {
            return res.status(500).json({
                error: "comment not found",
            })
        }
        res.status(200).json(comment)


    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        })

    }
}


//update comment by comment owner
const updateComment=async(req,res)=>{
    try{
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = jwt.verify(token, process.env.JWT_SECRET)
        const comment=await Comment.findById(req.params.commentId)
        if(comment.commentBy.toString()!==tokenData._id){
            return res.status(500).json({
                message:"you are not allowed"
            })
        }
        comment.commentText=req.body.commentText
       await  comment.save()
       res.status(200).json({
        comment
       })

    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        })

    }
}

//delete comment by commnet owner or by video owner
const deleteComment=async(req,res)=>{
    try{
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = jwt.verify(token, process.env.JWT_SECRET)
        const comment=await Comment.findById(req.params.commentId)
        const video= await Video.findById(comment.videoId)
        if(comment.commentBy.toString()!==tokenData._id || video.uploadedBy.toString()!==tokenData._id){
            return res.status(500).json({
                message:"you are not allowed"
            })
        }
        await Comment.deleteOne({ _id: comment._id })
       res.status(200).json({
        message:"delete successfully"
       })

    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        })

    }
}

const commentLike=async(req,res)=>{
    try{
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = jwt.verify(token, process.env.JWT_SECRET)
        const comment=await Comment.findById(req.params.commentId)
        if(comment.like.includes(tokenData._id)){
            comment.like=comment.like.filter((id)=>(tokenData._id!==id.toString()))
        }
        else{
            comment.like.push(tokenData._id)
        }

       await  comment.save()
     res.status(200).json({
       comment
     })

    }
    catch(err) {
        console.log(err);
        res.status(500).json({
            error: err
        })

    }
}


module.exports = {
    addComment,
    getComment,
    updateComment,
    deleteComment,
    commentLike
}