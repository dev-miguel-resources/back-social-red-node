import { IAuthDocument } from '@auth/interfaces/authDocument.interface';

export const authMock = {
	_id: '6511887d9abf97b418016e6f',
	uId: '111637198830',
	username: 'Facu',
	password: 'facdev',
	email: 'facdev@gmail.com',
	avatarColor: 'red',
	createdAt: new Date(),
	save: () => {}
} as IAuthDocument;
