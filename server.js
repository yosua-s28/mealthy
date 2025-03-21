require("dotenv").config();
const express = require("express");
const cors = require("cors");
const pool = require("./db"); // Ensure db.js exists
const app = express();
const PORT = process.env.PORT || 5000;
const bcrypt = require('bcrypt');
const models = require('./models');
const nodemailer = require('nodemailer');
const Nutrition = models.Nutrition;
const User = models.User;
const UserNutrition = models.UserNutrition;
const crypto = require('crypto');
const sequelize = require('./db');
const {NGROK_URL} = process.env;

// Middleware
app.use(cors());
app.use(express.json());

// Get all users from the database
app.get("/users", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM users");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message); // biar keliatan di console errornya apa
    next(err); // pass errors to the global error handler
  }
});

// Insert a new user into the database
app.post("/users", async (req, res, next) => {
  const { email, password, first_name, last_name } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO users (email, password, first_name, last_name) VALUES ($1, $2, $3, $4) RETURNING *",
      [email, password, first_name, last_name]
    );
    res.json(result.rows[0]); // return the inserted user
  } catch (err) {
    console.error(err.message); // biar keliatan di console errornya apa
    next(err); // pass errors to the global error handler
  }
});

// Login endpoint
app.post("/api/login", async (req, res, next) => {
  const { email, password } = req.body;

  // Check for special case where email is administrator
  if (email === "administrator@gmail.com" && password === "1adMinmeaLthy1") {
    return res.json({
      user_id: 1,  // You can assign any unique ID for the admin
      email: email,
      first_name: 'Admin',
      last_name: 'User',
      profile_picture: null, // Or a default admin image
      isAdmin: true,  // Add a flag to indicate admin access
    });
  }

  try {
    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = result.rows[0];
    // Replace with proper password hashing and comparison
    if (password !== user.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({
      user_id: user.user_id,
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      profile_picture: user.profile_picture,
      isAdmin: false, // Regular user, not admin
    });
  } catch (err) {
    console.error(err.message);
    next(err);
  }
});


// Guest user endpoint
app.get("/api/guest", async (req, res, next) => {
  try {
      const result = await pool.query("SELECT * FROM users WHERE user_id = 0"); // Assuming guest user has user_id 0
      if (result.rows.length === 0) {
          return res.status(404).json({ message: "Guest user not found" });
      }
      const guestUser = result.rows[0];
      res.json({
          user_id: guestUser.user_id,
          email: guestUser.email,
          first_name: guestUser.first_name,
          last_name: guestUser.last_name,
          profile_picture: guestUser.profile_picture,
      });
  } catch (err) {
      console.error(err.message);
      next(err);
  }
});

// Registration endpoint
app.post("/api/register", async (req, res, next) => {
  const { name, email, username, password, dob, foodallergies, gender } = req.body;
  try {
      // Insert the new user into the database
      const result = await pool.query(
          "INSERT INTO users (username, password, name, email, foodallergies, dob, gender) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING user_id, email",
          [username, password, name, email, foodallergies, dob, gender]
      );

      // If no rows are returned, respond with an error
      if (result.rows.length === 0) {
          return res.status(400).json({ message: "Registration failed. Please try again." });
      }

      // Send the user_id in the response
      const newUser = result.rows[0];
      res.json({
          user_id: newUser.user_id,
          message: "Registration successful"
      });

  } catch (err) {
      console.error(err.message);
      res.status(500).json({ message: "Internal server error." });
      next(err);
  }
});


app.post('/users/update', (req, res) => {
  const { userId, name, email, username, dob, foodAllergies, gender } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  // Update the user profile
  if (users[userId]) {
    users[userId] = { name, email, username, dob, foodAllergies, gender };
    res.json({ message: "Profile updated successfully", data: users[userId] });
  } else {
    res.status(404).json({ message: "User not found" });
  }
});

// Backend route for fetching user profile by userId
app.get('/users/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM users WHERE user_id = $1', [user_id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(result.rows[0]);  // Send the user data as a response
  } catch (err) {
    console.error('Error fetching user:', err);
    res.status(500).json({ message: 'Failed to fetch user data' });
  }
});

