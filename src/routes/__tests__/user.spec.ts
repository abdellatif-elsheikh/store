import UserModel from '../../models/user.model';
import User from '../../types/user.type';
import supertest from 'supertest';
import db from '../../database';
import app from '../..';
import jwt from 'jsonwebtoken';
import config from '../../config';

const userModel = new UserModel();
const request = supertest(app);
let token = '';

describe('user api endpoints', () => {
  const user = {
    first_name: 'ahmed',
    last_name: 'elsheikh',
    email: 'ahmed123@gmail.com',
    password: '16/11/2018',
  } as User;

  beforeAll(async () => {
    const createUser = await userModel.create(user);
    user.user_id = createUser.user_id;
  });

  afterAll(async () => {
    const conn = await db.connect();
    const sql = 'DELETE FROM users';
    await conn.query(sql);
    conn.release();
  });

  describe('test auth method', () => {
    it('should be able to authenticate to get token', async () => {
      const { email, password } = { ...user };
      const res = await request
        .post('/api/users/auth')
        .set('content-type', 'application/json')
        .send({ email, password });
      expect(res.status).toBe(200);
      const { user_id, email: userEmail, token: userToken } = res.body.data;
      expect(user_id).toEqual(user.user_id);
      expect(userEmail).toEqual(user.email);
      token = userToken;
    });

    it('should be failed to authenticate with wrong email or password', async () => {
      const res = await request
        .post('/api/users/auth')
        .set('content-type', 'application/json')
        .send({ email: 'wrong email', password: 'wrong password' });
      expect(res.status).toBe(401);
    });
  });

  describe('test CRUD API methods', () => {
    it('should create new user ', async () => {
      const res = await request
        .post('/api/users/')
        .set('Content-type', 'application/json')
        .send({
          email: 'test2@gmail.com',
          first_name: 'test2',
          last_name: 'user',
          password: 'test',
        } as User);
      expect(res.status).toBe(200);
      const { email, first_name, last_name } = res.body.data;
      expect(email).toBe('test2@gmail.com');
      expect(first_name).toBe('test2');
      expect(last_name).toBe('user');
    });

    describe('test getMany route', () => {
      it('should return status 200 when token is provided', async () => {
        const res = await request
          .get('/api/users/')
          .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.data.length).toBe(2);
      });
      it('should return status 401 when wrong token is provided', async () => {
        const res = await request
          .get('/api/users/')
          .set('Authorization', `Bearer ${token}fake token`);
        expect(res.status).toBe(401);
      });
    });
    describe('test getOne route', () => {
      it('should return status 200 when token is provided', async () => {
        const res = await request
          .get(`/api/users/${user.user_id}`)
          .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        const { email, first_name, last_name } = res.body.data;
        expect(email).toBe(user.email);
        expect(first_name).toBe(user.first_name);
        expect(last_name).toBe(user.last_name);
      });
      it('should return status 401 when wrong token is provided', async () => {
        const res = await request
          .get(`/api/users/${user.user_id}`)
          .set('Authorization', `Bearer ${token}fake token`);
        expect(res.status).toBe(401);
      });
    });
    describe('test update route', () => {
      it('should return status 200 when token is provided', async () => {
        const res = await request
          .patch(`/api/users/${user.user_id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            ...user,
            email: 'ahmed1712@yahoo.com',
            first_name: 'ahmed1712',
          });
        expect(res.status).toBe(200);
        const { email, first_name } = res.body.data;
        expect(email).toBe('ahmed1712@yahoo.com');
        expect(first_name).toBe('ahmed1712');
      });
      it('should return status 401 when wrong token is provided', async () => {
        const res = await request
          .patch(`/api/users/${user.user_id}`)
          .set('Authorization', `Bearer ${token}fake token`);
        expect(res.status).toBe(401);
      });
    });
    describe('test delete route', () => {
      it('should return status 200 when token is provided', async () => {
        const res = await request
          .delete(`/api/users/${user.user_id}`)
          .set('Authorization', `Bearer ${token}`);
        expect(res.status).toBe(200);
        expect(res.body.data).toBeUndefined();
      });
      it('should return status 401 when wrong token is provided', async () => {
        const res = await request
          .delete(`/api/users/${user.user_id}`)
          .set('Authorization', `Bearer ${token}fake token`);
        expect(res.status).toBe(401);
      });
    });
  });
});
