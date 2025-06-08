
import express from "express";
import { 
    searchFriend,
    getAllFriends,
    addFriend,
    searchUsers,
    getFriendProfile
} from "../../controllers/communityControllers/friendsController.js";

import { authenticateToken } from "../../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", authenticateToken, getAllFriends);
router.get("/", authenticateToken, searchFriend);
//Search user route
router.get("/search", authenticateToken, searchUsers);
router.post("/", authenticateToken, addFriend);

router.get("/:friendId", authenticateToken, getFriendProfile);

export default router;