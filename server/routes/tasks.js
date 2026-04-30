const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const { authenticateToken, authorizeRoles } = require('../middleware/auth');

// Get all tasks
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('tasks')
      .select('*, profiles(name)');

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create task (Admin only)
router.post('/', authenticateToken, authorizeRoles('admin'), async (req, res) => {
  const { title, description, location, latitude, longitude, type, priority } = req.body;

  try {
    const { data, error } = await supabase
      .from('tasks')
      .insert([{ 
        title, 
        description, 
        location, 
        latitude, 
        longitude, 
        type, 
        priority,
        status: 'pending'
      }]);

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Claim task (NGO only)
router.put('/:id/claim', authenticateToken, authorizeRoles('ngo'), async (req, res) => {
  const { id } = req.params;
  const ngo_id = req.user.id;

  try {
    // Check if already claimed
    const { data: existingTask } = await supabase
      .from('tasks')
      .select('assigned_ngo_id')
      .eq('id', id)
      .single();

    if (existingTask.assigned_ngo_id) {
      return res.status(400).json({ error: 'Task already claimed by another NGO' });
    }

    const { data, error } = await supabase
      .from('tasks')
      .update({ assigned_ngo_id: ngo_id, status: 'in_progress' })
      .eq('id', id);

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update task status
router.put('/:id/status', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const { data, error } = await supabase
      .from('tasks')
      .update({ status })
      .eq('id', id)
      .eq('assigned_ngo_id', req.user.id); // Only assigned NGO can update

    if (error) throw error;
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
