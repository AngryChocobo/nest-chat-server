import * as jwt from 'jsonwebtoken';

const SECRET_KEY = 'awd';

export const generateToken = (id: any): string => jwt.sign(id, SECRET_KEY);
