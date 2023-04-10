import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
   username:String,
   password:String,
    // this is for storing raw binary for image
    // img:[{
    //     _id:false,
    //     data:Buffer
    // }]
})

const UserCollection = mongoose.model('admin', userSchema);

export default UserCollection;