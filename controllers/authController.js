import Users from "../models/userModel";
import { compareString, createJWT, hashPassword } from "../utils/hashCred.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";

export const register = async (req, res, next) => {
  const { firstName, lastName, email, password,socialsecuritynumber } = req.body;

  
  if (!(firstName || lastName || email || password || socialsecuritynumber)) {
    next("Provide Required Fields!");
    return;
  }

  try {
    const userExist = await Users.findOne({ email });

    if (userExist) {
      next("Email Address already exists");
      return;
    }

    const hashedPassword = await hashString(password);
    const adharhash = await hashString(socialsecuritynumber);

    const user = await Users.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      socialsecuritynumber: adharhash
    });

    sendVerificationEmail(user, res);

  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    //validation
    if (!email || !password) {
      next("Please Provide User Credentials");
      return;
    }

    const user = await Users.findOne({ email }).select("+password").populate({
      path: "friends",
      select: "firstName lastName location profileUrl -password",
    });

    if (!user) {
      next("Invalid email or password");
      return;
    }

    if (!user?.verified) {
      next(
        "User email is not verified. Check your email account and verify your email"
      );
      return;
    }
    const isMatch = await compareString(password, user?.password);

    if (!isMatch) {
      next("Invalid email or password");
      return;
    }

    user.password = undefined;

    const token = createJWT(user?._id);

    res.status(201).json({
      success: true,
      message: "Login successfully",
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: error.message });
  }
};