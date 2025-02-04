import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    title: {type: String, required: true, trim: true, maxLength: 80},
    description: {type: String, required: true, trim: true, maxLength: 20},
    createdAt: {type: Date, required: true, default: Date.now},
    hashtags: [{type:String, trim: true}],
    meta: { 
        views: { type: Number, default: 0, required: true},
        rating: { type: Number, default: 0, required: true},
    },
});

const videoModel = mongoose.model("Video", videoSchema);

export default videoModel;