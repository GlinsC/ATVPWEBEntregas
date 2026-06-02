class AuthViewController {
  loginPage = (req, res) => {
    res.render("login", {
      errorMessage: req.query.error || "",
      successMessage: req.query.success || "",
      formData: {}
    });
  };

  registrarPage = (req, res) => {
    res.render("registrar", {
      errorMessage: req.query.error || "",
      successMessage: req.query.success || "",
      formData: {}
    });
  };
}

module.exports = AuthViewController;
