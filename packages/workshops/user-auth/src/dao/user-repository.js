import { fileURLToPath } from 'url';
import { HASH_ROUNDS } from '../config.js';
import { validateUsernameAndPassword } from '../utils/validations.js';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import DBLocal from 'db-local';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const { Schema } = new DBLocal({
  path: path.join(__dirname, 'local-database'),
});

const User = Schema('User', {
  _id: { type: String, required: true },
  username: { type: String, required: true },
  password: { type: String, required: true },
});

export class UserRepository {
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

    const { password: _, ...publicUserInfo } = user;

    return publicUserInfo;
  }

  static async create({ username, password }) {
    validateUsernameAndPassword(username, password);

    const user = User.findOne({ username });
    if (user) {
      throw new Error('Username already exists');
    }

    const id = crypto.randomUUID();
    const hashedPassword = await bcrypt.hash(password, HASH_ROUNDS);

    User.create({
      _id: id,
      username,
      password: hashedPassword,
    }).save();
  }
}
