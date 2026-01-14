import jwt from 'jsonwebtoken';

const authDoctor = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if(!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.json({success:false,message:"Not Authorized Login Again"})
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.docId = decoded.id; // Directly set the doctor ID
    
    next();
  } catch (error) {
    console.log('Auth error:', error.message)
    res.json({success:false,message:"Not Authorized Login Again"})
  }
}

export default authDoctor;