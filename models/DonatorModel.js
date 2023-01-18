import mongoose from "mongoose";

const donatorSchema = mongoose.Schema({
    name:String,
    amount:Number,
    email:String,
    donateTo:String,
    cardName:String,
    date:{ type: Date, default: Date.now} 
})


const donatorCollection = mongoose.model('donators', donatorSchema);

export default donatorCollection;