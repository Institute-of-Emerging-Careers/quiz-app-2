process.env.NODE_ENV = 'test'
require('dotenv').config('../.env')

const sequelize = require('../db/connect')
const allSectionsSolved = require('../functions/allSectionsSolved')

const mockSectionResponse = [{ id: 1 }, { id: 2 }]
let mockAttemptResponse = { statusText: 'Completed' }

jest.mock('../db/models', () => {
	return {
		Section: {
			findAll: jest.fn(
				() => new Promise((resolve) => resolve(mockSectionResponse))
			),
		},
		Attempt: {
			findOne: jest.fn(
				() => new Promise((resolve) => resolve(mockAttemptResponse))
			),
		},
	}
})

beforeAll(() => sequelize.sync({ alter: true, force: true }))
afterAll(() => sequelize.close())

test('allSectionsSolved function should return true if assignment was completed', async () => {
	const assignment = { completed: true }
	expect(allSectionsSolved(0, assignment)).resolves.toBeTruthy()
})

test('allSectionsSolved function should return true if all', async () => {
	const assignment = { completed: false }
	expect(allSectionsSolved(0, assignment)).resolves.toBeTruthy()
})

test('allSectionsSolved function should return false if a section has no attempts', async () => {
	const assignment = { completed: false }
	mockAttemptResponse = null
	expect(allSectionsSolved(0, assignment)).resolves.toBeFalsy()
})
