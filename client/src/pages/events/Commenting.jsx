import React, { useState, useEffect } from 'react';
import CommentItem from './CommentItem';
import { getCurrentUser, getAuthToken } from '../../utils/auth';

// Add CSS animations
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  @keyframes shimmer {
    0% { transform: translateX(-100%); }
    100% { transform: translateX(100%); }
  }
  
  @keyframes float {
    0%, 100% { transform: translateY(0px); }
    50% { transform: translateY(-10px); }
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.8; }
  }
`;
document.head.appendChild(styleSheet);

const API_BASE = 'http://localhost:5000/api/events';

export default function Commenting({ eventId, currentUser }) {
  const [comments, setComments] = useState({});
  const [commentLoading, setCommentLoading] = useState({});
  const [newComment, setNewComment] = useState({});
  const [replyingTo, setReplyingTo] = useState(null);
  const [showComments, setShowComments] = useState({});

  const fetchComments = async (eventId) => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE}/${eventId}/comments`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await res.json();

      if (res.ok) {
        setComments(prev => ({ ...prev, [eventId]: data.data || [] }));
        setShowComments(prev => ({ ...prev, [eventId]: true }));
      }
    } catch (err) {
      console.error('Failed to fetch comments:', err);
    }
  };

  const handleAddComment = async (eventId, content, parentId = null) => {
    if (!content.trim()) return;

    setCommentLoading(prev => ({ ...prev, [eventId]: true }));

    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE}/${eventId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ content, parentId })
      });

      const data = await res.json();

      if (res.ok) {
        await fetchComments(eventId);
        setNewComment(prev => ({ ...prev, [eventId]: '' }));
        setReplyingTo(null);
      } else {
        console.error(data.message || 'Failed to add comment');
      }
    } catch (err) {
      console.error('Failed to add comment');
    } finally {
      setCommentLoading(prev => ({ ...prev, [eventId]: false }));
    }
  };

  const toggleComments = (eventId) => {
    if (showComments[eventId]) {
      setShowComments(prev => ({ ...prev, [eventId]: false }));
    } else {
      fetchComments(eventId);
    }
  };

  const handleLikeComment = async (eventId, commentId) => {
    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE}/${eventId}/comments/${commentId}/like`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        await fetchComments(eventId);
      }
    } catch (err) {
      console.error('Failed to like comment:', err);
    }
  };

  const handleDeleteComment = async (eventId, commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;

    try {
      const token = getAuthToken();
      const res = await fetch(`${API_BASE}/${eventId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (res.ok) {
        await fetchComments(eventId);
      }
    } catch (err) {
      console.error('Failed to delete comment:', err);
    }
  };

  const handleReply = (commentId) => {
    setReplyingTo((prev) =>
      prev === commentId ? null : commentId
    );
  };

  const handleAddReply = (content) => {
    handleAddComment(eventId, content, replyingTo);
  };

  const handleCommentChange = (value) => {
    setNewComment(prev => ({ ...prev, [eventId]: value }));
  };

  return (
    <div style={{
      marginTop: '80px',
      marginBottom: '30px',
      padding: '0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Show Comments Button */}
      {!showComments[eventId] && (
        <div style={{
          width: '100%',
          maxWidth: '600px',
          textAlign: 'center'
        }}>
          <button
            onClick={() => toggleComments(eventId)}
            style={{
              padding: '15px 40px',
              background: 'linear-gradient(135deg, #1877f2 0%, #42a5f5 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '30px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(24, 119, 242, 0.4)',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseOver={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #166fe5 0%, #2196f3 100%)';
              e.target.style.transform = 'translateY(-3px) scale(1.02)';
              e.target.style.boxShadow = '0 8px 25px rgba(24, 119, 242, 0.5)';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'linear-gradient(135deg, #1877f2 0%, #42a5f5 100%)';
              e.target.style.transform = 'translateY(0) scale(1)';
              e.target.style.boxShadow = '0 4px 15px rgba(24, 119, 242, 0.4)';
            }}
          >
            <span style={{
              position: 'relative',
              zIndex: 1
            }}>
              <i className="fas fa-comments me-3" style={{ 
                fontSize: '18px',
                verticalAlign: 'middle'
              }}></i>
              Join the Discussion
            </span>
            <div style={{
              position: 'absolute',
              top: '50%',
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
              transform: 'translateY(-50%)',
              transition: 'left 0.6s ease'
            }}></div>
          </button>
          <p style={{
            color: '#6b7280',
            fontSize: '14px',
            marginTop: '15px',
            fontStyle: 'italic'
          }}>
            Click to see what people are saying about this event
          </p>
        </div>
      )}

      {/* Comments Content - Only show when showComments[eventId] is true */}
      {showComments[eventId] && (
        <div style={{
          width: '100%',
          maxWidth: '800px',
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          borderRadius: '25px',
          padding: '30px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          border: '2px solid rgba(102, 126, 234, 0.1)',
          position: 'relative'
        }}>
          {/* Header with Close Button */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '25px',
            paddingBottom: '15px',
            borderBottom: '1px solid rgba(102, 126, 234, 0.1)'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '15px'
            }}>
              <div style={{
                position: 'absolute',
                top: '-10px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '60px',
                height: '20px',
                background: 'linear-gradient(135deg, #ff6b35 0%, #f7931e 100%)',
                borderRadius: '10px',
                boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)'
              }}></div>
              <h6 style={{
                fontWeight: '700',
                color: '#1a202c',
                margin: '0',
                fontSize: '18px',
                textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
                letterSpacing: '0.5px'
              }}>
                <i className="fas fa-comments me-3" style={{ 
                  fontSize: '20px',
                  verticalAlign: 'middle',
                  color: '#667eea'
                }}></i>
                Discussion Hub
                <span style={{
                  background: 'rgba(102, 126, 234, 0.1)',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  marginLeft: '15px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#64748b'
                }}>
                  {comments[eventId]?.length || 0} {comments[eventId]?.length === 1 ? 'Comment' : 'Comments'}
                </span>
              </h6>
            </div>
            <button
              onClick={() => toggleComments(eventId)}
              style={{
                padding: '8px 16px',
                background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: '20px',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                fontWeight: '600',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseOver={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.4)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.3)';
              }}
            >
              <i className="fas fa-times me-2"></i>
              Close
            </button>
          </div>

          {/* Add Comment Form */}
          <div style={{
            marginBottom: '25px',
            padding: '25px',
            background: '#fff',
            borderRadius: '20px',
            border: '2px solid rgba(102, 126, 234, 0.1)',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ display: 'flex', gap: '15px', marginBottom: '15px', alignItems: 'flex-start' }}>
              <div
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #1877f2 0%, #42a5f5 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: '700',
                  fontSize: '18px',
                  flexShrink: 0,
                  boxShadow: '0 4px 12px rgba(24, 119, 242, 0.3)',
                  border: '3px solid #fff'
                }}
              >
                {currentUser?.name ? 
                  currentUser.name.split(' ').length >= 2 ? 
                    (currentUser.name.split(' ')[0][0] + currentUser.name.split(' ')[1][0]).toUpperCase() :
                    currentUser.name.charAt(0).toUpperCase()
                  : 'AN'
                }
              </div>
              <div style={{ flex: 1 }}>
                <textarea
                  value={newComment[eventId] || ''}
                  onChange={(e) => handleCommentChange(e.target.value)}
                  placeholder="Share your thoughts about this event..."
                  style={{
                    width: '100%',
                    minHeight: '80px',
                    padding: '15px',
                    borderRadius: '15px',
                    border: '2px solid #e2e8f0',
                    background: '#f8fafc',
                    color: '#1a202c',
                    resize: 'vertical',
                    outline: 'none',
                    fontSize: '15px',
                    fontFamily: 'inherit',
                    lineHeight: '1.5',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.boxShadow = '0 0 0 4px rgba(102, 126, 234, 0.1)';
                    e.target.style.background = '#fff';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e2e8f0';
                    e.target.style.boxShadow = 'none';
                    e.target.style.background = '#f8fafc';
                  }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <button
                onClick={() => handleAddComment(eventId, newComment[eventId])}
                disabled={!newComment[eventId]?.trim() || commentLoading[eventId]}
                style={{
                  border: 'none',
                  borderRadius: '20px',
                  background: newComment[eventId]?.trim() && !commentLoading[eventId] 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : '#e2e8f0',
                  color: newComment[eventId]?.trim() && !commentLoading[eventId] ? '#fff' : '#a0aec0',
                  padding: '12px 30px',
                  cursor: newComment[eventId]?.trim() && !commentLoading[eventId] ? 'pointer' : 'not-allowed',
                  fontSize: '15px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  boxShadow: newComment[eventId]?.trim() && !commentLoading[eventId] 
                    ? '0 4px 15px rgba(102, 126, 234, 0.4)' 
                    : 'none'
                }}
                onMouseOver={(e) => {
                  if (newComment[eventId]?.trim() && !commentLoading[eventId]) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.5)';
                  }
                }}
                onMouseOut={(e) => {
                  if (newComment[eventId]?.trim() && !commentLoading[eventId]) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
                  }
                }}
              >
                <i className="fas fa-paper-plane me-2"></i>
                {commentLoading[eventId] ? 'Posting...' : 'Share Thought'}
              </button>
            </div>
          </div>

          {/* Comments List */}
          <div>
            {comments[eventId] && comments[eventId].length > 0 ? (
              <div style={{
                background: 'rgba(255, 255, 255, 0.5)',
                borderRadius: '15px',
                padding: '20px'
              }}>
                {comments[eventId].map((comment) => (
                  <CommentItem
                    key={comment._id}
                    comment={comment}
                    currentUser={currentUser}
                    onReply={handleReply}
                    onCancelReply={() => setReplyingTo(null)}
                    onLike={(commentId) => handleLikeComment(eventId, commentId)}
                    onDelete={(commentId) => handleDeleteComment(eventId, commentId)}
                    replyingTo={replyingTo}
                    onAddReply={handleAddReply}
                    replyLoading={commentLoading[eventId]}
                  />
                ))}
              </div>
            ) : (
              <div style={{
                textAlign: 'center',
                padding: '40px',
                background: 'rgba(102, 126, 234, 0.05)',
                borderRadius: '15px',
                border: '2px dashed rgba(102, 126, 234, 0.2)'
              }}>
                <i className="fas fa-comment-slash" style={{
                  fontSize: '48px',
                  color: '#cbd5e1',
                  marginBottom: '20px'
                }}></i>
                <h6 style={{
                  color: '#64748b',
                  fontSize: '18px',
                  fontWeight: '600',
                  margin: '0 0 10px 0'
                }}>
                  Start the Conversation
                </h6>
                <p style={{
                  color: '#94a3b8',
                  fontSize: '14px',
                  margin: '0',
                  lineHeight: '1.5'
                }}>
                  Be the first to share your thoughts about this amazing event!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
