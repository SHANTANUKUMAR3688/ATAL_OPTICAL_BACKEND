const mongoose = require("mongoose");

const SubcategorySchema = new mongoose.Schema(
    {  
        image: { 
            type: String 
        },
        name: {
            type: String,
            required: true
        },
        previous_price:{
            type:Number
            },
            current_price:{
                type:Number
        },
        category:{
            type:String
        }
    },
    { timestamps: true }
);

module.exports = mongoose.model("SubCategory", SubcategorySchema);
