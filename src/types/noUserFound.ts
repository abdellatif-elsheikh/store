type UserError = {
  status: number;
  message: string;
  user_id?: string;
  first_name?: string;
  last_name?: string;
  password?: string;
  email?: string;
};

export default UserError;
