const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/verify', authController.verifyWallet);
router.get('/profile', authMiddleware, authController.getProfile);
router.patch('/profile', authMiddleware, authController.updateProfile);

module.exports = router;
