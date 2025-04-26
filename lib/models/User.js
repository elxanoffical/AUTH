import mongoose from "mongoose";

const userSchema =  new mongoose.Schema({
    name: {type: String, required: true},
    age: {type: Number, required: true},
    username: {type: String, required: true},
    password: {type: String, required: true},
})

export default mongoose.models.User || mongoose.model('User', userSchema)