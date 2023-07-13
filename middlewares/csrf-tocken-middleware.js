function addCSRFToken(req, res, next) {
  //const csrfTocken = req.csrfTocken();
  res.locals.csrfTocken = req.csrfToken();
  next();
}

module.exports = addCSRFToken;
