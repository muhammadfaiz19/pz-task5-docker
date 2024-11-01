// src/routes/book.routes.ts
import { Router } from 'express';
import { authMiddleware } from '../middleware/auth.middleware';
import {
  createBook,
  getBooks,
  getBookById,
  updateBook,
  deleteBook
} from '../controllers/book.controller';

const router = Router();

/**
 * @swagger
 * /books:
 *   post:
 *     summary: Create a new book
 *     description: Adds a new book to the database
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Book created successfully
 *       400:
 *         description: Book with this title or code already exists
 */
router.post('/', authMiddleware, createBook);

/**
 * @swagger
 * /books:
 *   get:
 *     summary: Retrieve all books
 *     description: Returns a list of all books
 *     responses:
 *       200:
 *         description: A list of books
 */
router.get('/', authMiddleware, getBooks); // Protecting the route

/**
 * @swagger
 * /books/{id}:
 *   get:
 *     summary: Retrieve a book by ID
 *     description: Returns a single book by its ID
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the book to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: A book object
 *       404:
 *         description: Book not found
 */
router.get('/:id', authMiddleware, getBookById); // Protecting the route

/**
 * @swagger
 * /books/{id}:
 *   put:
 *     summary: Update a book by ID
 *     description: Updates the book details
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the book to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               author:
 *                 type: string
 *               code:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: The updated book object
 *       400:
 *         description: Book with this title or code already exists
 *       404:
 *         description: Book not found
 */
router.put('/:id', authMiddleware, updateBook); // Protecting the route

/**
 * @swagger
 * /books/{id}:
 *   delete:
 *     summary: Delete a book by ID
 *     description: Deletes a book from the database
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The ID of the book to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Book deleted successfully
 *       404:
 *         description: Book not found
 */
router.delete('/:id', authMiddleware, deleteBook); // Protecting the route

export default router;
