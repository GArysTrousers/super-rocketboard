import { z } from 'zod';
import { readFileSync, accessSync, writeFileSync } from 'node:fs';
import { building } from '$app/environment';
import { v4 as uuid } from 'uuid';
import prompt from "prompt-sync";

const envSchema = z.object({
	MODE: z.enum(['normal', 'docker']).default('normal')
});

export const env = envSchema.parse(process.env);

const configSchema = z
	.object({
		dataDir: z.string(),
		jwtSecret: z.string(),
    cookieName: z.string(),
    sessionLengthInDays: z.number(),
		admin: z.object({
			username: z.string(),
			password: z.string()
		}),
    user: z.object({
			username: z.string(),
			password: z.string()
		}),
	})
	.default({
		dataDir: '.',
		jwtSecret: uuid(),
    cookieName: 'session',
    sessionLengthInDays: 7,
		admin: {
			username: 'admin',
			password: 'admin'
		},
    user: {
			username: 'user',
			password: 'user'
		}
	});

let configFile = '';
if (env.MODE === 'normal') configFile = './config.json';
else if (env.MODE === 'docker') configFile = '/data/config.json';

function readConfig() {
	if (building) return configSchema.parse(undefined);
	try {
		accessSync(configFile);
	} catch (e) {
		console.log('No config found, creating empty config...');
		writeFileSync(configFile, JSON.stringify(configSchema.parse(undefined), null, 2));
    
		console.log('\nOpen ./config.json and fill in your config details, then relaunch.\n');
    
    prompt()('--- Press "Enter" to exit ---')
    process.exit()
	}
	const configText = readFileSync(configFile).toString();
	try {
		return configSchema.parse(JSON.parse(configText));
	} catch (e) {
		console.log(e);
		process.exit();
	}
}

export const config = readConfig();
