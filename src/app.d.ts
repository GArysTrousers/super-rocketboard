// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			session: {
				data: AppSession | null;
				logout: boolean;
			};
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};

export type AppSession = {
	timestamp: number;
	username: string;
	type: 'user' | 'admin' | 'none';
};
