const mongoose=require('mongoose')
const videoSchema=new mongoose.Schema({
    title: {
      type: String,
      required:true,
      trim: true,
    },

    description: {
      type: String,
     default:""
      
    },
    tags:[
        {
            type:String
        }
    ],

    videoUrl: {
      type: String,
      required:true
    },

   videoPublicId: {
      type: String,
     required:true

    },
     thumbnailUrl: {
      type: String,
      required:true
    },

    thumbnailPublicId: {
      type: String,
      required:true
    },
    views:{
        type:Number,
       default:0
    },
    uploadedBy:
        {
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            ref:'User'
        }
    ,
    likeUser:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'

        }
    ],
    dislikeUser:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'User'

        }
    ],
   comment:[
    {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Comment'

        }
       
   ]
},
{
    timestamps: true,
  }

)

module.exports=mongoose.model('Video',videoSchema)