// Get all foods from the database
app.get("/api/foods", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM foods ORDER BY name ASC"); // Order by name for easier searching
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
});

// Get a single food by NAME
app.get("/api/foods/name/:name", async (req, res, next) => {
  try {
    const { name } = req.params;
    const result = await pool.query("SELECT * FROM foods WHERE name = $1", [name]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Food not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
});

// Add a new route to handle adding a calorie log entry
app.post("/api/calorie_log", async (req, res, next) => {
  const { user_id, food_id, serving_size, log_date } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO calorie_log (user_id, food_id, serving_size, log_date) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, food_id, serving_size, log_date]
    );
    res.json(result.rows[0]); // return the added calorie log entry
  } catch (err) {
    console.error("Error adding calorie log entry:", err.message);
    next(err); // pass errors to the global error handler
  }
});

// Get calorie log entries for a specific user
app.get("/api/calorie_log", async (req, res, next) => {
  const { user_id } = req.query;
  try {
    const result = await pool.query(
      "SELECT * FROM calorie_log WHERE user_id = $1 ORDER BY log_date DESC", // Order by date, newest first
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching calorie log entries:", err.message);
    next(err);
  }
});

// Add a new route to handle adding a meal to the meal planner
app.post("/meal_planner", async (req, res, next) => {
  const { user_id, food_id, recipe_id, meal_time, meal_date } = req.body;

  // If both food_id and recipe_id are provided, we can prioritize the recipe_id (just for simplicity)
  if (food_id && recipe_id) {
    return res.status(400).send("Please provide either a food_id or a recipe_id, not both.");
  }

  try {
    // Check if an entry already exists for the given date and meal time
    const existingEntry = await pool.query(
      "SELECT * FROM meal_planner WHERE user_id = $1 AND meal_time = $2 AND meal_date = $3",
      [user_id, meal_time, meal_date]
    );

    if (existingEntry.rows.length > 0) {
      return res.status(400).send("A meal is already planned for this date and time.");
    }

    if (food_id) {
      // Add individual food to the meal planner
      const result = await pool.query(
        "INSERT INTO meal_planner (user_id, food_id, meal_time, meal_date) VALUES ($1, $2, $3, $4) RETURNING *",
        [user_id, food_id, meal_time, meal_date]
      );
      res.json(result.rows[0]); // return the added food meal planner entry
    } else if (recipe_id) {
      // Add entire recipe to the meal planner
      const result = await pool.query(
        "INSERT INTO meal_planner (user_id, recipe_id, meal_time, meal_date) VALUES ($1, $2, $3, $4) RETURNING *",
        [user_id, recipe_id, meal_time, meal_date]
      );
      res.json(result.rows[0]); // return the added recipe meal planner entry
    } else {
      res.status(400).send("Please provide either a food_id or a recipe_id.");
    }
  } catch (err) {
    console.error(err.message); // biar keliatan di console errornya apa
    next(err); // pass errors to the global error handler
  }
});

// Add a new route to fetch meal plans based on the selected date
app.get("/meal_planner", async (req, res, next) => {
  const { user_id, meal_date } = req.query;
  console.log("Fetching meal plans for user:", user_id, "on date:", meal_date); // Add this line for debugging
  try {
    const result = await pool.query(
      `SELECT mp.*, r.image_url, r.title
       FROM meal_planner mp
       LEFT JOIN recipes r ON mp.recipe_id = r.recipe_id
       WHERE mp.user_id = $1 AND mp.meal_date = $2`,
      [user_id, meal_date]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching meal plans:", err.message);
    next(err);
  }
});

// **Post Comments**: Add a comment to a post
app.post("/post_comments", async (req, res, next) => {
  const { user_id, post_id, comment_text } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO post_comments (user_id, post_id, comment_text) VALUES ($1, $2, $3) RETURNING *",
      [user_id, post_id, comment_text]
    );
    res.json(result.rows[0]); // return the added comment
  } catch (err) {
    console.error(err.message); // biar keliatan di console errornya apa
    next(err); // pass errors to the global error handler
  }
});

