import { jest } from '@jest/globals';

// Mock Steps model
const mockFind = jest.fn();
const mockCreate = jest.fn();

jest.unstable_mockModule('../../models/stepsModel.js', () => ({
  __esModule: true,
  default: {
    find: mockFind,
    create: mockCreate,
  },
}));

// Import after mocking
const { default: Steps } = await import('../../models/stepsModel.js');
const { getSteps, createSteps } = await import('../../controllers/stepsController.js');

describe('Steps Controller', () => {
  const mockUser = { id: 'user123' };
  const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should get steps for a user', async () => {
    const req = { user: mockUser };
    const mockSteps = [{ date: '2025-06-05', steps: 5000 }];

    mockFind.mockResolvedValue(mockSteps);

    await getSteps(req, res);

    expect(mockFind).toHaveBeenCalledWith({ userId: 'user123' });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      data: mockSteps,
    });
  });

  test('should create steps for a user', async () => {
    const req = {
      user: mockUser,
      body: {
        date: '2025-06-05',
        steps: 5000,
      },
    };

    const mockCreated = { ...req.body, userId: 'user123' };

    mockCreate.mockResolvedValue(mockCreated);

    await createSteps(req, res);

    expect(mockCreate).toHaveBeenCalledWith({
      userId: 'user123',
      date: '2025-06-05',
      steps: 5000,
    });

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      status: 'success',
      message: 'Steps created',
      data: mockCreated,
    });
  });
});
