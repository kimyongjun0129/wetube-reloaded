import userModel from "../models/user.js";
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
      const exists = await userModel.exists({ $or: [{ username }, { email }] });
      if (exists) {
        return res.status(400).render("join", {
          pageTitle,
          errorMessage: "This username or email is already taken.",
        });
      }
    try {
        await userModel.create({
            name,
            username,
            email,
            password:password_1,
            location,
        });
        req.flash("info", "Create Account");
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
    const user = await userModel.findOne({username, socialOnly:false});
    const pageTitle = "Login";
    if(!user) {
        return res
            .status(400)
            .render("login", {
                pageTitle,
                errorMessage:"An account with this username does not exists",
            })
    }
    const match_password = await bcrypt.compare(password, user.password)
    if (!match_password) {
        return res
        .status(400)
        .render("login", {
            pageTitle,
            errorMessage:"Wrong password",
        })
    }
    req.session.loggedIn = true;
    req.session.user = user;
    req.flash("info", "Log In");
    return res.redirect("/");
};

export const startGithubLogin = (req, res) => {
    const baseUrl = "https://github.com/login/oauth/authorize";
    const config = {
        client_id: process.env.GH_CLIENT,
        allow_signup: false,
        scope: "read:user user:email",
    };
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    return res.redirect(finalUrl);
}

export const finishGithubLogin = async (req, res) => {
    const baseUrl = "https://github.com/login/oauth/access_token";
    const config = {
        client_id: process.env.GH_CLIENT,
        client_secret: process.env.GH_SECRET,
        code: req.query.code,
    }
    const params = new URLSearchParams(config).toString();
    const finalUrl = `${baseUrl}?${params}`;
    const tokenRequest = await (
        await fetch(finalUrl, {
        method:"POST",
        headers: {
            Accept: "application/json",
        }
    })).json();
    if("access_token" in tokenRequest) {
        const { access_token } = tokenRequest;
        const apiUrl = "https://api.github.com";
        const userData = await(
            await fetch(`${apiUrl}/user`,{
            headers: {
                Authorization: `token ${access_token}`,
            }
        })).json();
        const emailData = await (
            await fetch(`${apiUrl}/user/emails`, {
              headers: {
                Authorization: `token ${access_token}`,
              },
            })
          ).json();
        const emailObj = emailData.find(
            (email) => email.primary === true && email.verified === true
          );
        if (!emailObj) {
            return res.redirect("/login");
        }
        let user = await userModel.findOne({email: emailObj.email});
        if(!user) {
            user = await userModel.create({
                name:userData.name || "Unknown",
                avatarUrl:userData.avatarUrl,
                username:userData.login,
                email:emailObj.email,
                password:"",
                socialOnly:true,
                location:userData.location,
            });
        }
        req.session.loggedIn = true;
        req.session.user = user;
        req.flash("info", "Log In");
        return res.redirect("/");
    }
    else {
        return res.redirect("/login");
    }
}

export const logout = async (req, res) => {
  req.session.destroy(err => {
      res.redirect("/");
  });
};

export const getEdit = (req, res) => {
    return res.render("edit-profile", { pageTitle: "Edit Profile" });
};
export const postEdit = async (req, res) => {
    const {
      session: {
        user: { _id, avatarUrl },
      },
      body: { name, email, username, location },
      file,
    } = req;
    console.log(file);
    const updatedUser = await userModel.findByIdAndUpdate(
      _id,
      {
        avatarUrl: file ? file.path : avatarUrl,
        name,
        email,
        username,
        location,
      },
      { new: true }
    );
    req.session.user = updatedUser;
    req.flash("success", "Change saves");
    return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
    if (req.session.user.socialOnly === true) {
      req.flash("error", "Can't changed password");
      return res.redirect("/");
    }
    return res.render("users/change-password", { pageTitle: "Change Password" });
  };
  export const postChangePassword = async (req, res) => {
    const {
      session: {
        user: { _id },
      },
      body: { oldPassword, newPassword, newPasswordConfirmation },
    } = req;
    const user = await userModel.findById(_id);
    const ok = await bcrypt.compare(oldPassword, user.password);
    if (!ok) {
      return res.status(400).render("users/change-password", {
        pageTitle: "Change Password",
        errorMessage: "The current password is incorrect",
      });
    }
    if (newPassword !== newPasswordConfirmation) {
      return res.status(400).render("users/change-password", {
        pageTitle: "Change Password",
        errorMessage: "The password does not match the confirmation",
      });
    }
    user.password = newPassword;
    await user.save();
    req.flash("info", "Password updated");
    return res.redirect("/users/logout");
  };

export const see = async(req, res) => {
    console.log("controller")
    const { id } = req.params;
    const user = await userModel.findById(id).populate({
      path: "videos",
      populate: {
        path: "owner",
        model: "User",
      },
    });
    if(!user) {
        return res.status(404).render("404", {pageTitle: "User not found."});
    }
    return res.render("users/profile", {
        pageTitle: `${user.name}의 Profile`,
        user,
        }
    )
}
