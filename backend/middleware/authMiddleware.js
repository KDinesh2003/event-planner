const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  // If there's no Bearer token, return unauthorized error
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Debugging: Log the decoded JWT payload to ensure it contains the expected data
    console.log('Decoded JWT:', decoded);

    // Attach the decoded data to req.user
    req.user = decoded;

    next();
  } catch (err) {
    console.error('JWT verification error:', err);
    res.status(401).json({ message: 'Invalid Token' });
  }
};

module.exports = authMiddleware;
