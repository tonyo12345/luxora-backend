const pool = require("../config/db.js");

// Get user profile
// const getUserProfile = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const [rows] = await pool.execute("SELECT id, name, email, role, created_at FROM users WHERE id = ?", [id]);

//     if (rows.length === 0) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     res.json(rows[0]);
//   } catch (err) {
//     res.status(500).json({ message: "Error fetching user", error: err });
//   }
// };

const getUserProfile = async (req, res) => {
    const { id } = req.params;
  
    try {
      const [rows] = await pool.execute(
        `SELECT 
           u.id AS user_id,
           u.name,
           u.email,
           u.role,
           u.created_at,
           a.id AS address_id,
           a.address_line,
           a.city,
           a.state,
           a.postal_code,
           a.country,
           a.phone_number
         FROM users u
         LEFT JOIN addresses a ON u.id = a.user_id
         WHERE u.id = ?`,
        [id]
      );
  
      if (rows.length === 0) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Format the result to group user info and address together
      const {
        user_id, name, email, role, created_at,
        address_id, address_line, city, state, postal_code, country, phone_number
      } = rows[0];
  
      const userProfile = {
        id: user_id,
        name,
        email,
        role,
        created_at,
        address: address_id
          ? {
              id: address_id,
              address_line,
              city,
              state,
              postal_code,
              country,
              phone_number,
            }
          : null,
      };
  
      res.json(userProfile);
    } catch (err) {
      console.error("Error fetching user profile:", err);
      res.status(500).json({ message: "Error fetching user", error: err });
    }
  };

// Update user info
const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role } = req.body;

  try {
    const [result] = await pool.execute("UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?", [name, email, role, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found or nothing changed" });
    }

    res.json({ message: "User updated successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error updating user", error: err });
  }
};

// Delete user (admin only)
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await pool.execute("DELETE FROM users WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting user", error: err });
  }
};

module.exports = {
  getUserProfile,
  updateUser,
  deleteUser,
};
