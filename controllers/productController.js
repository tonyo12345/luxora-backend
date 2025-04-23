const pool = require("../config/db.js");

//GET all products
const getAllProducts = async (req, res) => {
  try {
    const [products] = await pool.execute("SELECT * FROM products");
    res.json(products);
  } catch (err) {
    return res.status(500).json({ message: "Error fetching products" });
  }
};

//GET single product by ID
const getProductbyID = async (req, res) => {
  const { id } = req.params;

  try {
    const [rows] = await pool.execute("SELECT * FROM products WHERE id = ?", [
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Item not found " });
    }
    res.json(rows[0]);
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
    console.log(err);
  }
};

// Create new product
const createProduct = async (req, res) => {
  const { title, description, price, stock, category_id } = req.body;
  const image_url = req.file ? `/uploads/${req.file.filename}` : null;

  try {
    await pool.execute(
      `INSERT INTO products (title, description, price, stock, category_id, image_url)
         VALUES (?, ?, ?, ?, ?, ?)`,
      [title, description, price, stock, category_id, image_url]
    );

    res.status(201).json({ message: "Product created", image_url });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
};

//update product
const updateProduct = async (req, res) => {
  const { id } = req.params;
  const { title, description, price, stock, category_id } = req.body;

  try {
    let image_url = null;

    // If a new image is uploaded, build its URL
    if (req.file) {
      image_url = `/uploads/${req.file.filename}`; // Publicly accessible path
    } else {
      // If no new image was uploaded, keep the old one
      const [existing] = await pool.execute("SELECT image_url FROM products WHERE id = ?", [id]);
      image_url = existing[0]?.image_url || null;
    }

    await pool.execute(
      `UPDATE products
       SET title = ?, description = ?, price = ?, stock = ?, category_id = ?, image_url = ?
       WHERE id = ?`,
      [title, description, price, stock, category_id, image_url, id]
    );

    res.json({ message: "Product updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};


//delete product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.execute(`DELETE FROM products WHERE id = ?`, [id]);
    res.json({ message: "product deleted" });
  } catch (err) {
    return res.status(500).json({ message: "Server Error" });
    console.log(err);
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  getProductbyID,
  updateProduct,
  deleteProduct,
};
