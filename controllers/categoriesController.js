const pool = require("../config/db");

// Create a new category
const createCategory = async (req, res) => {
  const { name, slug } = req.body;

  if (!name || !slug) {
    return res.status(400).json({ message: "Name and slug are required" });
  }

  try {
    const [result] = await pool.execute(
      "INSERT INTO categories (name, slug) VALUES (?, ?)",
      [name, slug]
    );
    res.status(201).json({ message: "Category created", id: result.insertId });
  } catch (err) {
    res.status(500).json({ message: "Error creating category", error: err });
  }
};

// Get all categories
const getCategories = async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT * FROM categories");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ message: "Error fetching categories", error: err });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, slug } = req.body;

  try {
    const [result] = await pool.execute(
      "UPDATE categories SET name = ?, slug = ? WHERE id = ?",
      [name, slug, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category updated" });
  } catch (err) {
    res.status(500).json({ message: "Error updating category", error: err });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.execute("DELETE FROM categories WHERE id = ?", [
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting category", error: err });
  }
};

module.exports = {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
};
