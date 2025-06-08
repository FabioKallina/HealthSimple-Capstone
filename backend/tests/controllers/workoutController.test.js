import { jest } from "@jest/globals";

// ✅ 1. Mock Workout model
const mockFind = jest.fn();
const mockFindByIdAndUpdate = jest.fn();
const mockFindOneAndDelete = jest.fn();
const mockSave = jest.fn();

jest.unstable_mockModule("../../models/workoutModel.js", () => {
  const WorkoutMock = function (data) {
    Object.assign(this, data);
    this.save = mockSave;
  };

  return {
    __esModule: true,
    default: Object.assign(WorkoutMock, {
      find: mockFind,
      findByIdAndUpdate: mockFindByIdAndUpdate,
      findOneAndDelete: mockFindOneAndDelete,
    }),
  };
});

// ✅ 2. Import controller *after* mocking
const { getAllWorkouts, createWorkout, updateWorkout, deleteWorkout } =
  await import("../../controllers/workoutController.js");
const Workout = (await import("../../models/workoutModel.js")).default;

describe("Workout Controller", () => {
  const mockUser = { id: "user123" };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("getAllWorkouts - returns workouts for user", async () => {
    const req = { user: mockUser };
    const mockWorkouts = [{ _id: "1", exercises: [] }];

    mockFind.mockResolvedValue(mockWorkouts);

    await getAllWorkouts(req, res);

    expect(mockFind).toHaveBeenCalledWith({ userId: "user123" });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      data: mockWorkouts,
    });
  });

  test("createWorkout - creates new workout", async () => {
    const req = {
      user: mockUser,
      body: {
        exercises: [{ name: "Push Up", sets: [] }],
        date: "2025-06-05",
        timeElapsed: 1200,
      },
    };
    const mockWorkout = {
      ...req.body,
      userId: "user123",
      save: mockSave,
    };

    mockSave.mockResolvedValue(mockWorkout);

    await createWorkout(req, res);

    expect(mockSave).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      data: mockWorkout,
    });
  });

  test("updateWorkout - updates a workout", async () => {
    const req = {
      params: { id: "1" },
      body: { sets: [{ reps: 10, weight: 50 }] },
    };

    const updatedWorkout = {
      _id: "1",
      sets: req.body.sets,
    };

    mockFindByIdAndUpdate.mockResolvedValue(updatedWorkout);

    await updateWorkout(req, res);

    expect(mockFindByIdAndUpdate).toHaveBeenCalledWith(
      "1",
      { sets: req.body.sets },
      { new: true }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      data: updatedWorkout,
    });
  });

  test("deleteWorkout - deletes a workout", async () => {
    const req = {
      params: { id: "1" },
      user: mockUser,
    };

    const deletedWorkout = { _id: "1", userId: "user123" };

    mockFindOneAndDelete.mockResolvedValue(deletedWorkout);

    await deleteWorkout(req, res);

    expect(mockFindOneAndDelete).toHaveBeenCalledWith({
      _id: "1",
      userId: "user123",
    });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: "success",
      message: "Workout deleted",
    });
  });
});
