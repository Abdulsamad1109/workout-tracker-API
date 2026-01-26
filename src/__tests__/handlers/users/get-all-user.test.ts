import { Request, Response } from 'express';
import * as usersHandler from '../../../handlers/users';

describe('getAllUsers', () => {
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
    
    mockRequest = {};
    
    mockResponse = {
      status: statusMock,
      send: sendMock
    };

    // Setup repository mock
    mockUserRepository = {
      find: jest.fn()
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
    it('should return 200 with array of users when users exist', async () => {
      // Arrange
      const mockUsers = [
        {
          id: 1,
          email: 'user1@example.com',
          firstname: 'John',
          lastname: 'Doe'
        },
        {
          id: 2,
          email: 'user2@example.com',
          firstname: 'Jane',
          lastname: 'Smith'
        }
      ];

      mockUserRepository.find.mockResolvedValue(mockUsers);

      // Act
      await usersHandler.getAllUsers(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockUserRepository.find).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(sendMock).toHaveBeenCalledWith(mockUsers);
    });

    it('should return 200 with empty array when no users exist', async () => {
      // Arrange
      mockUserRepository.find.mockResolvedValue([]);

      // Act
      await usersHandler.getAllUsers(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(mockUserRepository.find).toHaveBeenCalledTimes(1);
      expect(statusMock).toHaveBeenCalledWith(200);
      expect(sendMock).toHaveBeenCalledWith([]);
    });
  });

  describe('Error handling', () => {
    it('should return 500 when database operation fails', async () => {
      // Arrange
      mockUserRepository.find.mockRejectedValue(
        new Error('Database connection failed')
      );

      // Act
      await usersHandler.getAllUsers(mockRequest as Request, mockResponse as Response);

      // Assert
      expect(statusMock).toHaveBeenCalledWith(500);
      expect(sendMock).toHaveBeenCalledWith({
        message: 'Internal server error'
      });
    });
  });
});