import UserModel from '../user.model';
import User from '../../types/user.type';
import db from '../../database';

const userModel = new UserModel();

describe('Auth Model', () => {
  describe('test method exist', () => {
    it('authentication method should be exist', () => {
      expect(userModel.authenticate).toBeDefined();
    });
  });

  describe('test auth logic', () => {
    const user = {
      first_name: 'ahmed',
      last_name: 'elsheikh',
      email: 'ahmed@gmail.com',
      password: 'ahmed1712',
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

    describe('test correct credentials', () => {
      it('auth method should return authenticated user', async () => {
        const authenticatedUser = await userModel.authenticate({
          email: user.email,
          password: user.password,
        });
        expect(authenticatedUser?.email).toBe(user.email);
        expect(authenticatedUser?.first_name).toBe(user.first_name);
        expect(authenticatedUser?.last_name).toBe(user.last_name);
      });
    });

    describe('test wrong credentials', () => {
      it('auth method should return null for wrong password', async () => {
        const authenticatedUser = await userModel.authenticate({
          email: user.email,
          password: 'fake password',
        });
        expect(authenticatedUser).toBe(null);
      });
      it('auth method should return null for wrong email', async () => {
        const authenticatedUser = await userModel.authenticate({
          email: 'fakeEmail@fake.com',
          password: user.password,
        });
        expect(authenticatedUser).toBe(null);
      });
    });
  });
});
