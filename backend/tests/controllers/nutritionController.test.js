// tests/controllers/foodController.test.js
import { jest } from "@jest/globals";

// Mock functions
const mockFind = jest.fn();
const mockSave = jest.fn();
const mockFindOneAndDelete = jest.fn();

jest.unstable_mockModule("../../models/nutritionModel.js", () => {
  const FoodMock = function (data) {
    Object.assign(this, data);
    this.save = mockSave;
  };

  return {
    __esModule: true,
    default: Object.assign(FoodMock, {
      find: mockFind,
      findOneAndDelete: mockFindOneAndDelete,
    }),
  };
});

// Import after mocks
const {
  getAllFoods,
  createFood,
  deleteFood,
} = await import("../../controllers/nutritionController.js");
const Food = (await import("../../models/nutritionModel.js")).default;

describe("Food Controller", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      user: { id: "user123" },
      query: {},
      body: {},
      params: {},
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  // --- GET ALL FOODS ---
  it("getAllFoods - returns all foods for a user", async () => {
    req.query.date = "2025-06-05";
    const mockFoods = [{ name: "Eggs", calories: 100 }];
    mockFind.mockResolvedValue(mockFoods);

    await getAllFoods(req, res);

    expect(mockFind).toHaveBeenCalledWith({
      userId: "user123",
      date: "2025-06-05",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: "success", data: mockFoods });
  });

  // --- CREATE FOOD ---
  it("createFood - creates a new food item", async () => {
    req.body = {
      name: "Apple",
      quantity: 1,
      calories: 95,
      protein: 0.5,
      carbs: 25,
      fat: 0.3,
      meal: "Snack",
      foodId: "apple-123",
      date: "2025-06-05",
    };

    const mockSaved = { ...req.body, userId: "user123" };
    mockSave.mockResolvedValue(mockSaved);

    await createFood(req, res);

    expect(mockSave).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ status: "success", data: mockSaved });
  });

  it("createFood - returns 400 if required fields are missing", async () => {
    req.body = { name: "Banana" }; // Incomplete

    await createFood(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: "All fields required",
    });
  });

  // --- DELETE FOOD ---
  it("deleteFood - deletes a food item", async () => {
    req.params.id = "foodId1";
    const mockDeleted = { name: "Rice" };
    mockFindOneAndDelete.mockResolvedValue(mockDeleted);

    await deleteFood(req, res);

    expect(mockFindOneAndDelete).toHaveBeenCalledWith({
      _id: "foodId1",
      userId: "user123",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ status: "success", message: "Food item deleted" });
  });

  it("deleteFood - returns 404 if food not found", async () => {
    req.params.id = "nonexistent";
    mockFindOneAndDelete.mockResolvedValue(null);

    await deleteFood(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      message: "Could not find item to delete",
    });
  });
});
