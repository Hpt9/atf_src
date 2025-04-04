// Example backend code
const Pusher = require('pusher');

const pusher = new Pusher({
  appId: "your_app_id",
  key: "6801d180c935c080fb57",
  secret: "your_secret",
  cluster: "eu",
});

app.post('/api/messages', async (req, res) => {
  const { fromUser, toUser, message } = req.body;
  
  try {
    await pusher.trigger('chat', 'message', {
      fromUser,
      toUser,
      message,
      time: new Date().toLocaleTimeString()
    });
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to send message' });
  }
}); 