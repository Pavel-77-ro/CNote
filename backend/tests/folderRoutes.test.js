const request = require('supertest');
const { connectDB, closeDB } = require('../src/config/db');
const app = require('../src/app');

describe('Folder Routes', () => {
    let accessToken;

    beforeAll(async () => {
        await connectDB(); // Connect to in-memory MongoDB

        // Register and login a test user
        await request(app)
            .post('/api/auth/register')
            .send({ username: 'folderuser', password: 'password123' });

        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({ username: 'folderuser', password: 'password123' });

        accessToken = loginResponse.body.accessToken; // Store access token for authenticated requests
    });

    afterAll(async () => {
        await closeDB(); // Clean up the database
    });

    describe('POST /folders', () => {
        test('Should create a new folder successfully', async () => {
            const response = await request(app)
                .post('/api/folders')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ name: 'Test Folder' });

            expect(response.statusCode).toBe(201);
            expect(response.body.name).toBe('Test Folder');
        });

        test('Should fail to create folder without a name', async () => {
            const response = await request(app)
                .post('/api/folders')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({});

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('Folder name is required.');
        });
    });

    describe('GET /folders', () => {
        test('Should retrieve all folders for the logged-in user', async () => {
            const response = await request(app)
                .get('/api/folders')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('GET /folders/:id', () => {
        let folderId;

        beforeAll(async () => {
            const response = await request(app)
                .post('/api/folders')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ name: 'Specific Folder' });

            folderId = response.body._id;
        });

        test('Should retrieve a specific folder by ID', async () => {
            const response = await request(app)
                .get(`/api/folders/${folderId}`)
                .set('Authorization', `Bearer ${accessToken}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.name).toBe('Specific Folder');
        });

        test('Should return 404 for a non-existent folder ID', async () => {
            const response = await request(app)
                .get('/api/folders/100000000000000000000000')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(response.statusCode).toBe(404);
            expect(response.body.error).toBe('Folder not found');
        });
    });

    describe('DELETE /folders/:id', () => {
        let folderId;

        beforeAll(async () => {
            const response = await request(app)
                .post('/api/folders')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ name: 'Deletable Folder' });

            folderId = response.body._id;
        });

        test('Should delete a folder successfully', async () => {
            const response = await request(app)
                .delete(`/api/folders/${folderId}`)
                .set('Authorization', `Bearer ${accessToken}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('Folder deleted successfully');
        });

        test('Should return 404 for deleting a non-existent folder', async () => {
            const response = await request(app)
                .delete(`/api/folders/${folderId}`) // Use already deleted folder ID
                .set('Authorization', `Bearer ${accessToken}`);

            expect(response.statusCode).toBe(404);
            expect(response.body.error).toBe('Folder not found');
        });
    });
});
