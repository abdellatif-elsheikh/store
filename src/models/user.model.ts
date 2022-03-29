import User from '../types/user.type';
import db from '../database';
import Error from '../interfaces/error.interface';
import bcrypt from 'bcrypt';
import config from '../config';

const hashPassword = (password: string): string => {
  const salt = parseInt(config.salt as string, 10);
  return bcrypt.hashSync(`${password}${config.pepper}`, salt);
};

class UserModel {
  /**
   * * create new users
   * * select all users
   * * get specific user
   * * update user information
   * * delete user
   * TODO:
   * * authenticate user
   */
  // create new user
  async create(u: User): Promise<User> {
    try {
      const conn = await db.connect();
      const sql =
        'INSERT INTO users(first_name, last_name, email, password) VALUES ($1, $2, $3, $4) returning user_id, email, first_name, last_name';
      const result = await conn.query(sql, [
        u.first_name,
        u.last_name,
        u.email,
        hashPassword(u.password),
      ]);
      conn.release();

      return result.rows[0];
    } catch (error) {
      throw new Error(
        `unable to create user: ${u.first_name} error: ${
          (error as Error).message
        }`
      );
    }
  }
  // get all users
  async getMany(): Promise<User[]> {
    try {
      const conn = await db.connect();
      const sql = 'SELECT user_id, first_name, last_name, email FROM users';
      const result = await conn.query(sql);
      conn.release();
      return result.rows;
    } catch (error) {
      throw new Error(
        `unable to get users\n error: ${(error as Error).message}`
      );
    }
  }
  // get specific user
  async getOne(id: string): Promise<User> {
    try {
      const conn = await db.connect();
      const sql =
        'SELECT user_id, first_name, last_name, email FROM users WHERE user_id = ($1)';
      const result = await conn.query(sql, [id]);
      conn.release();

      return result.rows[0];
    } catch (error) {
      throw new Error(`cant found this user\n ${(error as Error).message}`);
    }
  }

  async update(u: User): Promise<User> {
    try {
      const conn = await db.connect();
      const sql = `UPDATE users SET 
        first_name =$1, last_name =$2, email =$3, password =$4
        WHERE user_id =$5
        RETURNING user_id, first_name, last_name, email`;
      const result = await conn.query(sql, [
        u.first_name,
        u.last_name,
        u.email,
        hashPassword(u.password),
        u.user_id,
      ]);
      conn.release();
      return result.rows[0];
    } catch (error) {
      throw new Error(
        `cant update the informations fro this user\n Error: ${
          (error as Error).message
        }`
      );
    }
  }

  async delete(id: string): Promise<object> {
    try {
      const conn = await db.connect();
      const sql = 'DELETE FROM users WHERE user_id =$1';
      const result = await conn.query(sql, [id]);
      conn.release();

      return result;
    } catch (error) {
      throw new Error(
        `can't delete this user\n Error: ${(error as Error).message}`
      );
    }
  }

  async authenticate({
    email,
    password,
  }: {
    email: string;
    password: string;
  }): Promise<User | null> {
    try {
      const conn = await db.connect();
      const sql = 'SELECT password FROM users where email=$1';
      const result = await conn.query(sql, [email]);
      // check if the user is exist to then compare the password
      if (result.rows.length) {
        const { password: hashPassword } = result.rows[0];
        const isPasswordValid = bcrypt.compareSync(
          `${password}${config.pepper}`,
          hashPassword
        );

        if (isPasswordValid) {
          const userInfo = await conn.query(
            `SELECT user_id, first_name, last_name, email
          FROM users WHERE email=$1`,
            [email]
          );
          conn.release();
          return userInfo.rows[0];
        }
      }
      conn.release();
      return null;
    } catch (error) {
      throw new Error(`unable to login\n ${(error as Error).message}`);
    }
  }
}

export default UserModel;
