import { Request, Response } from 'express';
import * as usersHandler from '../../../handlers/users';

describe('getUserById', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let statusMock: jest.Mock;
  let sendMock: jest.Mock;
  let mockUserRepository: any;
  let getUserRepositorySpy: jest.SpyInstance;

  beforeEach(() => {
    jest.clearAllMocks();
    
    sendMock = jest.fn();
    statusMock = jest.fn().mockReturnValue({ send: sendMock });
    
    mockRequest = {
      params: {
        id: 'user-123'
      }
    };
    
    mockResponse = {
      status: statusMock,
      send: sendMock
    };

    // Setup repository mock
    mockUserRepository = {
      findOne: jest.fn()
    };

    // Spy on getUserRepository and return our mock
    getUserRepositorySpy = jest
      .spyOn(usersHandler, 'getUserRepository')
      .mockReturnValue(mockUserRepository);
  });

  afterEach(() => {
    getUserRepositorySpy.mockRestore();
  });

  describe('Successful user retrieval', () => {
    it('should return 200 with user data when user exists', async () => {
      // Arrange
      const mockUser = {
        id: 'user-123',
        email: 'test@example.com',
        firstname: 'John',
        lastname: 'Doe'
      };

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      // Act
      await usersHandler.getUserById(
        mockRequest as Request<{ id: string }, {}, {}, {}>,
        mockResponse as Response
      );

      // Assert
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-123' }
      });
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(sendMock).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('User not found', () => {
    it('should return 404 when user does not exist', async () => {
      // Arrange
      mockUserRepository.findOne.mockResolvedValue(null);

      // Act
      await usersHandler.getUserById(
        mockRequest as Request<{ id: string }, {}, {}, {}>,
        mockResponse as Response
      );

      // Assert
      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: 'user-123' }
      });
      expect(statusMock).toHaveBeenCalledWith(404);
      expect(sendMock).toHaveBeenCalledWith({
        message: 'User not found'
      });
    });
  });

  describe('Error handling', () => {


    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    
    it('should return 500 when database operation fails', async () => {
      // Arrange
      mockUserRepository.findOne.mockRejectedValue(
        new Error('Database connection failed')
      );

      // Act
      await usersHandler.getUserById(
        mockRequest as Request<{ id: string }, {}, {}, {}>,
        mockResponse as Response
      );

      // Assert
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(sendMock).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });
});