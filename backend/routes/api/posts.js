const express = require("express");
const asyncHandler = require("express-async-handler");
const { check, validationResult } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");
const { setTokenCookie, restoreUser, requireAuth} = require("../../utils/auth");
const { User, Post, Topic, Like, Comment } = require("../../db/models");

const router = express.Router();

// Does requireAuth replace this?
// const checkPermissions = (post, currentUser) => {
//   if (post.userId !== currentUser.id) {
//     const err = new Error('Illegal operation.');
//     err.status = 403;
//     throw err;
//   }
// };


const postValidators = [
  check('body')
    .exists({ checkFalsy: true })
    .withMessage('Please provide a value for userInput')
    .isLength({ max: 100 }),
];


// GET: all post
router.get('/', asyncHandler( async(req, res, next) => {
  const post = await Post.findAll({
    include: [
      User,
      Comment
    ]
  });
  return res.json(post)
}))

// GET: post by id
router.get('/:id(\\d+)', asyncHandler( async(req, res, next) => {
  const postId = req.params.id
  const post = await Post.findByPk(postId)
  return res.json(post)
}))

// POST: create post 
router.post('/', requireAuth, asyncHandler( async(req, res, next) => {
  const { body, photo, topic } = req.body;

  const post = await Post.create({
    userId: req.user.id,
    topicId: topic,
    photo: photo,
    body: body
  })

  res.json(post)
}))

// PUT: update post, only description!


// DELETE: delete post
router.delete('/:id(\\d+)', requireAuth, asyncHandler( async(req, res, next) => {
  const postId = req.params.id;
  const post = await Post.findByPk(postId);

  await post.destroy();
  return res.json(post);
}))

module.exports = router;
