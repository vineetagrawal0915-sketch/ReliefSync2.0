const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticateToken } = require('../middleware/auth');

// Get all resources
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('*, profiles(name)');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add/Update resource (NGO only)
router.post('/', authenticateToken, async (req, res) => {
  const { name, type, quantity, location } = req.body;
  const ngo_id = req.user.id;

  try {
    const { data, error } = await supabase
      .from('resources')
      .upsert([{ 
        ngo_id, 
        name, 
        type, 
        quantity, 
        location,
        updated_at: new Date()
      }], { onConflict: 'ngo_id, name' }); // Assumes unique resource name per NGO

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
