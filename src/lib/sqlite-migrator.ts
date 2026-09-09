import { DatabaseSync } from 'node:sqlite';

interface ColumnInfo {
	cid: number;
	name: string;
	type: 'TEXT' | 'INTEGER' | 'REAL';
	notnull: 1 | 0;
	dflt_value: any;
	pk: 1 | 0;
}

interface TableSQL {
	name: string;
	sql: string;
}

function showDb(dbName: string, db: DatabaseSync, showData: boolean) {
	console.log(dbName);
	const tables = db
		.prepare(
			`SELECT name, sql FROM sqlite_schema
    WHERE type = 'table' AND name != 'sqlite_sequence'`,
		)
		.all() as unknown as TableSQL[];
	for (const table of tables) {
		const data = db.prepare(`SELECT * FROM ${table.name}`).all();
		console.log(table.name, data.length);
		const columns = db.prepare(`pragma table_info(${table.name})`).all() as unknown as ColumnInfo[];
		console.log(columns.map((v) => v.name));
		if (showData) {
			console.log(...data);
		}
	}
	console.log();
}

export function migrateDb(dbPath: string, schema: string) {
	const defDB = new DatabaseSync(':memory:', { enableForeignKeyConstraints: true });
	const curDB = new DatabaseSync(dbPath, { enableForeignKeyConstraints: false });

	defDB.exec(schema);

	// showDb('Def', defDB, false)
	// showDb('Cur Before', curDB, false)
	// console.log();

	const defTables = defDB
		.prepare(
			`SELECT name, sql FROM sqlite_schema
      WHERE type = 'table' AND name != 'sqlite_sequence'`,
		)
		.all() as unknown as TableSQL[];
	const curTables = curDB
		.prepare(
			`SELECT name, sql FROM sqlite_schema
      WHERE type = 'table' AND name != 'sqlite_sequence'`,
		)
		.all() as unknown as TableSQL[];

	for (const defTable of defTables) {
		const curTable = curTables.find((v) => v.name === defTable.name);
		if (curTable === undefined) {
			// its a new table and should be created
			console.log('new table:', defTable.name);
			curDB.prepare(defTable.sql).run();
			continue;
		}
		if (defTable.sql !== curTable.sql) {
			// table exists but is different
			console.log('change table:', defTable.name);
			//get data from old table
			const columnNames = (defDB.prepare(`pragma table_info(${defTable.name})`).all() as unknown as ColumnInfo[]).map((v) => v.name);
			const data = curDB.prepare(`SELECT * FROM ${curTable.name}`).all();
			try {
				curDB.exec('BEGIN');
				//create new table
				curDB.prepare(defTable.sql.replace(defTable.name, `new_${defTable.name}`)).run();
				//insert data to new table
				for (const row of data) {
					const k = Object.keys(row).filter((v) => columnNames.includes(v));
					const insert = curDB.prepare(`INSERT INTO new_${curTable.name} (${k.join(',')}) VALUES (:${k.join(',:')})`);
					insert.setAllowUnknownNamedParameters(true);
					insert.run(row);
				}
				//delete old table
				curDB.prepare(`DROP TABLE ${curTable.name}`).run();
				//rename new table
				curDB.prepare(`ALTER TABLE new_${defTable.name} RENAME TO ${defTable.name}`).run();
				//check foreign keys
				curDB.exec('PRAGMA foreign_key_check');
				curDB.exec('COMMIT');
			} catch (e) {
				curDB.exec('ROLLBACK');
				console.error('change failed:', e);
			}
		}
	}

	for (const curTable of curTables) {
		const defTable = defTables.find((v) => v.name === curTable.name);
		if (defTable === undefined) {
			// table no longer exists and should be deleted
			console.log('delete table:', curTable.name);
			curDB.prepare(`DROP TABLE ${curTable.name}`).run();
		}
	}

	// console.log();
	// showDb('Cur After', curDB, false)
}
