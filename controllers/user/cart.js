const cartCollection = require("../../models/user/cart");
const productCollection = require("../../models/admin/product");
const wishlistCollection = require("../../models/user/wishlist");
const { default: mongoose } = require("mongoose");

exports.viewCart = async (req, res) => {
  try {
    const userCart = await cartCollection.findOne({ customer: req.session.userID }).populate({ path: "products.name", populate: { path: "brand" } });
    res.render("user/profile/partials/cart", {
      userCart,
      documentTitle: "Your Cart | SHOE ZONE",
      session:req.session.userID,
    });
  } catch (error) {
    console.log("error rendering cart page:" + error)
  }
}

exports.addToCart = async (req, res) => {
  try {

    const wishlistCheck = await wishlistCollection.findOne({
      customer: req.session.userID,
      products: new mongoose.Types.ObjectId(req.body.id)
    });

    if (wishlistCheck) {
      await wishlistCollection.findByIdAndUpdate(wishlistCheck._id,
        { $pull: { products: req.body.id } });
    }
    const product = await productCollection.findOne({ _id: req.body.id });
    const userCart = await cartCollection.findOne({ customer: req.session.userID });
    const prodExist = await cartCollection.findOne({
      _id: userCart._id,
      products: { $elemMatch: { name: new mongoose.Types.ObjectId(req.body.id) } }
    });
    if(product.stock===0){
      res.json({
        success: "outofstcok",
        message: 0,
      });
    }
   else if (prodExist) {
      await cartCollection.updateOne({
        _id: userCart._id,
        products: { $elemMatch: { name: req.body.id } }
      }, {
        $inc: {
          "products.$.quantity": 1,
          totalPrice: product.price,
          totalQuantity: 1,
          "products.$.price": product.price,
        }
      });
      res.json({
        success: "countAdded",
        message: 1,
      });

    }
    else {
      await cartCollection.findByIdAndUpdate(userCart._id,
        {
          $push: { products: { name: req.body.id, price: product.price } },
          $inc: { totalQuantity: 1, totalPrice: product.price }
        })
      res.json({
        success: "addedToCart",
        message: 1
      });

    }


  } catch (error) {
    console.log("error on addin to cart:" + error)
  }
}

exports.removeProduct = async (req, res) => {
  try {
    const productId = req.query.id;
    const userID = req.session.userID;
    let cartProduct = await cartCollection.aggregate([{
      $match: {
        customer: new mongoose.Types.ObjectId(req.session.userID)
      }
    }, {
      $unwind: "$products",
    }, {
      $match: {
        "products.name": new mongoose.Types.ObjectId(req.query.id),
      },
    },]);
    const cartID = cartProduct[0]._id;
    cartProduct = cartProduct[0].products;
    await cartCollection.findByIdAndUpdate(cartID, {
      $pull: {
        products: {
          name: req.query.id,
        },
      },
      $inc: {
        totalPrice: -cartProduct.price,
        totalQuantity: -cartProduct.quantity,
      },
    })
    res.json({
      success: "removed",
    });
  } catch (error) {
    res.redirect('/');
    console.log("error on remoing the product:" + error)
  }
}

exports.countChange = async (req, res) => {
  try {
    const productID = req.body.id;
    const count = Number(req.body.count);
    const product = await productCollection.findById(productID);
    await cartCollection.findOneAndUpdate({
      customer: req.session.userID,
      products: { $elemMatch: { name: new mongoose.Types.ObjectId(req.body.id) } }
    }, {
      $inc: {
        "products.$.quantity": count,
        totalPrice: count * product.price,
        "products.$.price": count * product.price,
        totalQuantity: count
      }
    })
    const userCart = await cartCollection.findOne({ customer: req.session.userID });
    const allProducts = userCart.products;

    const currentProduct = allProducts.find((product) => {
      return product.name.valueOf() == req.body.id
    });
    if (currentProduct.quantity === 0) {
      await cartCollection.updateOne({ customer: req.session.userID },
        {
         $pull:{products: {
          name: productID,
        },}
        })
    }
    res.json({
      data: {
        currentProduct,
        userCart,
      },
    })


  } catch (error) {
    console.log("error on chamging count :" + error)
  }
}