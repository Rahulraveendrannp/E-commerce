exports.signOut = (req, res) => {
  try {
    req.session.destroy();
    res.redirect("/productManager");
  } catch (error) {
    console.log("Error signing out manager: " + error);
  }
};
