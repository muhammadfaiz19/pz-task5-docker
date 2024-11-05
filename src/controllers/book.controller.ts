import { Request, Response, NextFunction } from 'express';
import { Book } from '../models/book.model';
export const createBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const existingBook = await Book.findOne({ $or: [{ title: req.body.title }, { code: req.body.code }] });
        if (existingBook) {
            res.status(400).json({ message: 'Book with this title or code already exists' });
            return; 
        }
        const book = new Book(req.body);
        const savedBook = await book.save();
        res.status(201).json(savedBook);
    } catch (error) {
        next(error);
    }
};

export const getBooks = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const books = await Book.find(); // Fetch all books from the database
        res.json(books);
    } catch (error) {
        next(error);
    }
};


export const getBookById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const book = await Book.findById(req.params.id);
        if (!book) {
            res.status(404).json({ message: 'Book not found' });
            return; 
        }
        res.json(book);
    } catch (error) {
        next(error);
    }
};

// Update a book by ID
export const updateBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const existingBook = await Book.findById(req.params.id);
        if (!existingBook) {
            res.status(404).json({ message: 'Book not found' });
            return;
        }
        const updatedBook = { ...existingBook.toObject(), ...req.body }; 
        await Book.updateOne({ _id: req.params.id }, updatedBook);
        res.json(updatedBook);
    } catch (error) {
        next(error);
    }
};


export const deleteBook = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await Book.deleteOne({ _id: req.params.id });
        if (result.deletedCount === 0) {
            res.status(404).json({ message: 'Book not found' });
            return; // Explicitly return to indicate the end of the function
        }
        res.json({ message: 'Book deleted successfully' });
    } catch (error) {
        next(error);
    }
};
