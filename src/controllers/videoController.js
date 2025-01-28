export const trending = (req, res) => res.send("Home Page Videos");
export const see = (req, res) => {
    console.log(req.params);
    return res.send("Watch Video")
};
export const edit = (req, res) => {
    console.log(req.params);
    return res.send("Edit Video");
};
export const remove = (req, res) => {
    console.log(req.params);
    return res.send("Remove Video");
};
export const search = (req, res) => res.send("Delete Video");
export const upload = (req, res) => res.send("Upload Video");