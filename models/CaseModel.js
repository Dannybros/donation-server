import mongoose from 'mongoose'

const caseSchema = new mongoose.Schema({
    title:{
        en:String,
        zh:String,
        ko:String
    },
    content:{
        en:String,
        zh:String,
        ko:String
    },
    img:[String],
},{timestamps:true})

const CaseCollection = mongoose.model('cases', caseSchema);

export default CaseCollection;