const express = require("express");
const { JsonWebTokenError } = require("jsonwebtoken");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 7070;
const User = require("./user");

app.use(express.json());

app.listen(PORT, () => {
  console.log(`Auth Service on Port ${PORT}`);
});

mongoose.connect(
  "mongodb://localhost/e-auth-services",
  {
    useNewUrlParams: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("E-auth-services DB Connect");
  }
);

// Register

app.post("/api/auth/register", async (req, res) => {
  const { email, password, name } = req.body;
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.json({ message: "User Already registered" });
  } else {
    const newUser = new User({
      name,
      email,
      password,
    });
    newUser.save();
    return res.json(newUser);
  }
});

// Login
app.get("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ message: "user doesn't not exit" });
  } else {
    // Check Password

    if (password !== user.password) {
      return res.json({
        message: "password is incorrect",
      });
    }

    const payLoad = {
      email,
      name: user.name,
    };
    jwt.sign(payLoad, "secret", (err, token) => {
      if (err) {
        console.error(err, "Error signing");
      } else {
        return res.json({ token: token });
      }
    });
  }
});
