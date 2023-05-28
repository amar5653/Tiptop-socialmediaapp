const express = require("express");
const router = express.Router();
const User = require("../models/user");

// All Users Route
router.get("/", async (req, res) => {
  let searchOptions = {}
  if (req.query.name != null && (req.query.name !== "")) {
    searchOptions.name = new RegExp(req.query.name, "i");
  }
  try {
    const users = await User.find(searchOptions);
    res.render("users/index", { users: users, searchOptions: req.query });
  } catch {
    res.redirect('/')
  }
});

//New User Route
router.get("/register", (req, res) => {
  res.render("users/register", { user: new User() });
});

//Create new user account
router.post("/", async (req, res) => {
  const user = new User({
    name: req.body.name,
  });

  try {
    const newUser = await user.save();

    //  res.redirect(`users/${newUser.id}`)
    res.redirect("users");
  } catch {
    res.render("users/register", {
      user: user,
      errorMessage: "Error creating User",
    });
  }
});

module.exports = router;
