const auth = (req, res, next) => {
  const password = req.header('x-admin-password');
  
  // If the admin password isn't set on the server, reject to be safe,
  // or you could bypass if not set (but better to enforce it).
  if (!process.env.ADMIN_PASSWORD) {
    console.error('ADMIN_PASSWORD environment variable is not set!');
    return res.status(500).json({ message: 'Server configuration error' });
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ message: 'Unauthorized. Incorrect or missing password.' });
  }

  next();
};

module.exports = auth;
