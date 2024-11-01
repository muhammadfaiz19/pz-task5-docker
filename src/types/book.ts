export interface IBook {
    _id?: string;
    title: string;
    code: string;
    author: string;
    publishedYear: number;
    createdAt?: Date;
    updatedAt?: Date;
  }