
import { jest } from "@jest/globals";
import Habit from "../../models/habitsModel.js";
import {
  getHabits,
  createHabit,
  deleteHabit,
  updateHabit,
} from "../../controllers/habitsController.js";

// Mock Mongoose methods before each test
beforeEach(() => {
  jest.clearAllMocks();

  Habit.find = jest.fn();
  Habit.create = jest.fn();
  Habit.findByIdAndDelete = jest.fn();
  Habit.findById = jest.fn();

  Habit.prototype.save = jest.fn();
});

describe("Habit Controller", () => {
  let req, res;

  beforeEach(() => {
    req = {
      user: { id: "user123" },
      body: {},
      params: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe("getHabits", () => {
    it("should return habits for a user", async () => {
      const mockHabits = [{ name: "Exercise" }, { name: "Meditate" }];
      Habit.find.mockResolvedValue(mockHabits);

      await getHabits(req, res);

      expect(Habit.find).toHaveBeenCalledWith({ userId: "user123" });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: mockHabits,
      });
    });

    it("should handle errors", async () => {
      Habit.find.mockRejectedValue(new Error("DB failure"));

      await getHabits(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Failed to get all habits",
          error: "DB failure",
        })
      );
    });
  });

  describe("createHabit", () => {
    it("should create and return new habit", async () => {
      req.body = { name: "Read" };
      const mockHabit = { name: "Read", userId: "user123" };
      Habit.create.mockResolvedValue(mockHabit);

      await createHabit(req, res);

      expect(Habit.create).toHaveBeenCalledWith({ userId: "user123", name: "Read" });
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Habit created!",
        data: mockHabit,
      });
    });

    it("should handle errors", async () => {
      req.body = { name: "Read" };
      Habit.create.mockRejectedValue(new Error("DB create error"));

      await createHabit(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Failed creating habit",
          error: "DB create error",
        })
      );
    });
  });

  describe("deleteHabit", () => {
    it("should delete habit by id", async () => {
      req.params = { habitId: "habit123" };
      Habit.findByIdAndDelete.mockResolvedValue(true);

      await deleteHabit(req, res);

      expect(Habit.findByIdAndDelete).toHaveBeenCalledWith("habit123");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "habit deleted!",
      });
    });

    it("should handle errors", async () => {
      req.params = { habitId: "habit123" };
      Habit.findByIdAndDelete.mockRejectedValue(new Error("Delete error"));

      await deleteHabit(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "success", // as per your controller, although maybe you want to fix this to "error"
          message: "Failed to delete habit",
          error: "Delete error",
        })
      );
    });
  });

  describe("updateHabit", () => {
    it("should update existing log if found", async () => {
      req.params = { habitId: "habit123" };
      req.body = { status: "completed" };

      const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0];

      const mockHabit = {
        logs: [{ date: today, status: "not completed" }],
        save: jest.fn().mockResolvedValue(true),
      };

      Habit.findById.mockResolvedValue(mockHabit);

      await updateHabit(req, res);

      expect(Habit.findById).toHaveBeenCalledWith("habit123");
      expect(mockHabit.logs[0].status).toBe("completed");
      expect(mockHabit.save).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Habit updated!",
        data: mockHabit,
      });
    });

    it("should add new log if none exists for today", async () => {
      req.params = { habitId: "habit123" };
      req.body = { status: "partially completed" };

      const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000)
        .toISOString()
        .split("T")[0];

      const mockHabit = {
        logs: [],
        save: jest.fn().mockResolvedValue(true),
      };

      Habit.findById.mockResolvedValue(mockHabit);

      await updateHabit(req, res);

      expect(Habit.findById).toHaveBeenCalledWith("habit123");
      expect(mockHabit.logs).toContainEqual({ date: today, status: "partially completed" });
      expect(mockHabit.save).toHaveBeenCalled();

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Habit updated!",
        data: mockHabit,
      });
    });

    it("should handle errors", async () => {
      req.params = { habitId: "habit123" };
      req.body = { status: "completed" };
      Habit.findById.mockRejectedValue(new Error("Update error"));

      await updateHabit(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: "error",
          message: "Failed to update habit",
          error: "Update error",
        })
      );
    });
  });
});
