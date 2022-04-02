import UserModel from '../user.model';
import User from '../../types/user.type';
import db from '../../database';

const userModel = new UserModel();

describe('test user model', () => {
  describe('test existing methods', () => {
    it('create method should be exist', () => {
      expect(userModel.create).toBeDefined();
    });
    it('getMany method should be exist', () => {
      expect(userModel.getMany).toBeDefined();
    });
    it('getOne method should be exist', () => {
      expect(userModel.getOne).toBeDefined();
    });
    it('update method should be exist', () => {
      expect(userModel.update).toBeDefined();
    });
    it('delete method should be exist', () => {
      expect(userModel.delete).toBeDefined();
    });
  });

  describe('test user model crud logic', () => {
    const user = {
      first_name: 'ahmed',
      last_name: 'elsheikh',
      email: 'ahmed@gmail.com',
      password: '2018/11/16',
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

    describe('test create method', () => {
      it('create method should create user', async () => {
        const user2 = {
          first_name: 'braa',
          last_name: 'elsheikh',
          email: 'braa@gmail.com',
          password: '2019/09/09',
        } as User;
        const createUser = await userModel.create(user2);
        user2.user_id = createUser.user_id;
        expect(createUser?.email).toBe(user2.email);
        expect(createUser.first_name).toBe(user2.first_name);
        expect(createUser?.last_name).toBe(user2.last_name);
      });
    });

    describe('test getOne method', () => {
      it('getOne method result should match user object properties', async () => {
        const getUser = await userModel.getOne(user.user_id as string);
        expect(getUser.user_id).toEqual(user.user_id);
        expect(getUser.email).toEqual(user.email);
        expect(getUser.first_name).toEqual(user.first_name);
        expect(getUser.last_name).toEqual(user.last_name);
      });
      it('should return not found message when wrong id passed', async () => {
        const getUser = await userModel.getOne('wrong_id');
        expect(getUser).toEqual(
          jasmine.objectContaining({
            status: 404,
            message: 'user not found',
          })
        );
      });
    });

    describe('test get all method', () => {
      it('users length should be 2', async () => {
        const users = await userModel.getMany();
        expect(users.length).toBe(2);
      });
    });

    describe('test update method', () => {
      it('should update the user data', async () => {
        const updatedUser = {
          ...user,
          first_name: 'ahmed2',
          last_name: 'mohammed',
        } as User;
        const result = await userModel.update(updatedUser);
        expect(result.email).toBe(user.email);
        expect(result.first_name).toBe(updatedUser.first_name);
        expect(result.last_name).toBe(updatedUser.last_name);
      });
    });

    describe('test delete method', () => {
      it('delete method should delete user from DB', async () => {
        const result = await userModel.delete(user.user_id as string);
        expect(result).toBeUndefined();
      });
    });
  });
});
