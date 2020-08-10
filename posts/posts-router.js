const express = require("express");
const posts = require("../data/db");

const router = express.Router();

router.get("/api/posts", (req, res) => {
  posts
    .find(req.query)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the posts",
      });
    });
});

router.get("/api/posts/:id/", (req, res) => {
  posts
    .findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({
          message: "Post not found",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the post",
      });
    });
});

router.get("/api/posts/:id/comments", (req, res) => {
  posts
    .findPostComments(req.params.id)
    .then((comment) => {
      if (comment) {
        res.status(200).json(comment);
      } else {
        res.status(404).json({
          message: "Comments not found",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error retrieving the comments",
      });
    });
});

router.delete("/api/posts/:id", (req, res) => {
  posts
    .remove(req.params.id)
    .then((count) => {
      if (count > 0) {
        res.status(200).json({
          message: "Post deleted successfully.",
        });
      } else {
        res.status(404).json({
          message: "The post could not be found",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error removing the post",
      });
    });
});

router.post("/api/posts", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    return res.status(400).json({
      message: "Missing post title or contents",
    });
  }
  posts
    .insert(req.body)
    .then((post) => {
      res.status(201).json(post);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error adding the post",
      });
    });
});

router.post("/api/posts/:id/comments", (req, res) => {
  if (!req.body.text) {
    return res.status(400).json({
      errorMessage: "Please provide text for the comment.",
    });
  } else {
    posts
      .findById(req.params.id)
      .then((post) => {
        if (post) {
          posts
            .insertComment({ post_id: req.params.id, ...req.body })
            .then((comment) => {
              res.status(200).json(comment);
            })
            .catch((error) => {
              console.log(error);
              res.status(500).json({
                error:
                  "There was an error while saving the comment to the database",
              });
            });
        } else {
          res.status(404).json({
            message: "The post with the specified ID does not exist.",
          });
        }
      })
      .catch((error) => {
        console.log(error);
        res.status(500).json({
          error: "The post information could not be retrieved.",
        });
      });
  }
});

router.put("/api/posts/:id", (req, res) => {
  if (!req.body.title || !req.body.contents) {
    return res.status(400).json({
      message: "Missing post title or contents",
    });
  }
  posts
    .update(req.params.id, req.body)
    .then((post) => {
      if (post) {
        res.status(200).json("Post was updated");
      } else {
        res.status(404).json({
          message: "The post could not be found",
        });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({
        message: "Error updating the user",
      });
    });
});

module.exports = router;
