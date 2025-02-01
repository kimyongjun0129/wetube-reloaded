let videos = [
    {
        title: "First Video",
        rating: 5,
        comments: 2,
        createdAt: "1 minutes age",
        views: 59,
        id: 0,
    },
    {
        title: "Second Video",
        rating: 5,
        comments: 2,
        createdAt: "2 minutes age",
        views: 76,
        id: 1,
    },
    {
        title: "Third Video",
        rating: 5,
        comments: 2,
        createdAt: "3 minutes age",
        views: 49,
        id: 2,
    },
];

export const trending = (req, res) => 
{
    return res.render("home", {pageTitle: "Home", videos: videos});
}
export const watch = (req, res) => 
{
    const { id } = req.params;  // const id = req.params.id;
    const video = videos[id];
    return res.render("watch", {pageTitle: `Watching ${video.title}`, video: video});
};
export const getEdit = (req, res) => 
{
    const { id } = req.params;
    const video = videos[id];
    return res.render("edit", {pageTitle: `Editing: ${video.title}`, video: video});
};
export const postEdit = (req, res) => 
{
    const { id } = req.params;
    const { title } = req.body;
    videos[id].title = title;
    return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => 
{
    return res.render("upload", {pageTitle: "Upload Video"});
}
export const postUpload = (req, res) =>
{
    const { title } = req.body;
    const newVideo = {
        title,  // title : title
        rating: 0,
        comments: 0,
        createdAt: `${videos.length} minutes age`,
        views: 0,
        id: videos.length,
    };
    videos.push(newVideo);
    return res.redirect("/");
}