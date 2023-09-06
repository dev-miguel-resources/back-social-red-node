import { IUserDocument } from './userDocument.interface';

export interface IUserJob {
	key?: string;
	value?: string | IUserDocument;
	// puede que hayan definiciones pendientes
}
