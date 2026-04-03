const fs = require('fs');
const file = './backend/controllers/authController.js';
let content = fs.readFileSync(file, 'utf8');

// Replace getMe to refresh token
content = content.replace(
  /exports\.getMe = async \(req, res\) => {[\s\S]*?res\.json\(user\);[\s\S]*?} catch \(error\) {/,
  `exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Refresh token to extend session whenever user opens app within 3 days
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'secret', { expiresIn: '3d' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days
    });

    res.json({ user, token });
  } catch (error) {`
);

fs.writeFileSync(file, content);
