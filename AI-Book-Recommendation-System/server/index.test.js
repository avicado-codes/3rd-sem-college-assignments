// server/index.test.js
const request = require('supertest');
const express = require('express');
// We need to import the app logic without it listening on a port
// To do this, we'll need to refactor index.js slightly.
// For now, let's assume the app is exported.
// NOTE: We will refactor index.js in the next step to make it testable.

// This is a common pattern: create an app.js and a server.js
// For simplicity in this project, we'll just mock the API directly.

// Mock the @google/generative-ai module BEFORE it's imported by the server
jest.mock('@google/generative-ai', () => {
  const mockGenerateContent = jest.fn().mockResolvedValue({
    response: {
      text: () => `
        **Title:** Mock Book 1
        Author: Mock Author 1
        Reasoning: This is a mock reason.
        For you because: It is a mock.
      `
    }
  });
  return {
    GoogleGenerativeAI: jest.fn(() => ({
      getGenerativeModel: jest.fn(() => ({
        generateContent: mockGenerateContent,
      })),
    })),
  };
});

// Now, we can import the server logic after the mock has been set up.
// Because of how Node caches modules, we need to reset everything.
let server;
beforeAll(() => {
  // Reset module cache to ensure our mock is used
  jest.resetModules();
  // Dynamically import the app after resetting modules
  server = require('./index'); 
});

afterAll((done) => {
  // Close the server after all tests are done
  server.close(done);
});


describe('POST /api/recommendations', () => {
  it('should return a successful mock recommendation', async () => {
    const res = await request(server)
      .post('/api/recommendations')
      .send({ prompt: 'test prompt' });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('success');
    expect(res.body.recommendations).toBeInstanceOf(Array);
    expect(res.body.recommendations[0].title).toBe('Mock Book 1');
  });

  it('should return 400 if prompt is missing', async () => {
    const res = await request(server)
      .post('/api/recommendations')
      .send({});
      
    expect(res.statusCode).toEqual(400);
    expect(res.body.message).toBe('Prompt is required.');
  });
});