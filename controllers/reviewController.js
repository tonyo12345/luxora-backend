const pool = require('../config/db.js');
const jwt = require('jsonwebtoken');

// Create a review
exports.createReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { product_id, rating, comment } = req.body;

    const [result] = await pool.execute(
      'INSERT INTO reviews (product_id, user_id, rating, comment) VALUES (?, ?, ?, ?)',
      [product_id, userId, rating, comment]
    );

    res.status(201).json({ message: 'Review created', reviewId: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all reviews for a product
exports.getReviewsForProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const [reviews] = await pool.execute(
      'SELECT r.*, u.name as user_name FROM reviews r JOIN users u ON r.user_id = u.id WHERE product_id = ?',
      [productId]
    );

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { rating, comment } = req.body;

    const [review] = await pool.execute('SELECT * FROM reviews WHERE id = ?', [id]);
    if (!review.length || review[0].user_id !== userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await pool.execute(
      'UPDATE reviews SET rating = ?, comment = ? WHERE id = ?',
      [rating, comment, id]
    );

    res.json({ message: 'Review updated' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const [review] = await pool.execute('SELECT * FROM reviews WHERE id = ?', [id]);
    if (!review.length || (review[0].user_id !== userId && req.user.role !== 'admin')) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await pool.execute('DELETE FROM reviews WHERE id = ?', [id]);
    res.json({ message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
