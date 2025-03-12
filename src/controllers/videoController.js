import userModel from "../models/user.js";
import videoModel from "../models/video.js";
import commentModel from "../models/Comments.js";

export const home = async(req, res) => 
{
    try
    {
        const videos = await videoModel.find({})
            .sort({ createdAt: "desc"})
            .populate("owner");
        return res.render("home", {pageTitle: "Home", videos});
    }
    catch (error)
    {
        return res.render("server-error", {error});
    }
};

export const watch = async (req, res) => 
{
    const { id } = req.params;
    const video = await videoModel.findById(id).populate("owner").populate("comments");
    if(!video) {
        return res.render("404", {pageTitle:"Video not found."});
    }
    return res.render("watch", {pageTitle: video.title, video });
};

export const getEdit = async (req, res) => 
{
    const { id } = req.params;
    const { user: {_id} } = req.session;
    const video = await videoModel.findById(id);
    if(!video) {
        return res.status(404).render("404", {pageTitle: "Video not found."});
    }
    if(String(video.owner) != String(_id)) {
        req.flash("error", "You are not the owner of the video");
        return res.status(403).redirect("/");
    }
    return res.render("edit", {pageTitle: `Edit: ${video.title}`, video});
};

export const postEdit = async (req, res) => 
{
    const { id } = req.params;
    const { user: {_id} } = req.session;
    const {title, description, hashtags } = req.body;
    const video = await videoModel.exists({_id:id});
    if (!video) {
        return res.status(404).render("404", {pageTitle: "Video not found."});
    }
    if(String(video.owner) != String(_id)) {
        req.flash("error", "You are not the owner of the video");
        return res.status(403).redirect("/");
    }
    await videoModel.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: videoModel.formatHashtags(hashtags),
    });
    req.flash("success", "Changes saved");
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => 
{
    return res.render("upload", {pageTitle: "Upload Video"});
}

export const postUpload = async (req, res) =>
{
    const { 
        user: { _id } 
    } = req.session;
    const { video, thumb } = req.files;
    const { title, description, hashtags } = req.body;
    try
    {
        const newVideo = await videoModel.create ({
            title,
            description,
            fileUrl: video[0].location,
            thumbUrl: thumb[0].location.replace(/[\\]/g, "/"),
            owner:_id,
            hashtags: videoModel.formatHashtags(hashtags),
        });
        const user = await userModel.findById(_id);
        user.videos.push(newVideo._id);
        user.save();
        return res.redirect("/");
    }
    catch (error)
    {
        return res.status(400).render("upload", {
            pageTitle: "Upload Video",
            errorMessage: error._message,
        });
    }
}

export const deleteVideo = async(req, res) => {
    const { id } = req.params;
    const { user:{_id} } = req.session;
    const video = await videoModel.findById(id);
    const user = await userModel.findById(_id);
    if (!video) {
        return res.status(404).render("404", {pageTitle: "Video not found."});
    }
    if(String(video.owner._id) != String(_id)) {
        return res.status(403).redirect("/");
    }
    await userModel.updateOne(
        { videos: id }, 
        { $pull: { videos: id } }
      );

    await commentModel.deleteMany({ _id: { $in: video.comments} });
    await userModel.updateMany(
        { comments: { $in: video.comments } },
        { $pull: { comments: { $in: video.comments } }}
    );

    await videoModel.findByIdAndDelete(id);
    return res.redirect("/");
}

export const search = async (req, res) => {
    const { keyword } = req.query;
    let videos = [];
    if(keyword) {
        videos = await videoModel.find({
            title: {
                $regex: new RegExp(keyword, "i")
            },
        }).populate("owner");
    }
    return res.render("search", {pageTitle: "Search Video", videos});
}

export const registerView = async(req, res) => {
    const { id } = req.params;
    const video = await videoModel.findById(id);
    if(!video) {
        return res.sendStatus(404);
    }
    video.meta.views += 1;
    await video.save();
    return res.sendStatus(200);
}

export const createComment = async (req, res) => {
    const {
        params : { id },
        body : { text },
        session : { user },
    } = req;

    const video = await videoModel.findById(id);
    if(!video) {
        return res.sendstatus(404);
    }
    const comment = await commentModel.create({
        text,
        owner: user._id,
        video: id,
    });
    const commentOwner = await userModel.findById(user._id);
    video.comments.push(comment._id);
    commentOwner.comments.push(comment._id);
    await video.save();
    await commentOwner.save();
    return res.status(201).json({newCommentId: comment._id});
}

export const deleteComment = async (req, res) => {
    const { id } = req.body;
    const { user:{_id} } = req.session;
    const comment = await commentModel.findById(id).populate("owner").populate("video");
    const video = await videoModel.findById(comment.video._id);
    const user = await userModel.findById(_id);
    if(!comment) {
        return res.sendStatus(404);
    }
    if(String(comment.owner._id) != String(_id)) {
        return res.status(403).redirect("/");
    }
    try {
        await commentModel.findByIdAndDelete(id);
        video.comments = video.comments.filter(comment_id => comment_id != id);
        user.comments = user.comments.filter(comment_id => comment_id != id);
        await video.save();
        await user.save();
        return res.sendStatus(201);
    }
    catch (error) {
        return res.sendStatus(404);
    }
}
export const editComment = async(req, res) => {
    const { id, textareaValue } = req.body;
    const { user: {_id}} = req.session;
    const comment = await commentModel.findById(id);    
    if (!comment) {
        return res.sendStatus(404);
    }
    if(String(_id) != String(comment.owner)) {
        return res.sendStatus(404);
    }
    comment.text = textareaValue;
    comment.save();
    return res.sendStatus(201);
}