import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
    email: {type:String, required: true, unique: true},
    avatarUrl: {type:String, default: "https://wetube-fly-2025-update-yg.s3.ap-northeast-2.amazonaws.com/avatars/basic-profile/123456789"},
    socialOnly: {type:Boolean, default: false},
    username: {type:String, required: true, unique: true},
    password: {type: String},
    name: {type: String, required: true},
    location: String,
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref:'Comment' }],
    videos:[{ type: mongoose.Schema.Types.ObjectId, ref:'Video' }],
})

userSchema.pre('save', async function() {
    if(this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 5);
    }
});

const userModel = mongoose.model("User", userSchema);


export default userModel;