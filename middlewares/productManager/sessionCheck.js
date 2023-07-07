const sessionCheck = (req, res, next) => {
    // if (req.session.productManager) {
        next()
//     } else {
//         res.redirect('/productManager/')
//     }
 }

module.exports = sessionCheck;