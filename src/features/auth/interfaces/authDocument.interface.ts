import { Document } from 'mongoose';
import { ObjectId } from 'mongodb';

// Design Pattern: Security For Design
export interface IAuthDocument extends Document {
	_id: string | ObjectId;
	uId: string;
	username: string;
	email: string;
	password?: string;
	avatarColor: string;
	createdAt: Date;
	passwordResetToken?: string;
	passwordResetExpires?: number | string;
	comparePassword(password: string): Promise<boolean>;
}
