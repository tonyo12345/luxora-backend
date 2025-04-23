const db = require("../config/db");

// Create a new address
const createAddress = async (req, res) => {
  const user_id = req.user.id;
  const { address_line, city, state, postal_code, country, phone_number } =
    req.body;

  try {
    const [result] = await db.execute(
      `INSERT INTO addresses (user_id, address_line, city, state, postal_code, country, phone_number)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, address_line, city, state, postal_code, country, phone_number]
    );
    res
      .status(201)
      .json({
        message: "Address added successfully",
        addressId: result.insertId,
      });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add address", error: err.message });
  }
};

// Get all addresses for the user
const getUserAddresses = async (req, res) => {
  const user_id = req.user.id;

  try {
    const [addresses] = await db.execute(
      `SELECT * FROM addresses WHERE user_id = ?`,
      [user_id]
    );
    res.json(addresses);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch addresses", error: err.message });
  }
};

// Update an address
const updateAddress = async (req, res) => {
  const addressId = req.params.id;
  const user_id = req.user.id;
  const { address_line, city, state, postal_code, country, phone_number } =
    req.body;

  try {
    const [ExistingAddress] = await db.execute(
      `SELECT * FROM addresses WHERE user_id = ?`,
      [user_id]
    );

    if (ExistingAddress.length > 0) {
      const [result] = await db.execute(
        `UPDATE addresses SET address_line = ?, city = ?, state = ?, postal_code = ?, country = ?, phone_number = ?
         WHERE user_id = ?`,
        [address_line, city, state, postal_code, country, phone_number, user_id]
      );
      if (result.affectedRows === 0)
        return res
          .status(404)
          .json({ message: "Address not found or unauthorized" });

      res.json({ message: "Address updated successfully" });
    } else {
      // If no address exists, create a new one
      const [result] = await db.execute(
        `INSERT INTO addresses (user_id, address_line, city, state, postal_code, country, phone_number)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [user_id, address_line, city, state, postal_code, country, phone_number]
      );

      res
        .status(201)
        .json({
          message: "Address added successfully",
          addressId: result.insertId,
        });
    }
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update address", error: err.message });
  }
};

// Delete an address
const deleteAddress = async (req, res) => {
  const addressId = req.params.id;
  const user_id = req.user.id;

  try {
    const [result] = await db.execute(
      `DELETE FROM addresses WHERE id = ? AND user_id = ?`,
      [addressId, user_id]
    );
    if (result.affectedRows === 0)
      return res
        .status(404)
        .json({ message: "Address not found or unauthorized" });

    res.json({ message: "Address deleted successfully" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to delete address", error: err.message });
  }
};

module.exports = {
  createAddress,
  getUserAddresses,
  updateAddress,
  deleteAddress,
};
