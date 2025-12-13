import pool from '../db/pool.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

// export const saveItem = (req,res) => {
//   const { item } = req.body;
//   try{
//     // check if item is in database 
//     // if not save item to user db
//     //
//   }
// }
//
// export const saveItem = (req,res) => {
//
// }
