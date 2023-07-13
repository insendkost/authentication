const express = require("express");

const blogControllers = require("../controllers/post-controllers");
const router = express.Router();

router.get("/", blogControllers.getHome);

router.get("/admin", blogControllers.getAdmin);

router.post("/posts", blogControllers.setPost);

router.get("/posts/:id/edit", blogControllers.getSinglePost);

router.post("/posts/:id/edit", blogControllers.editPost);

router.post("/posts/:id/delete", blogControllers.deletePost);

module.exports = router;
