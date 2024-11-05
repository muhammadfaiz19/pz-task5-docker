import { Request, Response, NextFunction } from "express";
import { login, register } from "../controllers/auth.controller";
import { User } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("../models/user.model"); 
jest.mock("bcrypt"); 
jest.mock("jsonwebtoken"); 

describe("AuthController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      cookie: jest.fn(),
    };
    next = jest.fn();
  });

  describe("login", () => {
    it("should return 401 if user is not found", async () => {
      req.body = { username: "nonexistent", password: "password" };
      (User.findOne as jest.Mock).mockResolvedValue(null);

      await login(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
    });

    it("should return 401 if password is incorrect", async () => {
      req.body = { username: "testuser", password: "wrongpassword" };
      (User.findOne as jest.Mock).mockResolvedValue({ password: "hashedpassword" });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await login(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials" });
    });

    it("should return token if login is successful", async () => {
      req.body = { username: "testuser", password: "correctpassword" };
      (User.findOne as jest.Mock).mockResolvedValue({ _id: "123", password: "hashedpassword" });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue("mockedToken");

      await login(req as Request, res as Response, next);

      expect(res.cookie).toHaveBeenCalledWith("token", "mockedToken", { httpOnly: true });
      expect(res.json).toHaveBeenCalledWith({
        message: "Login successful",
        token: "mockedToken",
      });
    });
  });

  describe("register", () => {
    it("should return 400 if user already exists", async () => {
      req.body = { username: "existinguser", password: "password" };
      (User.findOne as jest.Mock).mockResolvedValue({});

      await register(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ message: "User already exists" });
    });

    it("should return 201 if registration is successful", async () => {
      req.body = { username: "newuser", password: "password" };
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashedpassword");
      (User.prototype.save as jest.Mock).mockResolvedValue({});

      await register(req as Request, res as Response, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({ message: "User registered successfully" });
    });
  });
});
