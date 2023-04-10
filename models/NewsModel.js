import mongoose from 'mongoose';

const newSchema = mongoose.Schema({
    title:{
        en:String,
        zh:String,
        ko:String
    },
    date:{
        type: Date
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
    }
})

const NewsCollection = mongoose.model('News', newSchema);

export default NewsCollection;