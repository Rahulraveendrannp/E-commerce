const sharp = require("sharp");

exports.userProfilePic = (req, res, next) => {
  try{
  if (!req.file) {
    return next();
  }
  console.log(req.file)
  req.file.filename = `${req.body.name}_${Date.now()}.jpeg`;

  sharp(req.file.buffer)
    .resize(320, 320)
    .toFormat("jpeg")
    .jpeg({ quality: 80 })
    .toFile(`public/image/users/${req.file.filename}`);
  next();
}catch(error){
  console.log("error image processor"+error)
}
}
// exports.productImage = (req, res, next) => {
//   req.file.filename = `${req.body.name}_${Date.now()}_${req.}.jpeg`;

//   sharp(req.file.buffer)
//     .resize(320, 320)
//     .toFormat("jpeg")
//     .jpeg({ quality: 80 })
//     .toFile(`public/img/products/${req.file.filename}`);
//   next();
// };
