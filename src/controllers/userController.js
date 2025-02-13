import usermodel from "../models/user.js"

export const getJoin = (req, res) => res.render("join", {pageTitle: "Join"});
export const postJoin = async (req, res) => {
    const { name, username, email, password_1, password_2, location } = req.body;
    const pageTitle = "Join";
    if (password_1 !== password_2) {
        return res.status(400).render("join", {
          pageTitle,
          errorMessage: "Password confirmation does not match.",
        });
      }
      const exists = await User.exists({ $or: [{ username }, { email }] });
      if (exists) {
        return res.status(400).render("join", {
          pageTitle,
          errorMessage: "This username/email is already taken.",
        });
      }
    try {
        await usermodel.create({
            name,
            username,
            email,
            password_1,
            password_2,
            location,
        })
        return res.redirect("/login");
    } 
    catch (error)
    {
        return res.status(400).render("join", {
            pageTitle,
            errorMessage: error._message,
        });
    }
};
export const getLogin = (req, res) => {
    return res.render("login", {pageTitle: "Login"});
}
export const postLogin = async (req, res) => {
    const { username, password } = req.body;
    const exists = await usermodel.exists({$or: [{username},{password}]});
    if(!exists) {
        return res
            .status(400)
            .render("login", {
                pageTitle:"Login",
                errorMessage:"An account with this username or password does not exists",
            })
        }
    res.end();
}
export const edit = (req, res) => res.send("Edit");
export const remove = (req, res) => res.send("Remove");
export const logout = (req, res) => res.send("Logout");
export const see = (req, res) => res.send("See profile");