const request = require('supertest');
const { connectDB, closeDB } = require('../src/config/db');
const app = require('../src/app');
const { noteSchema } = require('../src/utils/validation'); // Adjust the path as needed


describe('Note Routes', () => {
    let accessToken;

    beforeAll(async () => {
        await connectDB(); // Connect to in-memory MongoDB

        // Register and login a test user
        await request(app)
            .post('/api/auth/register')
            .send({ username: 'noteuser', password: 'password123' });

        const loginResponse = await request(app)
            .post('/api/auth/login')
            .send({ username: 'noteuser', password: 'password123' });

        accessToken = loginResponse.body.accessToken; // Store access token for authenticated requests
    });

    afterAll(async () => {
        await closeDB(); // Clean up the database
    });

    describe('POST /notes', () => {
        test('Should create a new note successfully', async () => {
            const response = await request(app)
                .post('/api/notes')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    title: 'Test Note',
                    detailedNotes: 'This is a test note.',
                });

            expect(response.statusCode).toBe(201);
            expect(response.body.title).toBe('Test Note');
        });

        test('Should fail to create note without a title', async () => {
            const response = await request(app)
                .post('/api/notes')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ detailedNotes: 'Missing title' });

            expect(response.statusCode).toBe(400);
            expect(response.body.error).toBe('Note title is required.');
        });
    });

    describe('GET /notes', () => {
        test('Should retrieve all notes for the logged-in user', async () => {
            const response = await request(app)
                .get('/api/notes')
                .set('Authorization', `Bearer ${accessToken}`);

            expect(response.statusCode).toBe(200);
            expect(Array.isArray(response.body)).toBe(true);
        });
    });

    describe('PUT /notes/:id', () => {
        let noteId;

        beforeAll(async () => {
            const response = await request(app)
                .post('/api/notes')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({
                    title: 'Updatable Note',
                    detailedNotes: 'Initial details.',
                });

            noteId = response.body._id;
        });

        test('Should update a note successfully', async () => {
            const response = await request(app)
                .put(`/api/notes/${noteId}`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'Updated Note Title' });

            expect(response.statusCode).toBe(200);
            expect(response.body.title).toBe('Updated Note Title');
        });

        test('Should return 404 for a non-existent note ID', async () => {
            const response = await request(app)
                .put('/api/notes/100000000000000000000000')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'Does Not Exist' });

            expect(response.statusCode).toBe(404);
            expect(response.body.error).toBe('Note not found');
        });
    });

    describe('DELETE /notes/:id', () => {
        let noteId;

        beforeAll(async () => {
            const response = await request(app)
                .post('/api/notes')
                .set('Authorization', `Bearer ${accessToken}`)
                .send({ title: 'Deletable Note', detailedNotes: '' });

            noteId = response.body._id;
        });

        test('Should delete a note successfully', async () => {
            const response = await request(app)
                .delete(`/api/notes/${noteId}`)
                .set('Authorization', `Bearer ${accessToken}`);

            expect(response.statusCode).toBe(200);
            expect(response.body.message).toBe('Note deleted successfully');
        });

        test('Should return 404 for deleting a non-existent note', async () => {
            const response = await request(app)
                .delete(`/api/notes/${noteId}`) // Use already deleted note ID
                .set('Authorization', `Bearer ${accessToken}`);

            expect(response.statusCode).toBe(404);
            expect(response.body.error).toBe('Note not found');
        });
    });
});
