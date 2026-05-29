const { Router } = require("express");
const router = Router();

const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../services/cloudinary");

const Blog = require("../models/blog");
const CommentDB = require("../models/comment");

const storage = new CloudinaryStorage({
    cloudinary,
    params: {
        folder: "blog-images",
        allowed_formats: ["jpg", "jpeg", "png", "webp"],
    },
});

const upload = multer({ storage });

router.get("/add-new", (req, res) => {
    return res.render("addBlog", {
        user: req.user,
    });
});

router.get("/:id", async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate("createdBy");
    const allcomment = await CommentDB.find({
        blogId: req.params.id,
    }).populate("createdBy");

    return res.render("blog", {
        user: req.user,
        blog,
        allComment: allcomment,
    });
});

router.post("/comment/:blogid", async (req, res) => {
    await CommentDB.create({
        content: req.body.content,
        blogId: req.params.blogid,
        createdBy: req.user._id,
    });

    return res.redirect(`/blog/${req.params.blogid}`);
});

router.post("/", upload.single("coverImage"), async (req, res) => {
    const { title, body } = req.body;
    const blog = await Blog.create({
        title,
        body,
        createdBy: req.user._id,
        coverImageURL: req.file.path, // Cloudinary URL
    })
    return res.redirect(`/blog/${blog._id}`);
});

module.exports = router;