// **Post Likes**: Add a like to a post
app.post("/post_likes", async (req, res, next) => {
  const { user_id, post_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO post_likes (user_id, post_id) VALUES ($1, $2) RETURNING *",
      [user_id, post_id]
    );
    res.json(result.rows[0]); // return the added like
  } catch (err) {
    console.error(err.message); // biar keliatan di console errornya apa
    next(err); // pass errors to the global error handler
  }
});

// **Community Posts**: Add a new post
app.post("/community_posts", async (req, res, next) => {
  const { user_id, title, description, image_url } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO community_posts (user_id, title, description, image_url) VALUES ($1, $2, $3, $4) RETURNING *",
      [user_id, title, description, image_url]
    );
    res.json(result.rows[0]); // return the added post
  } catch (err) {
    console.error(err.message); // biar keliatan di console errornya apa
    next(err); // pass errors to the global error handler
  }
});


// for recipes
app.get("/api/recipes", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM recipes ORDER by recipe_id ASC;");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message); // biar keliatan di console errornya apa
    next(err);
  }
});

app.get("/api/recipes/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM recipes WHERE recipe_id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
});

app.get('/recipes', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM recipes');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching recipes');
  }
});

// POST (create) a new recipe
app.post('/api/Recipes', async (req, res) => {
  try {
    let { title, ingredients, instructions, calories, protein, fat, carbs, image } = req.body;

    if (!title || !ingredients || !instructions || !calories || !protein || !fat || !carbs || !image) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (
      typeof calories !== 'number' ||
      typeof protein !== 'number' ||
      typeof fat !== 'number' ||
      typeof carbs !== 'number'
    ) {
      return res.status(400).json({ error: 'Calories, protein, fat, and carbs must be numbers' });
    }

    // Sanitize input
    title = escapeHtml(title.trim());
    ingredients = escapeHtml(ingredients.trim());
    instructions = escapeHtml(instructions.trim());
    image = escapeHtml(image.trim());

    const { rows } = await pool.query(
      'INSERT INTO "Recipes" (title, ingredients, instructions, calories, protein, fat, carbs, image_url) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [title, ingredients, instructions, calories, protein, fat, carbs, image]
    );

    res.status(201).json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
});

// Backend route to update user profile
app.put('/users/:user_id', async (req, res) => {
  const { user_id } = req.params;
  const { name, email, username, dob, foodallergies, profileImage, gender } = req.body;

  try {
    // Update the user profile in the database
    const result = await pool.query(
      `UPDATE users SET name = $1, email = $2, username = $3, dob = $4, foodallergies = $5, profileImage = $6, gender = $7 WHERE user_id = $8 RETURNING *`,
      [name, email, username, dob, foodallergies, profileImage, gender, user_id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'Profile updated successfully', user: result.rows[0] });
  } catch (err) {
    console.error('Error updating user profile:', err);
    res.status(500).json({ message: 'Failed to update profile' });
  }
});



// PUT (update) an existing recipe
app.put('/api/Recipes/:id', async (req, res) => {
  try {
    let { id } = req.params; //id jangan di escape
    let { title, ingredients, instructions, calories, protein, fat, carbs, image } = req.body;

    if (!title || !ingredients || !instructions || !calories || !protein || !fat || !carbs || !image) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    if (
      typeof calories !== 'number' ||
      typeof protein !== 'number' ||
      typeof fat !== 'number' ||
      typeof carbs !== 'number'
    ) {
      return res.status(400).json({ error: 'Calories, protein, fat, and carbs must be numbers' });
    }
      // Sanitize input
    title = escapeHtml(title.trim());
    ingredients = escapeHtml(ingredients.trim());
    instructions = escapeHtml(instructions.trim());
    image = escapeHtml(image.trim());


    const { rows } = await pool.query(
      'UPDATE "Recipes" SET title = $1, ingredients = $2, instructions = $3, calories = $4, protein = $5, fat = $6, carbs = $7, image = $8 WHERE id = $9 RETURNING *',
      [title, ingredients, instructions, calories, protein, fat, carbs, image, id]
    );

    if (rows.length === 0) {
      res.status(404).json({ error: 'Recipe not found' });
    } else {
      res.json(rows[0]);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
});

// Delete a recipe
app.delete('/recipes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM recipes WHERE recipe_id = $1', [id]);
    res.status(200).send('Recipe deleted');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error deleting recipe');
  }
});


