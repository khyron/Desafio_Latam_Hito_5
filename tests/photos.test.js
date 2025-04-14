const supertest = require('supertest');
const app = require('../src/index');
const Photo = require('../src/models/photo.model');
const jwt = require('jsonwebtoken');
require('dotenv').config({ path: '../.env.test' });

// Mock data
const mockPhotos = [
  {
    id: "1",
    title: "Dewdrops on Spiderweb",
    photographer: "Jane Doe",
    camera_model: "Canon EOS 5D Mark IV",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Mock user for authentication
const mockUser = {
  id: 1,
  email: "test@example.com",
  username: "testuser"
};
const authToken = jwt.sign(mockUser, process.env.JWT_SECRET);

// Mock implementation
jest.mock('../src/models/photo.model', () => {
  return {
    findAll: jest.fn(() => Promise.resolve(mockPhotos)),
    findByPk: jest.fn(id => Promise.resolve(mockPhotos.find(p => p.id === id))),
    create: jest.fn(photoData => {
      if (!photoData.title || !photoData.photographer) {
        throw new Error('Validation error');
      }
      const newPhoto = { 
        id: "2", 
        ...photoData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      mockPhotos.push(newPhoto);
      return Promise.resolve(newPhoto);
    }),
    update: jest.fn((values, options) => {
      const photo = mockPhotos.find(p => p.id === options.where.id);
      if (photo) {
        Object.assign(photo, values);
        photo.updatedAt = new Date();
        return Promise.resolve([1, [photo]]);
      }
      return Promise.resolve([0, []]);
    }),
    destroy: jest.fn(options => {
      const index = mockPhotos.findIndex(p => p.id === options.where.id);
      if (index !== -1) {
        mockPhotos.splice(index, 1);
        return Promise.resolve(1);
      }
      return Promise.resolve(0);
    })
  };
});

// Helper function for authenticated requests
const authRequest = (method, url) => {
  return supertest(app)[method](url)
    .set('Authorization', `Bearer ${authToken}`)
    .set('Content-Type', 'application/json');
};

describe('Macro Photography API', () => {
  afterEach(() => {
    jest.clearAllMocks();
    // Reset mock photos array
    mockPhotos.length = 1;
    mockPhotos[0] = {
      id: "1",
      title: "Dewdrops on Spiderweb",
      photographer: "Jane Doe",
      camera_model: "Canon EOS 5D Mark IV",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('GET /api/photos', () => {
    it('should return all photos', async () => {
      const response = await authRequest('get', '/api/photos');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: "success",
        payload: mockPhotos
      });
    });

    it('should return 401 without authentication', async () => {
      const response = await supertest(app)
        .get('/api/photos');
      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/photos/:id', () => {
    it('should return a specific photo', async () => {
      const response = await authRequest('get', '/api/photos/1');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        status: "success",
        payload: mockPhotos[0]
      });
    });

    it('should return 404 for non-existent photo', async () => {
      Photo.findByPk.mockResolvedValueOnce(null);
      const response = await authRequest('get', '/api/photos/999');
      expect(response.status).toBe(404);
      expect(response.body.message).toMatch(/not found/i);
    });
  });

  describe('POST /api/photos', () => {
    it('should create a new photo', async () => {
      const newPhoto = {
        title: "New Photo",
        photographer: "Photographer",
        camera_model: "Model"
      };
      const response = await authRequest('post', '/api/photos')
        .send(newPhoto);
      
      expect(response.status).toBe(201);
      expect(response.body.payload.title).toBe(newPhoto.title);
      expect(mockPhotos.length).toBe(2);
    });

    it('should return 400 for invalid data', async () => {
      const response = await authRequest('post', '/api/photos')
        .send({ photographer: "Missing title" });
      
      expect(response.status).toBe(400);
      expect(response.body.message).toMatch(/required/i);
    });

    it('should return 401 without authentication', async () => {
      const response = await supertest(app)
        .post('/api/photos')
        .send({
          title: "Test",
          photographer: "Test"
        });
      expect(response.status).toBe(401);
    });
  });

  describe('PUT /api/photos/:id', () => {
    it('should update a photo', async () => {
      const updates = { title: "Updated Title" };
      const response = await authRequest('put', '/api/photos/1')
        .send(updates);
      
      expect(response.status).toBe(200);
      expect(response.body.payload.title).toBe(updates.title);
      expect(mockPhotos[0].title).toBe(updates.title);
    });

    it('should return 404 for non-existent photo', async () => {
      Photo.update.mockResolvedValueOnce([0, []]);
      const response = await authRequest('put', '/api/photos/999')
        .send({ title: "Updated Title" });
      
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/photos/:id', () => {
    it('should delete a photo', async () => {
      const initialLength = mockPhotos.length;
      const response = await authRequest('delete', '/api/photos/1');
      
      expect(response.status).toBe(200);
      expect(mockPhotos.length).toBe(initialLength - 1);
    });

    it('should return 404 for non-existent photo', async () => {
      Photo.destroy.mockResolvedValueOnce(0);
      const response = await authRequest('delete', '/api/photos/999');
      
      expect(response.status).toBe(404);
    });
  });
});