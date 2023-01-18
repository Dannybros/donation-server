import mongoose from 'mongoose';

const newSchema = mongoose.Schema({
    title:{
        en:String,
        zh:String,
        ko:String
    },
    date:{
        type: Date, 
        required: true, 
        default: Date.now
    },
    content:{
        en:String,
        zh:String,
        ko:String
    },
    img:[String],
    view:{
        type: Number,   
        default: 0,
    },
    // this is for storing raw binary for image
    // img:[{
    //     _id:false,
    //     data:Buffer
    // }]
})

const NewsCollection = mongoose.model('News', newSchema);

export default NewsCollection;