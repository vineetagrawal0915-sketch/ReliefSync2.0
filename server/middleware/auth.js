const supabase = require('../config/supabase');

const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Authentication required. Please log in.' });

  try {
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error('Supabase Auth Error:', error);
      return res.status(403).json({ error: 'Your session has expired. Please log in again.' });
    }

    req.user = user;
    
    // Fetch profile to get role with a fallback to metadata or default
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
      
    // Priority: Database Profile > JWT Metadata > Default 'volunteer'
    req.user.role = profile?.role || user.user_metadata?.role || 'volunteer';
    
    next();
  } catch (err) {
    res.status(500).json({ error: 'Internal security error' });
  }
};

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Unauthorized access' });
    }
    next();
  };
};

module.exports = { authenticateToken, authorizeRoles };
