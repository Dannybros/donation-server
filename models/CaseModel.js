import mongoose from 'mongoose'

const caseSchema = new mongoose.Schema({
    title:{
        en:String,
        zh:String,
        ko:String
    },
    goal:Number,
    reach:Number,
    content:{
        en:String,
        zh:String,
        ko:String
    },
    img:[String],
},{timestamps:true})

const CaseCollection = mongoose.model('cases', caseSchema);

export default CaseCollection;