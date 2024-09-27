import { validateUsernameAndPassword } from './validations.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import DBLocal from 'db-local';

const { Schema } = new DBLocal({ path: './local-database' });

const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

export class UserRepository {
  static async create({ username, password }) {
    validateUsernameAndPassword(username, password);

    const user = User.findOne({ username });
    if (user) {
      throw new Error('Username already exists');
    }

    const id = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash(password, 10);

    User.create({ _id: id, username, password: hashedPassword }).save();

    return id;
  }

  static async login({ username, password }) {
    validateUsernameAndPassword(username, password);

    const user = User.findOne({ username });
    if (!user) {
      throw new Error('Username does not exists');
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      throw new Error('Password is invalid');
    }

    return user._id;
  }
}
