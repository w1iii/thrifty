import dotenv from 'dotenv';
dotenv.config();
import pool from '../db/pool.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import axios from 'axios';


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
