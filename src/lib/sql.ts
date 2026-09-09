import { DatabaseSync } from 'node:sqlite';

export class Sql {
	filename: string;
	db: DatabaseSync;

	constructor(filename: string) {
		this.filename = filename;
		this.db = new DatabaseSync(this.filename, { enableForeignKeyConstraints: true });
	}

	open() {
		this.db.open()
	}

	close() {
		this.db.close();
	}

	get<T = any>(query: string, data: Record<string, any> = {}) {
		const rows = this.db.prepare(query).all(data);
		return rows.map((row) => ({ ...row }) as T);
	}

	getOne<T = any>(query: string, data: Record<string, any> = {}) {
		const row = this.db.prepare(query).get(data);
		return row ? ({ ...row } as T) : null;
	}

	set(query: string, data: Record<string, any> = {}) {
		const res = this.db.prepare(query).run(data);
		return res;
	}

	run(query: string) {
		this.db.exec(query);
	}

  beginTransaction() {
    this.db.exec('BEGIN TRANSACTION;')
  }

  commitTransaction() {
    this.db.exec('COMMIT;')
  }
}
