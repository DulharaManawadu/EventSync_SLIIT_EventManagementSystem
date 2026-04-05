import React, { useState } from 'react';

export default function CommentItem({
  comment,
  currentUser,
  onReply,
  onCancelReply,
  onLike,
  onDelete,
  replyingTo,
  onAddReply,
  replyLoading
}) {
  const [replyContent, setReplyContent] = useState('');

  const handleReplySubmit = () => {
    if (!replyContent.trim()) return;
    onAddReply(replyContent.trim());
    setReplyContent('');
  };

  const hasLiked = Array.isArray(comment.likes)
    ? comment.likes.some((likeUserId) =>
        String(likeUserId) === String(currentUser?._id || currentUser?.id)
      )
    : false;

  // Helper function to get display name - prioritize logged-in user's name
  const getDisplayName = (user) => {
    // If this is the current user's comment, always use their logged-in name
    if (currentUser && user && String(user._id || user.id) === String(currentUser._id || currentUser.id)) {
      return currentUser.name && currentUser.name.trim() !== '' ? currentUser.name.trim() : 'You';
    }
    
    // For other users, try different possible name locations in order of preference
    if (!user) return 'You';
    
    // Priority 1: Direct name field (most likely)
    if (user.name && user.name.trim() !== '') {
      return user.name.trim();
    }
    
    // Priority 2: Combined firstName + lastName (from backend population)
    if (user.firstName && user.lastName && user.firstName.trim() !== '' && user.lastName.trim() !== '') {
      return `${user.firstName.trim()} ${user.lastName.trim()}`;
    }
    
    // Priority 3: firstName only
    if (user.firstName && user.firstName.trim() !== '') {
      return user.firstName.trim();
    }
    
    // Priority 4: lastName only
    if (user.lastName && user.lastName.trim() !== '') {
      return user.lastName.trim();
    }
    
    // Priority 5: Nested userId.name field
    if (user.userId && user.userId.name && user.userId.name.trim() !== '') {
      return user.userId.name.trim();
    }
    
    // Priority 6: Nested userId.firstName
    if (user.userId && user.userId.firstName && user.userId.firstName.trim() !== '') {
      return user.userId.firstName.trim();
    }
    
    // Priority 7: Nested userId.lastName
    if (user.userId && user.userId.lastName && user.userId.lastName.trim() !== '') {
      return user.userId.lastName.trim();
    }
    
    // Priority 8: Nested combined firstName + lastName
    if (user.userId && user.userId.firstName && user.userId.lastName && 
        user.userId.firstName.trim() !== '' && user.userId.lastName.trim() !== '') {
      return `${user.userId.firstName.trim()} ${user.userId.lastName.trim()}`;
    }
    
    return 'You';
  };

  // Get the user's initials for avatar
  const getInitials = (name) => {
    if (!name || name.trim() === '') return 'YO';
    const words = name.trim().split(' ');
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.trim().charAt(0).toUpperCase();
  };

  return (
    <div
      style={{
        background: '#f0f2f5',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
        border: '1px solid #e4e6eb',
        width: '100%'
      }}
    >
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <div
          style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            background: comment.userId?._id === (currentUser?._id || currentUser?.id) 
              ? 'linear-gradient(135deg, #1877f2 0%, #42a5f5 100%)' 
              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 600,
            fontSize: '14px',
            flexShrink: 0,
            minWidth: '40px'
          }}
        >
          {getInitials(getDisplayName(comment.userId))}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
            <div>
              <div style={{ 
                fontWeight: 600, 
                color: '#050505', 
                fontSize: '14px',
                lineHeight: '1.2'
              }}>
                {getDisplayName(comment.userId)}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#65676b',
                marginTop: '2px'
              }}>
                {new Date(comment.createdAt).toLocaleString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ 
                color: '#65676b', 
                fontSize: '13px',
                fontWeight: '500'
              }}>
                {comment.likes?.length || 0}
              </span>
            </div>
          </div>

          <div style={{ 
            color: '#050505', 
            lineHeight: 1.5, 
            marginBottom: '8px', 
            fontSize: '14px',
            wordBreak: 'break-word'
          }}>
            {comment.content}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
            <button
              type="button"
              onClick={() => onReply(comment._id)}
              style={{
                border: 'none',
                background: 'transparent',
                color: '#65676b',
                cursor: 'pointer',
                fontSize: '13px',
                padding: '4px 8px',
                borderRadius: '4px',
                transition: 'all 0.2s ease',
                fontWeight: '500'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#f2f3f4';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent';
              }}
            >
              Reply
            </button>
            <button
              type="button"
              onClick={() => onLike(comment._id)}
              style={{
                border: 'none',
                background: 'transparent',
                color: hasLiked ? '#1877f2' : '#65676b',
                cursor: 'pointer',
                fontSize: '13px',
                padding: '4px 8px',
                borderRadius: '4px',
                transition: 'all 0.2s ease',
                fontWeight: '500'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#f2f3f4';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent';
              }}
            >
              {hasLiked ? 'Unlike' : 'Like'}
            </button>
            {comment.userId?._id === (currentUser?._id || currentUser?.id) && (
              <button
                type="button"
                onClick={() => onDelete(comment._id)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  color: '#65676b',
                  cursor: 'pointer',
                  fontSize: '13px',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  transition: 'all 0.2s ease',
                  fontWeight: '500'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#f2f3f4';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'transparent';
                }}
              >
                Delete
              </button>
            )}
          </div>

          {replyingTo === comment._id && (
            <div
              style={{
                marginTop: '12px',
                padding: '12px',
                borderRadius: '8px',
                background: '#f2f3f4',
                border: '1px solid #e4e6eb'
              }}
            >
              <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #1877f2 0%, #42a5f5 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontWeight: 600,
                    fontSize: '12px',
                    flexShrink: 0
                  }}
                >
                  {getInitials(getDisplayName(currentUser))}
                </div>
                <textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  autoFocus
                  style={{
                    flex: 1,
                    minHeight: '60px',
                    padding: '8px 12px',
                    borderRadius: '18px',
                    border: '1px solid #ccd0d5',
                    background: '#fff',
                    color: '#050505',
                    resize: 'vertical',
                    outline: 'none',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    lineHeight: '1.4'
                  }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button
                  type="button"
                  onClick={handleReplySubmit}
                  disabled={!replyContent.trim() || replyLoading}
                  style={{
                    border: 'none',
                    borderRadius: '18px',
                    background: replyContent.trim() && !replyLoading ? '#1877f2' : '#e4e6eb',
                    color: '#fff',
                    padding: '8px 16px',
                    cursor: replyContent.trim() && !replyLoading ? 'pointer' : 'not-allowed',
                    fontSize: '14px',
                    fontWeight: '600',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {replyLoading ? 'Posting...' : 'Reply'}
                </button>
                <button
                  type="button"
                  onClick={onCancelReply}
                  style={{
                    border: 'none',
                    borderRadius: '4px',
                    background: 'transparent',
                    color: '#65676b',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.background = '#f2f3f4';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.background = 'transparent';
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {Array.isArray(comment.replies) && comment.replies.length > 0 && (
            <div style={{ marginTop: '12px', paddingLeft: '8px' }}>
              {comment.replies.map((reply) => (
                <div
                  key={reply._id}
                  style={{
                    padding: '12px',
                    borderRadius: '8px',
                    background: '#f0f2f5',
                    border: '1px solid #e4e6eb',
                    marginBottom: '8px'
                  }}
                >
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: reply.userId?._id === (currentUser?._id || currentUser?.id) 
                          ? 'linear-gradient(135deg, #1877f2 0%, #42a5f5 100%)' 
                          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '12px',
                        flexShrink: 0
                      }}
                    >
                      {getInitials(getDisplayName(reply.userId))}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                        <div>
                          <div style={{ 
                            fontWeight: 600, 
                            color: '#050505', 
                            fontSize: '13px',
                            lineHeight: '1.2'
                          }}>
                            {getDisplayName(reply.userId)}
                          </div>
                          <div style={{ 
                            fontSize: '11px', 
                            color: '#65676b',
                            marginTop: '2px'
                          }}>
                            {new Date(reply.createdAt).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </div>
                        </div>
                      </div>
                      <div style={{ 
                        color: '#050505', 
                        lineHeight: 1.4, 
                        fontSize: '13px',
                        wordBreak: 'break-word'
                      }}>
                        {reply.content}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
