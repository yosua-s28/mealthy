// controllers/userController.js
const pool = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const moment = require('moment');
const fs = require('fs').promises; // Gunakan fs.promises
const path = require('path');

const updateUser = async (req, res) => {
    const { userId } = req.params;
    const { username, name, email, foodallergies, dob, profileImage } = req.body; // Ambil profileImage dari req.body

    console.log('Fungsi updateUser dipanggil dengan userId:', userId);
    console.log('Data yang diterima dari front-end (req.body):', req.body);
    // console.log('Informasi file yang diupload (req.file):', req.file); // Hapus ini

    try {
        const existingUserResult = await pool.query('SELECT profileImage FROM Users WHERE id = $1', [userId]);
        const existingUser = existingUserResult.rows[0];

        let query, values;
        let newProfileImageName = null; // Untuk menyimpan nama file baru

        if (profileImage) {
            // 1. Decode base64 string
            const matches = profileImage.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
            if (!matches || matches.length !== 3) {
                return res.status(400).json({ message: 'Invalid image data.' });
            }
            const imageType = matches[1];
            const base64Data = matches[2];
            const buffer = Buffer.from(base64Data, 'base64');

            // 2. Buat nama file yang unik
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const ext = imageType.split('/')[1];  // 'jpeg', 'png', dll.
            newProfileImageName = `profileImage-${uniqueSuffix}.${ext}`; // Nama file baru

            // 3. Simpan file ke disk
            const filepath = path.join(__dirname, '../public/images', newProfileImageName);
            await fs.writeFile(filepath, buffer); // Gunakan fs.promises.writeFile

            // 4. Hapus gambar lama (jika ada)
            if (existingUser && existingUser.profileImage) {
                const oldImagePath = path.join(__dirname, '../public/images', existingUser.profileImage);
                try {
                    fs.unlinkSync(oldImagePath); // Hapus sinkron
                    console.log("Gambar lama berhasil dihapus.");
                } catch (unlinkError) {
                    console.error("Gagal menghapus gambar lama:", unlinkError);
                }
            }
          query = `
                UPDATE Users
                SET username = $1, name = $2, email = $3, foodAllergies = $4, dob = $5, profileImage = $6
                WHERE id = $7
                RETURNING id, username, name, email, foodallergies, dob, profileImage;
            `;
            values = [username, name, email, foodallergies, dob, newProfileImageName, userId]; // Simpan nama file, bukan base64 string
        } else {
            // Tidak ada gambar baru
            query = `
                UPDATE Users
                SET username = $1, name = $2, email = $3, foodAllergies = $4, dob = $5
                WHERE id = $6
                RETURNING id, username, name, email, foodallergies, dob, profileImage;
            `;
            values = [username, name, email, foodallergies, dob, userId];
        }

        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User tidak ditemukan.' });
        }

        const updatedUser = result.rows[0];
        res.json({ message: 'Profil berhasil diupdate!', user: updatedUser });
    } catch (error) {
        console.error("Error saat update profil:", error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengupdate profil.', error: error.message });
    }
};

// ... (Fungsi lain tidak berubah) ...
const registerUser = async (req, res) => {
    try {
      const { username, password, name, email, foodallergies, dob } = req.body;
  
      // Validasi data
      if (!username || !password || !name || !email) {
        return res.status(400).json({ message: 'Semua field harus diisi.' });
      }
  
      // Enkripsi password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Simpan user ke database
      const query = `
        INSERT INTO Users (username, password, name, email, foodallergies, dob)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id, username, name, email, foodallergies, dob;
      `;
      const values = [username, hashedPassword, name, email, foodallergies, dob];
      const result = await pool.query(query, values);
  
      const user = result.rows[0];
      res.status(201).json({ message: 'User berhasil terdaftar!', user });
  
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Terjadi kesalahan saat mendaftarkan user.' });
    }
  };
  
  // Fungsi untuk mendapatkan semua user
  const getAllUsers = async (req, res) => {
    try {
      const result = await pool.query('select user_id, username, name, email, foodallergies, dob, profileImage FROM Users');
      res.json(result.rows);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Terjadi kesalahan saat mengambil daftar user.' });
    }
  };
  
    const getUserById = async (req, res) => {
    const { userId } = req.params;
    console.log('Menerima permintaan GET untuk user ID:', userId);

    if (isNaN(userId)) {
        console.error('userId bukan angka yang valid:', userId);
        return res.status(400).json({ message: 'User ID tidak valid.' });
    }

    try {
        const query = 'select user_id, username, name, email, foodallergies, dob, profileImage FROM Users WHERE id = $1';
        const result = await pool.query(query, [parseInt(userId, 10)]);

        console.log('Hasil query:', result.rows);

        if (result.rows.length === 0) {
        return res.status(404).json({ message: 'User tidak ditemukan.' });
        }
        
        const user = result.rows[0];
        const formattedDob = moment(user.dob).format('YYYY-MM-DD');
        const userWithFormattedDob = { ...user, dob: formattedDob };
        res.json(userWithFormattedDob);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan saat mengambil data user.' });
    }
    };

  // Fungsi untuk menghapus user
  const deleteUser = async (req, res) => {
    const { userId } = req.params;
    try {
      const query = 'DELETE FROM Users WHERE id = $1 RETURNING id';
      const result = await pool.query(query, [userId]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ message: 'User tidak ditemukan.' });
      }
  
      res.json({ message: 'User berhasil dihapus!', id: result.rows[0].id });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Terjadi kesalahan saat menghapus user.' });
    }
  };

module.exports = {
  registerUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
};