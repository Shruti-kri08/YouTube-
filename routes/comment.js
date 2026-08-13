const express=require('express')
const { addComment,getComment,updateComment ,deleteComment, commentLike} = require('../controllers/commentController')
const router=express.Router()


router.post('/addComment/:videoId', addComment)

router.get('/getComment/:videoId', getComment)

router.put('/update/:commentId', updateComment)

router.delete('/delete/:commentId', deleteComment)

router.put('/like/:commentId',commentLike)

module.exports=router