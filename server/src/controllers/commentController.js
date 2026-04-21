const Comment = require('../models/Comment');
const Event = require('../models/Event');
const User = require('../models/User');
const { isValidObjectId } = require('mongoose');

/**
 * Validate MongoDB ObjectId
 */
const isValidId = (id) => isValidObjectId(id);

/**
 * Get all comments for an event
 * GET /api/events/:eventId/comments
 */
async function getComments(req, res) {
  try {
    const { eventId } = req.params;

    console.log('getComments called with eventId:', eventId);

    if (!isValidId(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // Get top-level comments with populated user info and replies
    const comments = await Comment.find({
      eventId,
      parentId: null,
      isDeleted: false
    })
    .populate('userId', 'firstName lastName email userType')
    .populate({
      path: 'replies',
      populate: {
        path: 'userId',
        select: 'firstName lastName email userType'
      },
      options: { sort: { createdAt: 1 } }
    })
    .sort({ createdAt: -1 });

    // Create virtual name fields for all comments and replies
    const processComments = (comments) => {
      return comments.map(comment => {
        if (!comment.userId.name && comment.userId.firstName && comment.userId.lastName) {
          comment.userId.name = `${comment.userId.firstName} ${comment.userId.lastName}`;
        }
        
        // Process replies
        if (comment.replies && Array.isArray(comment.replies)) {
          comment.replies = comment.replies.map(reply => {
            if (!reply.userId.name && reply.userId.firstName && reply.userId.lastName) {
              reply.userId.name = `${reply.userId.firstName} ${reply.userId.lastName}`;
            }
            return reply;
          });
        }
        
        return comment;
      });
    };

    const processedComments = processComments(comments);

    res.json({
      success: true,
      message: 'Comments retrieved successfully',
      data: processedComments
    });
  } catch (err) {
    console.error('Get Comments Error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error occurred while fetching comments',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

/**
 * Add a comment to an event
 * POST /api/events/:eventId/comments
 */
async function addComment(req, res) {
  try {
    const { eventId } = req.params;
    const { content, parentId } = req.body;
    const userId = req.user.id;

    if (!isValidId(eventId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid event ID format'
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    if (content.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Comment cannot exceed 1000 characters'
      });
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: 'Event not found'
      });
    }

    // If it's a reply, validate parent comment exists
    if (parentId) {
      if (!isValidId(parentId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid parent comment ID format'
        });
      }

      const parentComment = await Comment.findById(parentId);
      if (!parentComment || parentComment.eventId.toString() !== eventId) {
        return res.status(400).json({
          success: false,
          message: 'Parent comment not found or does not belong to this event'
        });
      }
    }

    const comment = new Comment({
      eventId,
      userId,
      content: content.trim(),
      parentId: parentId || null
    });

    await comment.save();

    // Populate user info for response - include more fields to ensure name is available
    await comment.populate('userId', 'firstName lastName email userType');

    // Create a virtual name field if it doesn't exist
    if (!comment.userId.name && comment.userId.firstName && comment.userId.lastName) {
      comment.userId.name = `${comment.userId.firstName} ${comment.userId.lastName}`;
    }

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: comment
    });
  } catch (err) {
    console.error('Add Comment Error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error occurred while adding comment',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

/**
 * Update a comment
 * PUT /api/events/:eventId/comments/:commentId
 */
async function updateComment(req, res) {
  try {
    const { eventId, commentId } = req.params;
    const { content } = req.body;
    const userId = req.user.id;

    if (!isValidId(eventId) || !isValidId(commentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    if (!content || !content.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Comment content is required'
      });
    }

    if (content.length > 1000) {
      return res.status(400).json({
        success: false,
        message: 'Comment cannot exceed 1000 characters'
      });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    if (comment.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own comments'
      });
    }

    if (comment.eventId.toString() !== eventId) {
      return res.status(400).json({
        success: false,
        message: 'Comment does not belong to this event'
      });
    }

    comment.content = content.trim();
    await comment.save();

    res.json({
      success: true,
      message: 'Comment updated successfully',
      data: comment
    });
  } catch (err) {
    console.error('Update Comment Error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error occurred while updating comment',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

/**
 * Delete a comment (soft delete)
 * DELETE /api/events/:eventId/comments/:commentId
 */
async function deleteComment(req, res) {
  try {
    const { eventId, commentId } = req.params;
    const userId = req.user.id;

    console.log('deleteComment called with:', { eventId, commentId, userId });

    if (!isValidId(eventId) || !isValidId(commentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    if (comment.userId.toString() !== userId) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own comments'
      });
    }

    if (comment.eventId.toString() !== eventId) {
      return res.status(400).json({
        success: false,
        message: 'Comment does not belong to this event'
      });
    }

    comment.isDeleted = true;
    await comment.save();

    res.json({
      success: true,
      message: 'Comment deleted successfully'
    });
  } catch (err) {
    console.error('Delete Comment Error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error occurred while deleting comment',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

/**
 * Like/Unlike a comment
 * POST /api/events/:eventId/comments/:commentId/like
 */
async function toggleLike(req, res) {
  try {
    const { eventId, commentId } = req.params;
    const userId = req.user.id;

    console.log('toggleLike called with:', { eventId, commentId, userId });

    if (!isValidId(eventId) || !isValidId(commentId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid ID format'
      });
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found'
      });
    }

    if (comment.eventId.toString() !== eventId) {
      return res.status(400).json({
        success: false,
        message: 'Comment does not belong to this event'
      });
    }

    const likeIndex = comment.likes.indexOf(userId);
    let liked = false;

    if (likeIndex > -1) {
      // Unlike
      comment.likes.splice(likeIndex, 1);
    } else {
      // Like
      comment.likes.push(userId);
      liked = true;
    }

    await comment.save();

    res.json({
      success: true,
      message: liked ? 'Comment liked' : 'Comment unliked',
      data: {
        liked,
        likeCount: comment.likes.length
      }
    });
  } catch (err) {
    console.error('Toggle Like Error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error occurred while toggling like',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
}

module.exports = {
  getComments,
  addComment,
  updateComment,
  deleteComment,
  toggleLike
};