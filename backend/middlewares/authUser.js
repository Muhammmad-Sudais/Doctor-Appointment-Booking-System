import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({success:false,message:"Not Authorized Login Again"})
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Your JWT token contains { id: user._id }
    req.user = { 
      id: decoded.id // This matches your JWT token structure
    };
    
    next();
  } catch (error) {
    console.log('Auth error:', error.message)
    res.json({success:false,message:"Not Authorized Login Again"})
  }
}

export default authUser;