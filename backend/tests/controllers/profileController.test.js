import { getProfile, updateProfile, deleteUser } from "../../controllers/profileController.js";
import Profile from "../../models/profileModel.js";
import User from "../../models/userModel.js";

import { jest } from "@jest/globals";

jest.mock("../../models/profileModel.js");
jest.mock("../../models/userModel.js");

// Manually mock Mongoose static methods on the models
Profile.findOne = jest.fn();
Profile.findOneAndUpdate = jest.fn();
Profile.findOneAndDelete = jest.fn();

User.findOneAndDelete = jest.fn();

describe("Profile Controller", () => {
  let req, res;

  beforeEach(() => {
    req = { user: { id: "userId123" }, body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getProfile", () => {
    it("should return profile if found", async () => {
      const mockProfile = { name: "John", bio: "Bio text" };
      Profile.findOne.mockResolvedValue(mockProfile);

      await getProfile(req, res);

      expect(Profile.findOne).toHaveBeenCalledWith({ userId: req.user.id });
      expect(res.json).toHaveBeenCalledWith(mockProfile);
    });

    it("should return 404 if no profile found", async () => {
      Profile.findOne.mockResolvedValue(null);

      await getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Profile not found" });
    });

    it("should return 500 on error", async () => {
      Profile.findOne.mockRejectedValue(new Error("DB error"));

      await getProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ message: "Internal server error" });
    });
  });

  describe("updateProfile", () => {
    it("should update and return updated profile", async () => {
      const updatedProfile = { name: "Jane", bio: "Updated bio" };
      req.body = { name: "Jane", bio: "Updated bio" };
      Profile.findOneAndUpdate.mockResolvedValue(updatedProfile);

      await updateProfile(req, res);

      expect(Profile.findOneAndUpdate).toHaveBeenCalledWith(
        { userId: req.user.id },
        { name: "Jane", bio: "Updated bio" },
        { new: true, runValidators: true }
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: updatedProfile,
      });
    });

    it("should return 404 if profile to update not found", async () => {
      Profile.findOneAndUpdate.mockResolvedValue(null);

      await updateProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Profile not found to be updated",
      });
    });

    it("should return 500 on error", async () => {
      Profile.findOneAndUpdate.mockRejectedValue(new Error("Update error"));

      await updateProfile(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Failed to update profile",
        error: "Update error",
      });
    });
  });

  describe("deleteUser", () => {
    it("should delete profile and user and return success", async () => {
      Profile.findOneAndDelete.mockResolvedValue({});
      User.findOneAndDelete.mockResolvedValue({});

      await deleteUser(req, res);

      expect(Profile.findOneAndDelete).toHaveBeenCalledWith({ userId: req.user.id });
      expect(User.findOneAndDelete).toHaveBeenCalledWith(req.user.id);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ status: "success", message: "Deleted User" });
    });

    it("should return 500 on error", async () => {
      Profile.findOneAndDelete.mockRejectedValue(new Error("Delete error"));

      await deleteUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Failed to delete user",
        error: "Delete error",
      });
    });
  });
});
