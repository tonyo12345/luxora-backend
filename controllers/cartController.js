const pool = require("../config/db");

// Get cart items for a user
const getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    const [items] = await pool.execute(
      `SELECT cart_items.id, product_id, quantity, products.title, products.price, products.image_url
       FROM cart_items
       JOIN products ON cart_items.product_id = products.id
       WHERE user_id = ?`,
      [userId]
    );
    res.json(items);
  } catch (error) {
    console.log(err)
    res.status(500).json({ message: "Error fetching cart", error });
  }
};

// Add an item to the cart
const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { product_id, quantity } = req.body;

  try {
    // Check if item already exists
    const [existing] = await pool.execute(
      "SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?",
      [userId, product_id]
    );

    if (existing.length > 0) {
      // If exists, update quantity
      await pool.execute(
        "UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?",
        [quantity, userId, product_id]
      );
    } else {
      // If not, insert new
      await pool.execute(
        "INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)",
        [userId, product_id, quantity]
      );
    }

    res.status(200).json({ message: "Item added to cart" });
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "Error adding to cart", error });
  }
};

// Update item quantity in cart
const updateCartItem = async (req, res) => {
  const userId = req.user.id;
  const { product_id, quantity } = req.body;

  try {
    await pool.execute(
      "UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?",
      [quantity, userId, product_id]
    );
    res.json({ message: "Cart item updated" });
  } catch (error) {
    res.status(500).json({ message: "Error updating cart item", error });
  }
};

// Remove item from cart
const removeCartItem = async (req, res) => {
  const userId = req.user.id;
  const { product_id } = req.body;

  try {
    await pool.execute(
      "DELETE FROM cart_items WHERE user_id = ? AND product_id = ?",
      [userId, product_id]
    );
    res.json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: "Error removing item", error });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
};
