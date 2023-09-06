import { IAuthDocument } from './authDocument.interface';

export interface IAuthJob {
	key?: string;
	value?: string | IAuthDocument;
	// puede que hayan definiciones pendientes
}