// Add a new route to check if a recipe is bookmarked
app.get("/favorite_recipes/check", async (req, res, next) => {
  const { user_id, recipe_id } = req.query;
  try {
    const result = await pool.query(
      "SELECT * FROM favorite_recipes WHERE user_id = $1 AND recipe_id = $2",
      [user_id, recipe_id]
    );
    res.json({ isBookmarked: result.rows.length > 0 });
  } catch (err) {
    console.error("Error checking bookmark:", err.message);
    next(err);
  }
});

// Add a new route to handle bookmarking a recipe
app.post("/favorite_recipes", async (req, res, next) => {
  const { user_id, recipe_id } = req.body;
  try {
    const result = await pool.query(
      "INSERT INTO favorite_recipes (user_id, recipe_id) VALUES ($1, $2) RETURNING *",
      [user_id, recipe_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error bookmarking recipe:", err.message);
    next(err);
  }
});

// Add a new route to fetch bookmarked recipes
app.get("/favorite_recipes", async (req, res, next) => {
  const { user_id } = req.query;
  console.log("Fetching bookmarked recipes for user:", user_id); // Add this line
  try {
    const result = await pool.query(
      "SELECT recipes.* FROM favorite_recipes JOIN recipes ON favorite_recipes.recipe_id = recipes.recipe_id WHERE favorite_recipes.user_id = $1",
      [user_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Error fetching bookmarked recipes:", err.message);
    next(err);
  }
});

// Add a new route to delete a bookmarked recipe
app.delete("/favorite_recipes", async (req, res, next) => {
  const { user_id, recipe_id } = req.body;
  try {
    const result = await pool.query(
      "DELETE FROM favorite_recipes WHERE user_id = $1 AND recipe_id = $2",
      [user_id, recipe_id]
    );
    res.json({ success: result.rowCount > 0 });
  } catch (err) {
    console.error("Error deleting bookmark:", err.message);
    next(err);
  }
});

// Get a specific nutrition record by ID
app.get("/api/nutritions", async (req, res, next) => {
  try {
    const result = await pool.query("SELECT * FROM nutritions ORDER BY id ASC;");
    // Parse the 'list' field into an array
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
});

app.get("/api/nutritions/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM nutritions WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    next(err);
  }
});

app.get('/nutritions', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM nutritions');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching nutritions');
  }
});

