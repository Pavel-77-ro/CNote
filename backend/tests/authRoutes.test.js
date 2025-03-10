const request = require('supertest');
const { connectDB, closeDB } = require('../src/config/db');
const app = require('../src/app'); 

describe('Auth Routes', () => {
    beforeAll(async () => {
        // Connect to in-memory MongoDB
        await connectDB();
    });

    afterAll(async () => {
        await closeDB();
    });

    describe('POST /auth/register', () => {
        test('Should register a new user successfully', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    password: 'password123',
                });

            expect(response.statusCode).toBe(201);
            expect(response.body.message).toBe('User registered successfully');
        });

        test('Should fail if username already exists', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'testuser',
                    password: 'password123',
                });

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('Username already exists');
        });
    });

    describe('POST /auth/login', () => {
        beforeAll(async () => {
            await request(app)
                .post('/api/auth/register')
                .send({
                    username: 'loginuser',
                    password: 'password123',
                });
        });

        test('Should authenticate a user successfully', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'loginuser',
                    password: 'password123',
                });

            expect(response.statusCode).toBe(200);
            expect(response.body).toHaveProperty('accessToken');
        });

        test('Should fail with invalid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    username: 'loginuser',
                    password: 'wrongpassword',
                });

            expect(response.statusCode).toBe(401);
            expect(response.body.error).toBe('Invalid credentials');
        });
    });
});
