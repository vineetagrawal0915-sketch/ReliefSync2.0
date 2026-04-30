const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');

// Get all reports
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('reports')
      .select('*, profiles(name)');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Submit report (NGO only)
router.post('/', authenticateToken, async (req, res) => {
  const { location, people_helped, resources_used, needs } = req.body;
  const ngo_id = req.user.id;

  try {
    const { data, error } = await supabase
      .from('reports')
      .insert([{ 
        ngo_id, 
        location, 
        people_helped, 
        resources_used, 
        needs,
        created_at: new Date()
      }]);

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
