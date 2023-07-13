const Post = require("../models/posts");
const validation = require("../util/validation-session");
const validator = require("../util/validator");

function getHome(req, res) {
  res.render("welcome");
}

async function getAdmin(req, res) {
  if (!res.locals.isAuth) {
    return res.status(401).render("401");
  }

  const posts = await Post.fetchAll();

  let sessionErrorData = validation.getSessionErrorData(req, {
    title: "Give some title here...",
    content: "Add your content...",
  });

  res.render("admin", {
    posts: posts,
    inputData: sessionErrorData,
    //csrfToken: req.csrfToken(),
  });
}

async function setPost(req, res) {
  const enteredTitle = req.body.title;
  const enteredContent = req.body.content;

  if (validator.isValid(req)) {
    req.session.inputData = {
      hasError: true,
      message: "Invalid input - please check your data.",
      title: enteredTitle,
      content: enteredContent,
    };

    res.redirect("/admin");
    return; // or return res.redirect('/admin'); => Has the same effect
  }

  const newPost = new Post(enteredTitle, enteredContent);
  await newPost.save();

  res.redirect("/admin");
}

async function getSinglePost(req, res) {
  const post = new Post(null, null, req.params.id);
  await post.fetchSingle();

  if (!post.content || !post.title) {
    return res.render("404"); // 404.ejs is missing at this point - it will be added later!
  }

  let sessionErrorData = validation.getSessionErrorData(req, {
    title: post.title,
    content: post.content,
  });

  res.render("single-post", {
    post: post,
    inputData: sessionErrorData,
    //csrfToken: req.csrfToken(),
  });
}

async function editPost(req, res) {
  if (validator.isValid()) {
    validation.flashErrorToSession(
      req,
      {
        message: "Invalid input - please check your data.",
        title: enteredTitle,
        content: enteredContent,
      },
      function () {
        res.redirect(`/posts/${req.params.id}/edit`);
      }
    );

    return;
  }

  const post = new Post(enteredTitle, enteredContent, req.params.id);
  await post.save();

  res.redirect("/admin");
}

async function deletePost(req, res) {
  const post = new Post(null, null, req.params.id);
  await post.delete();
  res.redirect("/admin");
}

module.exports = {
  getHome: getHome,
  getAdmin: getAdmin,
  setPost: setPost,
  editPost: editPost,
  getSinglePost: getSinglePost,
  deletePost: deletePost,
};
