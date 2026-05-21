const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { getProfile, getTopUsers, uploadProfileImage, getUserPublicProfile } = require('../controllers/users.controller');
const { authMiddleware } = require('../middlewares/auth');

// Configuración de multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../uploads/profile');
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, req.user.userId + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

router.get('/profile', authMiddleware, getProfile);
router.get('/:id/profile', authMiddleware, getUserPublicProfile);
router.post('/profile-image', authMiddleware, upload.single('image'), uploadProfileImage);
router.get('/top', getTopUsers); // Público

module.exports = router;
