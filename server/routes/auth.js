const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Register
router.post('/register', async (req, res) => {
  const { email, password, name, role, contact } = req.body;

  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;

    // Create profile in profiles table
    const { error: profileError } = await supabase
      .from('profiles')
      .insert([
        { id: data.user.id, name, email, role, contact }
      ]);

    if (profileError) throw profileError;

    res.status(201).json({ message: 'User registered successfully', user: data.user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    // Get profile info
    let { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    // If profile doesn't exist (e.g. manually created user), create a default one
    if (profileError && profileError.code === 'PGRST116') {
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert([
          { id: data.user.id, name: email.split('@')[0], email, role: 'admin', contact: '' }
        ])
        .select()
        .single();
      
      if (createError) throw createError;
      profile = newProfile;
    } else if (profileError) {
      throw profileError;
    }

    res.json({ 
      token: data.session.access_token, 
      user: { ...data.user, profile } 
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
