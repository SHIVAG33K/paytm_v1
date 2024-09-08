const JWT_SECRET = require('./config');
const jwt = require("jsonwebtoken");

const authMiddleware = (req,res ,next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer')){
        return res.status(400).json({ message : " wrong auth "});
    }

    const token = authHeader.split(' ')[1];


    try {
        const decode = jwt.verify(token,JWT_SECRET);
        if (decode.userId) {
            req.userId = decode.userId;
            next();
        }
    } catch (err) {
        return res.status(400).json({message: err});
    }
};

module.exports = {
    authMiddleware
}

// const jwt = require("jsonwebtoken");

// function authMiddleware(req, res, next) {
//   const authHeader = req.headers.authorization;
//   if (!authHeader || !authHeader.startsWith("Bearer ")) {
//     return res.status(403).json({
//       message:
//         "Authorization header is missing or not in 'Bearer <token>' format",
//     });
//   }
//   const token = authHeader.split(" ")[1];
//   try {
//     const decoded = jwt.verify(token, JWT_SECRET);
//     req.userId = decoded.userId;
//     next();
//   } catch (error) {
//     return res.status(403).json({});
//   }
// }

// module.exports = {
//     authMiddleware
//     }