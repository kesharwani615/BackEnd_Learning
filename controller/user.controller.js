import User from "../models/user.model.js";



export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if (!email || !password || !name) {
      return res.status(404).json({ msg: "All fields are required" });
    }
    const existingUser = await User.findOne({ email: email });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const encryptPassword = await bcrypt.hash(password, 12);

    const user = User.create({ email: email, password: encryptPassword });
    if (user) {
      return res.status(201).json({ msg: "User created successfully" });
    }
  } catch (e) {
    return res.status(500).json({ msg: "Something went wrong" });
  }
};


export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try{
        if(!email || !password) {
            return res.status(401).json({ msg: "Invalid email" });
        }

        const user = await User.findOne({email})
        if(!user){
            return res.status(401).json({ msg: "User Not Found. Please Register" });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(401).json({ msg: "Invalid Password" });
        }
        

    } catch (e) {
        return res.status(500).json({ msg: "Something went wrong" });
    }
}
