const db = require('../db/models/index');
const Comment = db.Comment; 
const User = db.User;
const Vote = db.Vote;

// GET /:type/:id/comments
const getComments = async function(req, res) {
  try {
    if (req.params.type === 'blog') { 
      Comment.findAll({
        where: {
          'BlogId': req.params.id
        },
        active: true,
        include: [{
          model: User,
          attributes: [
            ['fname', 'fname'],
            ['lname', 'lname']
          ]}
        ],
        }).then(comments => {
        res.send(comments);
      })
      .catch(err => {
        throw(err);
      });
    } else if (req.params.type === 'idea') {
      var dbComments = await Comment.findAll({
        where: {
          'IdeaId': req.params.id
        },
        active: true,
        include: [{
          model: User,
          attributes: [
            ['fname', 'fname'],
            ['lname', 'lname']
          ]}
        ],
        order: [['id', 'ASC']]
      }).catch(err => {
        throw(err);
      });
      var comments = await Promise.all(dbComments.map(comment => addVotes(comment)));
      comments.sort((a,b) => {
        if (a.upvoteCount - a.downvoteCount > b.upvoteCount - b.downvoteCount) {
          return 1;
        }
        if (a.upvoteCount - a.downvoteCount < b.upvoteCount - b.downvoteCount) {
          return -1;
        }
        return 0;
      }).reverse(); 
      res.send(comments);
    }
  } catch(e) {
      return res.status(500).json({
        errors: {
          error: e.stack
        },
      });
  }
};

// Adds votes to an comment object
const addVotes = async comment => {
  var upvoteCount = await Vote.count({ where: {'up': true, 'CommentId': comment.id} });

  var downvoteCount = await Vote.count({ where: {'down': true, 'CommentId': comment.id} });
  return await {
    comment,
    upvoteCount,
    downvoteCount,
  }
}

// POST /:type/:id/comment
const addComment = (req, res, next) => {
  try {
    if (req.params.type === 'blog') {
      Comment.create({
        text: req.body.text,
        active: true,
        UserId: req.session.user.id,
        BlogId: req.params.id,
      }).catch((err) => { throw err;});

    } else if (req.params.type === 'idea') {
      Comment.create({
        text: req.body.text,
        active: true,
        UserId: req.session.user.id,
        IdeaId: req.params.id, 
      }).catch((err) => { throw err;});
    }
    res.status(200).end();
  } catch(e){
      return res.status(400).json({
          errors: {
            error: e.stack
          },
      });
  }
};

// PUT /comment/:id
const editComment = (req, res) => {
  Comment.findByPk(req.params.id).then(comment => {
    if (req.session.user.id != comment.UserId) {
      return res.status(401).send("Unauthorized");
    }
  });
  try {
    Comment.update({
      text: req.body.text,
    }, { where: {id: req.params.id}});
    res.status(200).end();
  } catch(e){
    return res.status(500).json({
      errors: {
        error: e.stack
      },
    });
  }
};

// DELETE /comment/:id
const deleteComment = (req, res) => {
  Comment.findByPk(req.params.id).then(comment => {
    if (req.session.user.id != comment.UserId) {
      return res.status(401).send("Unauthorized");
    }
  });
  try {
    Comment.update({
      active: false
    }, { where: {id: req.params.id}});
    res.status(200).end();
  } catch(e){
    return res.status(500).json({
      errors: {
        error: e.stack
      },
    });
  }
};

// POST /comment/:id/upvote
const upvote = async function(req, res) {
  try {
    var existingVote = await Vote.findOne({ where: {UserId: req.session.user.id, CommentId: req.params.id}});
    if (existingVote != null) {
      return res.status(409).json({
        errors: {
          error: 'You have already voted',
        },
      });
    } else {
      Vote.create({
        UserId: req.session.user.id,
        CommentId: req.params.id,
        up: true
      }).catch((err) => {throw err;});
      res.status(200).end();
    }
  } catch(e) {
    return res.status(400).json({
      errors: {
        error: e.stack,
      }
    });
  }
};

// POST /comment/:id/downvote
const downvote = async function(req, res) {
  try {
    var existingVote = await Vote.findOne({ where: {UserId: req.session.user.id, CommentId: req.params.id}});
    if (existingVote != null) {
      return res.status(409).json({
        errors: {
          error: 'You have already voted',
        },
      });
    } else {
      Vote.create({
        UserId: req.session.user.id,
        CommentId: req.params.id,
        down: true
      }).catch((err) => {throw err;});
      res.status(200).end();
    }
  } catch(e) {
    return res.status(400).json({
      errors: {
        error: e.stack,
      }
    });
  }
};

// POST /comment/:id/rate
const rate = async function (req, res) {
  try {
    var existingRating = await Rating.findOne({ where: {UserId: req.session.user.id, CommentId: req.params.id}});
    if (existingRating != null) {
      return res.status(409).json({
        errors: {
          error: 'You have already rated',
        },
      });
    } else {
      Rating.create({
        UserId: req.session.user.id,
        CommentId: req.params.id,
        rating: req.body.rating
      }).catch((err) => {throw err;});
      res.status(200).end();
    }
  } catch(e) {
    return res.status(400).json({
      errors: {
        error: e.stack,
      }
    });
  }
};

module.exports = {
  getComments,
  addComment,
  editComment,
  deleteComment,
  upvote,
  downvote,
  rate
};

