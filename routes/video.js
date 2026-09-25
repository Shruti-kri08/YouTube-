const express=require('express')
const { upload,like,dislike,getVideo,updateVideo,deleteVideo,getVideoByChannelId, videoById} = require('../controllers/videoController')
const router=express.Router()


router.post('/upload',upload)

router.post('/like/:videoId',like)

router.post('/dislike/:videoId',dislike)

router.get('/',getVideo)

router.get('/videoById/:id',videoById)


router.put('/update/:videoId',updateVideo)

router.delete('/delete/:videoId',deleteVideo)

router.get('/videoByChannelId/:channelId',getVideoByChannelId)

module.exports=router