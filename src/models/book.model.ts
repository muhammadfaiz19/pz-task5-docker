import mongoose, { Schema, Document } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  code: string;
  description: string;
  publishedYear: number; 
}

const bookSchema: Schema = new Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  code: { type: String, required: true },
  description: { type: String, required: true },
  publishedYear: { type: Number, required: true },
});

export const Book = mongoose.model<IBook>('Book', bookSchema);
