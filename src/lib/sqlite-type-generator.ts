import { DatabaseSync } from 'node:sqlite';
import { readFileSync, writeFileSync } from 'node:fs';

const dbText = readFileSync('./src/db/Schema.sql', 'utf-8');
const typesFilename = './src/lib/types/db-types.ts';

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

function generateTypes() {
	const defDB = new DatabaseSync(':memory:', { enableForeignKeyConstraints: true });
	defDB.exec(dbText);
	const defTables = defDB
		.prepare(
			`SELECT name, sql FROM sqlite_schema
      WHERE type = 'table' AND name != 'sqlite_sequence'`
		)
		.all() as unknown as TableSQL[];

	const types = [];
	for (const defTable of defTables) {
		const columns = defDB
			.prepare(`pragma table_info(${defTable.name})`)
			.all() as unknown as ColumnInfo[];
		types.push(`interface ${getTableName(defTable.name)} {
${columns.map((col) => getTypeText(col)).join('\n')}
}`);
	}
	writeFileSync(typesFilename, types.join('\n\n'));
}

function getTableName(name: string) {
  const words = name.split('_');
  return words.map((w) => (w[0].toUpperCase() + w.substring(1))).join('')
}

function getTypeText(col: ColumnInfo) {
	let text = `  ${col.name}: `;
	if (col.type === 'TEXT') {
		text += 'string;';
	} else if (col.type === 'INTEGER' || col.type === 'REAL') {
		text += 'number;';
	}
	return text;
}

generateTypes();
