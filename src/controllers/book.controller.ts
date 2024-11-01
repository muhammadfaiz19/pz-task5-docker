import { Request, Response, NextFunction } from 'express';
import { Book } from '../models/book.model';

export const createBook = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const existingBook = await Book.findOne({ 
        $or: [{ title: req.body.title }, { code: req.body.code }]
      });
  
      if (existingBook) {
        res.status(400).json({ 
          message: 'Book with this title or code already exists' 
        });
        return;
      }
  
      const book = new Book(req.body);
      await book.save();
      res.status(201).json(book);
    } catch (error) {
      next(error);
    }
  };
  

export const getBooks = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    next(error);
  }
};

export const getBookById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
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

export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const existingBook = await Book.findOne({
      $or: [
        { title: req.body.title },
        { code: req.body.code }
      ],
      _id: { $ne: req.params.id }
    });

    if (existingBook) {
      res.status(400).json({ 
        message: 'Book with this title or code already exists' 
      });
      return;
    }

    const book = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }

    res.json(book);
  } catch (error) {
    next(error);
  }
};

export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);
    if (!book) {
      res.status(404).json({ message: 'Book not found' });
      return;
    }
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    next(error);
  }
};