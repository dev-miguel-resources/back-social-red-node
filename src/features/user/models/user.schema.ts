import { IUserDocument } from '../interfaces/userDocument.interface';
import mongoose, { model, Model, Schema } from 'mongoose';

const userSchema: Schema = new Schema({
	authId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auth' },
	profilePicture: { type: String, default: '' },
	postsCount: { type: Number, default: 0 },
	followersCount: { type: Number, default: 0 },
	followingCount: { type: Number, default: 0 },
	blocked: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	blockedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	notifications: {
		messages: { type: Boolean, default: true },
		reactions: { type: Boolean, default: true },
		comments: { type: Boolean, default: true },
		follows: { type: Boolean, default: true }
	},
	social: {
		facebook: { type: String, default: true },
		instagram: { type: String, default: true },
		twitter: { type: String, default: true },
		youtube: { type: String, default: true }
	},
	work: { type: String, default: '' },
	school: { type: String, default: '' },
	location: { type: String, default: '' },
	quote: { type: String, default: '' },
	bgImageVersion: { type: String, default: '' },
	bgImageId: { type: String, default: '' }
});

const UserModel: Model<IUserDocument> = model<IUserDocument>('User', userSchema, 'User');
export { UserModel };