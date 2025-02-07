import videoModel from "../models/video.js";

export const home = async(req, res) => 
{
    try
    {
        const videos = await videoModel.find({});
        return res.render("home", {pageTitle: "Home", videos});
    }
    catch (error)
    {
        return res.render("server-error", {error});
    }
};

export const watch = async (req, res) => 
{
    const { id } = req.params;  // const id = req.params.id;
    const video = await videoModel.findById(id);
    if(!video) {
        return res.render("404", {pageTitle:"Video not found."});
    }
    return res.render("watch", {pageTitle: video.title, video});
};

export const getEdit = async (req, res) => 
{
    const { id } = req.params;
    const video = await videoModel.findById(id);
    if(!video) {
        return res.render("404", {pageTitle: "Video not found."});
    }
    return res.render("edit", {pageTitle: `Edit: ${video.title}`, video});
};

export const postEdit = async (req, res) => 
{
    const { id } = req.params;
    const {title, description, hashtags } = req.body;
    const video = await videoModel.exists({_id:id});
    if (!video) {
        return res.render("404", {pageTitle: "Video not found."});
    }
    await videoModel.findByIdAndUpdate(id, {
        title,
        description,
        hashtags: videoModel.formatHashtags(hashtags),
    });
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => 
{
    return res.render("upload", {pageTitle: "Upload Video"});
}

export const postUpload = async (req, res) =>
{
    const { title, description, hashtags } = req.body;
    try
    {
        await videoModel.create ({
            title, // title:title,
            description, // description:description,
            hashtags: videoModel.formatHashtags(hashtags),
        });
        return res.redirect("/");
    }
    catch (error)
    {
        return res.render("upload", {
            pageTitle: "Upload Video",
            errorMessage: error._message,
        });
    }
}

export const deleteVideo = async(req, res) => {
    const { id } = req.params;
    await videoModel.findByIdAndDelete(id);
    return res.redirect("/");
}