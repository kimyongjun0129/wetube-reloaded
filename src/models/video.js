import mongoose, { mongo } from "mongoose";
import { type } from "os";

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxLength: 80 },
    fileUrl: { type: String, required: true },
    thumbUrl: { type: String, required: true },
    description: {type: String, required: true, trim: true, minLength: 10},
    createdAt: {type: Date, required: true, default: Date.now},
    hashtags: [{type:String, trim: true}],
    meta: { 
        views: { type: Number, default: 0, required: true},
        rating: { type: Number, default: 0, required: true},
    },
    comments: [{ type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Comment' }],
    owner: { type: mongoose.Schema.Types.ObjectId, requried: true, ref:'User' },
});

videoSchema.static('formatHashtags', function(hashtags) {
    return hashtags.split(",").map((word) => (word.startsWith("#") ? word : `#${word}`));
}) 

const videoModel = mongoose.model("Video", videoSchema);

export default videoModel;