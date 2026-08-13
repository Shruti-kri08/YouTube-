const mongoose=require('mongoose')
const commentSchema=new mongoose.Schema(
    {
        commentBy:{
            type:mongoose.Schema.Types.ObjectId,
          require:true,
            ref:'User'
        },
        videoId:{
             type:mongoose.Schema.Types.ObjectId,
             ref:'Video',
             require:true
        },
        like:[
            {
                 type:mongoose.Schema.Types.ObjectId,
                ref:'User',
            }
        ],
        commentText:{
            type:String,
            trim:true,
            require:true

        }

    },
    {
        timestamps:true
    }
)

module.exports=mongoose.model('Comment',commentSchema)
