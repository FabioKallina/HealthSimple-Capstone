// friendsController.test.js

import { jest } from "@jest/globals";

import { getAllFriends, searchFriend, addFriend, searchUsers } from "../../controllers/communityControllers/friendsController.js";
import Friends from "../../models/communityModels/friendsModel.js";
import User from "../../models/userModel.js";

jest.mock("../../models/communityModels/friendsModel.js");
jest.mock("../../models/userModel.js");

describe("Friends Controller", () => {
  let req;
  let res;

  beforeEach(() => {
    req = {
      user: { id: "user123" },
      query: {},
      body: {}
    };
  
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  
    // Explicitly mock static methods
    Friends.find = jest.fn();
    Friends.findOne = jest.fn();
    Friends.create = jest.fn();
    
    User.find = jest.fn();
    User.findById = jest.fn();
  
    jest.clearAllMocks();
  });

  describe("getAllFriends", () => {
    it("should return friend list", async () => {
      const mockPopulate = jest.fn().mockResolvedValue([{ name: "Alice" }]);
      Friends.find.mockReturnValue({ populate: mockPopulate });

      await getAllFriends(req, res);

      expect(Friends.find).toHaveBeenCalledWith({ userId: "user123" });
      expect(mockPopulate).toHaveBeenCalledWith("friendId", "name status");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ status: "success", data: [{ name: "Alice" }] });
    });

    it("should handle errors", async () => {
      Friends.find.mockImplementation(() => ({
        populate: jest.fn().mockRejectedValue(new Error("DB fail"))
      }));

      await getAllFriends(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        status: "error", // typo in your controller
        message: "Failed to fetch friends"
      }));
    });
  });

  describe("searchFriend", () => {
    it("should return filtered friends if query given", async () => {
      req.query.search = "Bob";
      Friends.find.mockResolvedValue([{ name: "Bob" }]);

      await searchFriend(req, res);

      expect(Friends.find).toHaveBeenCalledWith({
        userId: "user123",
        name: expect.any(RegExp)
      });

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ status: "success", data: [{ name: "Bob" }] });
    });

    it("should return all friends if no query", async () => {
      Friends.find.mockResolvedValue([{ name: "Alice" }]);

      await searchFriend(req, res);

      expect(Friends.find).toHaveBeenCalledWith({ userId: "user123" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ status: "success", data: [{ name: "Alice" }] });
    });
  });

  describe("addFriend", () => {
    it("should add a friend successfully", async () => {
      req.body.friendId = "friend456";

      User.findById.mockResolvedValue({ _id: "friend456", name: "Charlie", status: "Online" });
      Friends.findOne.mockResolvedValue(null);
      Friends.create.mockResolvedValue({ name: "Charlie" });

      await addFriend(req, res);

      expect(Friends.create).toHaveBeenCalledWith({
        userId: "user123",
        friendId: "friend456",
        status: "Online",
        name: "Charlie"
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ status: "success", data: { name: "Charlie" } });
    });

    it("should return 404 if user not found", async () => {
      req.body.friendId = "badId";
      User.findById.mockResolvedValue(null);

      await addFriend(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ status: "error", message: "User not found" });
    });

    it("should return 400 if already friends", async () => {
      req.body.friendId = "friend456";
      User.findById.mockResolvedValue({ _id: "friend456", name: "Charlie" });
      Friends.findOne.mockResolvedValue({ _id: "existing" });

      await addFriend(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ status: "error", message: "Already friends" });
    });

    it("should return 400 if friendId is missing", async () => {
      req.body.friendId = undefined;

      await addFriend(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ status: "error", message: "friendId is required" });
    });

    it("should handle server error", async () => {
      req.body.friendId = "friend456";
      User.findById.mockRejectedValue(new Error("Unexpected"));

      await addFriend(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        status: "error",
        message: "Failed to add friend"
      }));
    });
  });

  describe("searchUsers", () => {
    it("should return matched users", async () => {
      req.query.q = "Jane";
      User.find.mockResolvedValue([{ name: "Jane", _id: "id123" }]);

      await searchUsers(req, res);

      expect(User.find).toHaveBeenCalledWith(expect.objectContaining({
        name: expect.any(RegExp)
      }));

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: [{ name: "Jane", _id: "id123" }]
      });
    });

    it("should handle error", async () => {
      req.query.q = "Error";
      User.find.mockRejectedValue(new Error("DB fail"));

      await searchUsers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
        status: "error",
        message: "Failed to search users"
      }));
    });
  });
});
