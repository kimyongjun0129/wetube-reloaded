import usermodel from "../models/user.js"
import bcrypt from "bcrypt";

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
    const user = await usermodel.findOne({username});
    const pageTitle = "Login";
    console.log(user)
    if(!user) {
        return res
            .status(400)
            .render("login", {
                pageTitle,
                errorMessage:"An account with this username does not exists",
            })
    }
    const match = await bcrypt.compare(password, user.password)
    if (!match) {
        return res
        .status(400)
        .render("login", {
            pageTitle,
            errorMessage:"Wrong password",
        })
    }
    // login~
    return res.redirect("/");
}
export const edit = (req, res) => res.send("Edit");
export const remove = (req, res) => res.send("Remove");
export const logout = (req, res) => res.send("Logout");
export const see = (req, res) => res.send("See profile");