// controllers/orderController.js
const pool = require('../config/db');

// Create an order from user's cart
const createOrder = async (req, res) => {
  const userId = req.user.id;

  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();

    // Get cart items
    const [cartItems] = await conn.execute(
      'SELECT c.product_id, c.quantity, p.price FROM cart_items c JOIN products p ON c.product_id = p.id WHERE c.user_id = ?',
      [userId]
    );

    if (cartItems.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Calculate total price
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

    // Create order
    const [orderResult] = await conn.execute(
      'INSERT INTO orders (user_id, total_price) VALUES (?, ?)',
      [userId, totalPrice]
    );
    const orderId = orderResult.insertId;

    // Add order items
    for (const item of cartItems) {
      await conn.execute(
        'INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) VALUES (?, ?, ?, ?)',
        [orderId, item.product_id, item.quantity, item.price]
      );
    }

    // Clear cart
    await conn.execute('DELETE FROM cart_items WHERE user_id = ?', [userId]);

    await conn.commit();
    res.status(201).json({ message: 'Order created successfully', orderId });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ message: 'Error creating order', error: err.message });
  } finally {
    conn.release();
  }
};

// Update order status (admin only)
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid order status' });
  }

  try {
    await pool.execute('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    res.json({ message: 'Order status updated' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating order status', error: err.message });
  }
};

// Get current user's orders
const getUserOrders = async (req, res) => {
  const userId = req.user.id;
  try {
    const [orders] = await pool.execute('SELECT * FROM orders WHERE user_id = ?', [userId]);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching user orders', error: err.message });
  }
};

// Get all orders (admin only)
const getAllOrders = async (req, res) => {
  try {
    const [orders] = await pool.execute('SELECT * FROM orders');
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching orders', error: err.message });
  }
};

module.exports = { createOrder, updateOrderStatus, getUserOrders, getAllOrders };