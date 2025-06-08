import { jest } from "@jest/globals";
import {
  getAllCheckIn,
  createCheckIn,
} from "../../controllers/checkinController.js";
import CheckIn from "../../models/checkinModel.js";

// Manually mock model methods before tests
beforeEach(() => {
  jest.clearAllMocks();

  // Mock static methods
  CheckIn.find = jest.fn();
  CheckIn.findOne = jest.fn();

  // Mock instance method save on the prototype for new CheckIn()
  CheckIn.prototype.save = jest.fn();
});

describe("CheckIn Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: "user123" },
      query: {},
      body: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("getAllCheckIn", () => {
    it("should return 401 if no user ID", async () => {
      req.user = null;
      await getAllCheckIn(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "User not authenticated",
      });
    });

    it("should return checkins for a user without date filter", async () => {
      const mockCheckIns = [{ mood: "happy", journal: "Good day" }];
      CheckIn.find.mockResolvedValue(mockCheckIns);

      await getAllCheckIn(req, res);

      expect(CheckIn.find).toHaveBeenCalledWith({ userId: "user123" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: mockCheckIns,
      });
    });

    it("should return checkins filtered by date", async () => {
      req.query.date = "2025-06-05";
      const mockCheckIns = [{ mood: "sad", journal: "Bad day" }];
      CheckIn.find.mockResolvedValue(mockCheckIns);

      await getAllCheckIn(req, res);

      expect(CheckIn.find).toHaveBeenCalledWith({
        userId: "user123",
        date: "2025-06-05",
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: mockCheckIns,
      });
    });

    it("should handle errors gracefully", async () => {
      const errorMessage = "DB error";
      CheckIn.find.mockRejectedValue(new Error(errorMessage));

      await getAllCheckIn(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Failed to retrieve CheckIn Data",
          error: errorMessage,
        })
      );
    });
  });

  describe("createCheckIn", () => {
    it("should return 400 if mood or journal missing", async () => {
      req.body = { mood: "happy" }; // journal missing

      await createCheckIn(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "All fields required",
      });
    });

    it("should update existing checkin if found", async () => {
      req.body = { mood: "excited", journal: "Great day", date: "2025-06-05" };
      const mockExisting = {
        mood: "old mood",
        journal: "old journal",
        save: jest.fn().mockResolvedValue({
          mood: "excited",
          journal: "Great day",
          date: "2025-06-05",
        }),
      };

      CheckIn.findOne.mockResolvedValue(mockExisting);

      await createCheckIn(req, res);

      expect(CheckIn.findOne).toHaveBeenCalledWith({
        userId: "user123",
        date: "2025-06-05",
      });
      expect(mockExisting.mood).toBe("excited");
      expect(mockExisting.journal).toBe("Great day");
      expect(mockExisting.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "updated",
        data: expect.objectContaining({
          mood: "excited",
          journal: "Great day",
          date: "2025-06-05",
        }),
      });
    });

    it("should create a new checkin if none exists", async () => {
      req.body = { mood: "joyful", journal: "Lovely day", date: "2025-06-05" };

      CheckIn.findOne.mockResolvedValue(null);

      // Here, new CheckIn() will use the mocked prototype.save from beforeEach
      CheckIn.prototype.save.mockResolvedValue({
        mood: "joyful",
        journal: "Lovely day",
        date: "2025-06-05",
        userId: "user123",
      });

      await createCheckIn(req, res);

      expect(CheckIn.findOne).toHaveBeenCalledWith({
        userId: "user123",
        date: "2025-06-05",
      });
      expect(CheckIn.prototype.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: expect.objectContaining({
          mood: "joyful",
          journal: "Lovely day",
          date: "2025-06-05",
        }),
      });
    });

    it("should handle errors gracefully", async () => {
      req.body = { mood: "joyful", journal: "Lovely day", date: "2025-06-05" };
      CheckIn.findOne.mockRejectedValue(new Error("DB error"));

      await createCheckIn(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Failed to submit CheckIn",
          error: "DB error",
        })
      );
    });
  });
});
