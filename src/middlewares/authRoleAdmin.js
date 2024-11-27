// authMiddleware.js
import jwt from 'jsonwebtoken';

export const authRoleAdmin = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== 'Admin') {
      return res
        .status(403)
        .json({ message: 'Acces denied. You are not authorized.' });
    }
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalide token.' });
  }
};