app.post('/addnutrition', async (req, res) => {
  const { title, description, imageUrl, list, tip } = req.body;
  
  try {
    const result = await pool.query(
      'INSERT INTO nutritions (title, description, image, list, tip, createdat, updatedat) VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) RETURNING *',
      [title, description, imageUrl, list, tip]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error adding nutrition');
  }
});

// DELETE nutrition item
app.delete('/nutritions/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM nutritions WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Nutrition not found' });
    }
    res.json({ message: 'Nutrition deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});

app.post('/addRecipe', async (req, res) => {
  const { title, category, author, filter, imageUrl, ingredients, instructions, calories, fat, protein, carbs, time } = req.body;

  const query = `
    INSERT INTO recipes (title, category, author, filters, image_url, ingredients, instructions, calories, fat, protein, carbs, time)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
    RETURNING recipe_id;
  `;

  try {
    const result = await pool.query(query, [
      title, category, author, filter, imageUrl, ingredients, instructions, calories, fat, protein, carbs, time
    ]);

    res.status(201).json({
      message: 'Recipe added successfully!',
      recipe_id: result.rows[0].recipe_id,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error adding recipe' });
  }
});



// POST route to add nutrition
app.post('/addnutrition', async (req, res) => {
  const { title, category, imageUrl, list, tip } = req.body;

  try {
    // Insert nutrition data into the database
    const result = await pool.query(
      'INSERT INTO nutrition (title, category, image, list, tip) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [title, category, imageUrl, list, tip]
    );
    
    // Return the inserted record as JSON response
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error adding nutrition:', error);
    res.status(500).send('Error adding nutrition');
  }
});

// Get all reports
app.get('/reports', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM reports');
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Get specific report details by ID
// Endpoint to get report details by report ID
app.get('/reports/:id', async (req, res) => {
  const reportId = req.params.id;

  try {
    // Fetch the report and its associated post details
    const result = await pool.query(`
      SELECT reports.id, reports.reporteduserid, reports.reason, reports.status, community_posts.title, community_posts.text, community_posts.image_url
      FROM reports
      JOIN community_posts ON reports.postid = community_posts.post_id
      WHERE reports.id = $1
    `, [reportId]);

    if (result.rows.length > 0) {
      res.json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Report not found' });
    }
  } catch (err) {
    console.error('Error fetching report details:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update report status (Mark as Invalid, Resolved, etc.)
app.put('/reports/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const updatedAt = new Date();
  try {
    await pool.query('UPDATE public.reports SET status = $1, updatedat = $2 WHERE id = $3', [status, updatedAt, id]);
    res.status(200).send('Report updated');
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

// Delete a report (resolved post)
app.delete('/reports/:id', async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect(); // Use a client from the pool to handle the transaction
  
  try {
    // Start a transaction
    await client.query('BEGIN');

    // Delete the report
    await client.query('DELETE FROM public.reports WHERE id = $1', [id]);

    // Delete the associated post
    await client.query('DELETE FROM public.community_posts WHERE post_id = $1', [id]);

    // Commit the transaction
    await client.query('COMMIT');

    res.status(200).send('Report and associated post deleted');
  } catch (error) {
    // Rollback the transaction in case of error
    await client.query('ROLLBACK');
    console.error(error);
    res.status(500).send('Server Error');
  } finally {
    // Release the client back to the pool
    client.release();
  }
});

// untuk allergens detection
app.get('/allergies', async (req, res) => {
  try {
      const result = await pool.query('SELECT allergy_id, name FROM allergies');
      res.json(result.rows);
  } catch (err) {
      console.error('Error fetching allergies:', err);
      res.status(500).json({ error: 'Failed to fetch allergies' });
  }
});

// cek alergi berdasarkan user
app.get('/user_allergies/:user_id', async (req, res) => {
  const { user_id } = req.params;
  try {
      const result = await pool.query(
          'SELECT a.allergy_id, a.name FROM user_allergies ua JOIN allergies a ON ua.allergy_id = a.allergy_id WHERE ua.user_id = $1',
          [user_id]
      );
      res.json(result.rows);
  } catch (err) {
      console.error('Error fetching user allergies:', err);
      res.status(500).json({ error: 'Failed to fetch user allergies' });
  }
});

// Endpoint to update allergens by allergy_id
app.put('/allergies/:id', async (req, res) => {
  const { id } = req.params;
  const { name } = req.body; // An array of allergens (e.g. ['shrimp', 'shellfish'])

  try {
    // Update the allergens in the database
    const result = await pool.query(
      'UPDATE allergies SET name = $1 WHERE allergy_id = $2 RETURNING *',
      [name, id]
    );

    if (result.rows.length > 0) {
      res.status(200).json(result.rows[0]);
    } else {
      res.status(404).json({ message: 'Allergy not found' });
    }
  } catch (err) {
    console.error('Error updating allergy data', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Nodemailer setup (configure your email service)
const transporter = nodemailer.createTransport({
  // service: 'gmail',  // Replace with your email service
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
      user: process.env.EMAIL_USER, // Your email address
      pass: process.env.EMAIL_APP_PASSWORD  // Your email password or app-specific password
  },
  // tls:{
  //   rejectUnauthorized: false
  // }
});

// Function to generate a random verification code
function generateVerificationCode() {
  return crypto.randomBytes(3).toString('hex').toUpperCase(); // 6-character alphanumeric code
}


// Forgot Password Endpoint
app.post("/api/forgot-password", async (req, res, next) => {
  const { email } = req.body;
  try {
      // 1. Check if the email exists in the database
      const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

      if (userResult.rows.length === 0) {
          return res.status(404).json({ message: "Email not found." });
      }

      const user = userResult.rows[0];

      // 2. Generate a verification code
      const verificationCode = generateVerificationCode();

      // 3. Hash the verification code before storing it in the database
      const hashedVerificationCode = await bcrypt.hash(verificationCode, 10);

      // 4. Store the verification code in the database (and invalidate any previous codes)
      await pool.query(
          "UPDATE users SET reset_token = $1, reset_token_expiry = NOW() + INTERVAL '1 hour' WHERE email = $2",
          [hashedVerificationCode, email]
      );

      // 5. Send the verification code to the user's email
      const mailOptions = {
          from: process.env.EMAIL_USER, // Your email address
          to: user.email,
          subject: 'Password Reset Verification Code',
          html: `<p>Your verification code is: <b>${verificationCode}</b>. This code will expire in 1 hour.</p>`  // Use HTML for better formatting
      };
      console.log(process.env.EMAIL_USER, process.env.EMAIL_APP_PASSWORD)
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error("Error sending email:", error);
            return res.status(500).json({ message: "Failed to send verification email.  Error: " + error.message, error: error }); // TEMPORARY CHANGE
        } else {
            console.log('Email sent: ' + info.response);
            return res.json({ message: "Verification code sent to your email." });
        }
      });
  } catch (err) {
      // ga lewat
      console.error(err.message);
      next(err);
  }
});

// Reset Password Endpoint
app.post("/api/reset-password", async (req, res, next) => {
  const { email, verificationCode, newPassword } = req.body;

  try {
      // 1. Retrieve the user from the database
      const userResult = await pool.query("SELECT * FROM users WHERE email = $1", [email]);

      if (userResult.rows.length === 0) {
          return res.status(404).json({ message: "Email not found." });
      }

      const user = userResult.rows[0];

      // 2. Verify the verification code
      const hashedVerificationCode = user.reset_token;

      if (!hashedVerificationCode) {
          return res.status(400).json({ message: "Invalid verification code." });
      }

      const codeMatch = await bcrypt.compare(verificationCode, hashedVerificationCode);

      if (!codeMatch) {
          return res.status(400).json({ message: "Invalid verification code." });
      }

      // 3. Check if the verification code has expired
      const expirationTime = new Date(user.reset_token_expiry);
      if (expirationTime < new Date()) {
          return res.status(400).json({ message: "Verification code has expired." });
      }


      // 5. Update the user's password in the database
      await pool.query(
          "UPDATE users SET password = $1, reset_token = NULL, reset_token_expiry = NULL WHERE email = $2",
          [newPassword, email]
      );

      res.json({ message: "Password reset successful." });
  } catch (err) {
      console.error(err.message);
      next(err);
  }
});

// ini refers ke page kalo mau cek website up ato nggak pas masuk ke ngrok_url
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Global error handler (before app.listen)
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).send("Something went wrong!");
});

app.use(cors({ origin: '*' })); // Allow all origins for development

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

