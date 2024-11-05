import { Request, Response, NextFunction } from 'express';
import { createBook, getBooks, getBookById, updateBook, deleteBook } from '../controllers/book.controller';
import { Book } from '../models/book.model';

jest.mock('../models/book.model'); 

describe('Book Controller', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = {};
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        next = jest.fn();
    });

    afterEach(() => {
        jest.clearAllMocks(); // Clear mocks after each test
    });

    describe('createBook', () => {
        it('should create a new book and return it', async () => {
            req.body = { title: 'Test Book', code: 'TEST001' };
            (Book.findOne as jest.Mock).mockResolvedValue(null);
            (Book.prototype.save as jest.Mock).mockResolvedValue(req.body); 

            await createBook(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith(req.body);
        });

        it('should return 400 if the book already exists', async () => {
            req.body = { title: 'Test Book', code: 'TEST001' };
            (Book.findOne as jest.Mock).mockResolvedValue(req.body); 

            await createBook(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({ message: 'Book with this title or code already exists' });
        });
    });

    describe('getBooks', () => {
        it('should return all books', async () => {
            const books = [{ title: 'Book 1' }, { title: 'Book 2' }];
            (Book.find as jest.Mock).mockResolvedValue(books); 

            await getBooks(req as Request, res as Response, next);

            expect(res.json).toHaveBeenCalledWith(books);
        });
    });

    describe('getBookById', () => {
        it('should return a book by ID', async () => {
            req.params = { id: '12345' };
            const book = { title: 'Book 1', _id: '12345' };
            (Book.findById as jest.Mock).mockResolvedValue(book); 

            await getBookById(req as Request, res as Response, next);

            expect(res.json).toHaveBeenCalledWith(book);
        });

        it('should return 404 if book not found', async () => {
            req.params = { id: '12345' };
            (Book.findById as jest.Mock).mockResolvedValue(null); 

            await getBookById(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Book not found' });
        });
    });

    describe('updateBook', () => {
        it('should update a book and return it', async () => {
            req.params = { id: '12345' };
            req.body = { title: 'Updated Book' };
            const existingBook = { title: 'Old Title', _id: '12345', toObject: () => ({ title: 'Old Title' }) };
            (Book.findById as jest.Mock).mockResolvedValue(existingBook); 
            (Book.updateOne as jest.Mock).mockResolvedValue({ nModified: 1 }); 

            await updateBook(req as Request, res as Response, next);

            expect(res.json).toHaveBeenCalledWith({ ...existingBook.toObject(), ...req.body });
        });

        it('should return 404 if book not found', async () => {
            req.params = { id: '12345' };
            (Book.findById as jest.Mock).mockResolvedValue(null);

            await updateBook(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Book not found' });
        });
    });

    describe('deleteBook', () => {
        it('should delete a book and return a success message', async () => {
            req.params = { id: '12345' };
            (Book.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 1 }); 

            await deleteBook(req as Request, res as Response, next);

            expect(res.json).toHaveBeenCalledWith({ message: 'Book deleted successfully' });
        });

        it('should return 404 if book not found', async () => {
            req.params = { id: '12345' };
            (Book.deleteOne as jest.Mock).mockResolvedValue({ deletedCount: 0 }); 

            await deleteBook(req as Request, res as Response, next);

            expect(res.status).toHaveBeenCalledWith(404);
            expect(res.json).toHaveBeenCalledWith({ message: 'Book not found' });
        });
    });
});
