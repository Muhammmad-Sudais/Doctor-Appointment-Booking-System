import jwt from "jsonwebtoken"

// admin authentication middleware
const authAdmin = async (req, res, next) => {
    try {
        // Get token from headers
        const token = req.headers.atoken || req.headers.aToken || req.headers.authorization?.replace('Bearer ', '');
        
        if (!token) {
            return res.status(401).json({success:false, message:"Not Authorized. Please login again."});
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if the decoded token has admin role or specific admin identifier
        // This assumes your JWT payload contains admin information
        if (!decoded.isAdmin && decoded.email !== process.env.ADMIN_EMAIL) {
            return res.status(403).json({success:false, message:"Admin access required"});
        }

        // Attach admin data to request object
        req.admin = decoded;
        next();

    } catch (error) {
        console.log("Authentication error:", error);
        
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({success:false, message:"Invalid token"});
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({success:false, message:"Token expired. Please login again."});
        } else {
            return res.status(500).json({success:false, message:"Authentication failed"});
        }
    }
}

export default authAdmin;