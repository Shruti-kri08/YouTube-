const cloudinaryConfig = require("../config/cloudinary")
const cloudinary = require("cloudinary").v2;
const Video = require('../models/Video')
const jwt = require('jsonwebtoken')


//upload video
const upload = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = jwt.verify(token, process.env.JWT_SECRET)

        if (!req.files || !req.files.video) {
            return res.status(500).json({
                message: "Video required"
            })
        }
        const uploadVideo = await cloudinary.uploader.upload(req.files.video.tempFilePath, {
            resource_type: "video",
            folder: "YouTube/video"
        });
        if (!req.files || !req.files.thumbnail) {
            return res.status(500).json({
                message: "thumbnail required"
            })
        }

        const uploadThumbnail = await cloudinary.uploader.upload(req.files.thumbnail.tempFilePath, {
            folder: "YouTube/thumbnail"
        });
        const newVideo = new Video({
            title: req.body.title,
            description: req.body.description,
            videoUrl: uploadVideo.secure_url,
            videoPublicId: uploadVideo.public_id,
            thumbnailUrl: uploadThumbnail.secure_url,
            thumbnailPublicId: uploadThumbnail.public_id,
            uploadedBy: tokenData._id,
            tags:req.body.tags

        })

        const result = await newVideo.save()
        res.status(200).json({
            message: "video upload successfully",
            video: result
        })

    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            message: "vedio upload failed"
        })

    }

}

//Like api
const like = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = jwt.verify(token, process.env.JWT_SECRET)
        const videoId = req.params.videoId
        const video = await Video.findById(videoId)
        if (!video) {
            return res.status(500).json({
                message: "Video not found"
            })
        }
        //if user already liked the video then just remove the like
        if (video.likeUser.includes(tokenData._id)) {
            video.likeUser = video.likeUser.filter(id => (id.toString() !== tokenData._id))
            const videoRes = await video.save()
            res.status(200).json({ video: videoRes })
        }
        else {
            //if user disliked the video then first remove the dislike and then like 
            if (video.dislikeUser.includes(tokenData._id)) {
                video.dislikeUser = video.dislikeUser.filter(id => (id.toString() !== tokenData._id))
            }
            video.likeUser.push(tokenData._id)
            const videoRes = await video.save()
            res.status(200).json({ video: videoRes })
        }

    }
    catch (err) {

        console.log(err);
        res.status(500).json({
            error: err
        })

    }
}

//Dislike api
const dislike = async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]
        const tokenData = jwt.verify(token, process.env.JWT_SECRET)
        const videoId = req.params.videoId
        const video = await Video.findById(videoId)
        if (!video) {
            return res.status(500).json({
                message: "Video not found"
            })
        }
        //if user already disliked the video then just remove dislike
        if (video.dislikeUser.includes(tokenData._id)) {
            video.dislikeUser = video.dislikeUser.filter(id => (id.toString() !== tokenData._id))
            const videoRes = await video.save()
            res.status(200).json({ video: videoRes })
        }
        else {
            //if user liked the video than first remove the like and then dislike the video
            if (video.likeUser.includes(tokenData._id)) {
                video.likeUser = video.likeUser.filter(id => (id.toString() !== tokenData._id))
            }
            video.dislikeUser.push(tokenData._id)
            const videoRes = await video.save()
            res.status(200).json({ video: videoRes })
        }


    }
    catch (err) {

        console.log(err);
        res.status(500).json({
            error: err
        })

    }
}

//Get video 
const getVideo = async (req, res) => {
    try {
        const video = await Video.find()
       
      
        res.status(200).json({
            video
        })
    }
    catch (err) {

        console.log(err);
        res.status(500).json({
            error: err
        })

    }
}

//update video info by video owner
const updateVideo=async(req,res)=>{
    try{

        const token=req.headers.authorization.split(" ")[1]
        const tokenData=jwt.verify(token,process.env.JWT_SECRET)

        const video=await Video.findById(req.params.videoId)
        
        //check video owner
        if(video.uploadedBy.toString()!==tokenData._id){
            return res.status(500).json({
                message:"you are not allowed"
            })
        }

        //if tokenData._id is id of video owner 
            video.title=req.body.title,
            video.description=req.body.description
            video.tags=req.body.tags

        const updatedVideo=await video.save()

        res.status(200).json({
            updatedVideo
        })

    }
    catch(err){
        console.log(err);
        res.status(500).json({
            error: err
        })

    }
}

//delete video by video owner
const deleteVideo=async(req,res)=>{
    try{

        const token=req.headers.authorization.split(" ")[1]
        const tokenData=jwt.verify(token,process.env.JWT_SECRET)

        const video=await Video.findById(req.params.videoId)
        //check video exist or not
        if (!video) {
    return res.status(404).json({
        message: "Video not found"
    });
}
        //check video owner
        if(video.uploadedBy.toString()!==tokenData._id){
            return res.status(500).json({
                message:"you are not allowed"
            })
        }
         await cloudinary.uploader.destroy(video.videoPublicId,{
              resource_type: "video"
        })

        await cloudinary.uploader.destroy(video.thumbnailPublicId)

       
      await Video.deleteOne({ _id: video._id })

      res.status(200).json({ message:"Video deleted successfully" })

    }
    catch(err){
        console.log(err);
        res.status(500).json({
            error: err
        })
    }
}

const getVideoByChannelId=async(req,res)=>{
    try{

        const video=await Video.find({uploadedBy:req.params.channelId}).select('thumbnailUrl title')
        res.status(200).json({video})
    }
     catch(err){
        console.log(err);
        res.status(500).json({
            error: err
        })
    }
}

module.exports = {
    upload,
    like,
    dislike,
    getVideo,
    getVideoByChannelId,
    updateVideo,
    deleteVideo,
    getVideoByChannelId
}