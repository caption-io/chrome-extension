import { nanoid } from 'nanoid'
export function uuidGenerator() {
	return nanoid(16);
};