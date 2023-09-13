import mongoose from 'mongoose';

const userSchema = mongoose.Schema({
    username:{
        required: true,
        type: String,
    },
    firstname:{
        required: true,
        type: String,
    },
    lastname:{
        required: true,
        type: String,
    },
    password:{
        required: true,
        type: String,
    },
    isAdmin:{
        type: Boolean,
        default: false,
    },
    profilePicture:String,
    coverPicture:String,
    about:String,
    livesin:String,
    worksAt:String,
    country:String,
    relationship:String,
    followers:[],
    following:[],
}, {timestamps:true});

const userModel = mongoose.model('users', userSchema);
export default userModel;