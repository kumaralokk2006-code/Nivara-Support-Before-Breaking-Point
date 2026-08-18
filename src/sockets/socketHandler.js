const { screenCirclePost } = require('../services/moderationService');
const CirclePost = require('../models/CirclePost');

const initializeSockets = (io) => {
  io.on('connection', (socket) => {
    // Join a temporary support circle room
    socket.on('join_circle', (circleId) => {
      socket.join(`circle_${circleId}`);
    });

    // Leave a temporary support circle room
    socket.on('leave_circle', (circleId) => {
      socket.leave(`circle_${circleId}`);
    });

    // Real-time message with moderation
    socket.on('send_circle_message', async (data) => {
      try {
        const { circleId, authorStudentId, anonymousAlias = 'Peer', content } = data;
        const screening = screenCirclePost(content);

        const post = await CirclePost.create({
          circleId,
          authorStudentId,
          anonymousAlias,
          content,
          moderationStatus: screening.status,
          moderationFlags: screening.flags
        });

        if (screening.status === 'APPROVED') {
          io.to(`circle_${circleId}`).emit('new_circle_message', {
            id: post._id,
            anonymousAlias,
            content,
            createdAt: post.createdAt
          });
        } else {
          socket.emit('message_moderation_notice', {
            status: screening.status,
            message: screening.status === 'PENDING_REVIEW'
              ? 'Your message was held for review by peer moderators.'
              : 'Support resources are available. Please reach out to campus counseling.'
          });
        }
      } catch (err) {
        socket.emit('socket_error', { message: err.message });
      }
    });

    socket.on('disconnect', () => {
      // User disconnected cleanly
    });
  });
};

module.exports = { initializeSockets };
