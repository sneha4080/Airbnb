const { date } = require("joi");
const mongoose = require ("mongoose");
const reviewSchema =new mongoose.Schema({

    comment:{
        type:String,
        required: [true, ]
    },

    rating:{
        type:Number,
        min: [1, ],
        max: [5, ],
        required:true
        
    },

    createdAt:{
        type :String,
        default: Date.now()

    },

    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }

});

module.exports = mongoose.model("Review", reviewSchema);

const Review = mongoose.model("Review",reviewSchema);
module.exports=Review;

