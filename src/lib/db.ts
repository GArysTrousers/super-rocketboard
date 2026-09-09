import { Sql } from './sql';
import { config } from './config';
import { building } from '$app/environment';
import schemaSql from '../db/Schema.sql?raw';
import initDataSql from '../db/InitData.sql?raw';
import { rmSync, existsSync } from 'node:fs';
import { migrateDb } from './sqlite-migrator';

export function checkDb(dbPath: string, onExist: 'migrate' | 'delete') {
	console.log(dbPath, existsSync(dbPath));
	if (existsSync(dbPath)) {
		if (onExist === 'migrate') {
			console.log('running migrate...');
			migrateDb(dbPath, schemaSql);
      console.log('migration finished')
		} else {
			console.log('deleting old db');
			rmSync(dbPath);
		}
	} else {
		initDb(dbPath);
	}
}

export function initDb(dbPath: string) {
	try {
		existsSync(config.dataDir);
	} catch (e) {
		throw Error(`Data dir doesn't exist: ${config.dataDir}`);
	}
	console.log('creating new db', dbPath);
	const db = new Sql(dbPath);
	console.log('creating tables');
	db.run(schemaSql);
	console.log('loading init data');
	db.run(initDataSql);
}

if (!building) checkDb(`${config.dataDir}/db.sqlite`, 'migrate');

export const sql = new Sql(`${config.dataDir}/db.sqlite`);
