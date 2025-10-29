import { ClientRepositoryBase } from "../ClientRepository.js";
import { Client_rep_DB } from "../db/ClientRepositoryDB.js";
import { ClientShort } from "../Client.js";
import { ClientRepositoryDecorator } from "../decorators/ClientRepositoryDecorator.js";

export class Client_rep_DB_adapter extends ClientRepositoryBase {
  #dbRepo;
  constructor(config) {
    super(null);
    this.#dbRepo = new Client_rep_DB(config);
  }

  async connect() {
    await this.#dbRepo.connect();
  }
  async close() {
    await this.#dbRepo.close();
  }

  async getById(id) {
    return await this.#dbRepo.getById(id);
  }
  async get_k_n_short_list(k, n) {
    return await this.#dbRepo.get_k_n_short_list(k, n);
  }
  async add(clientObj) {
    return await this.#dbRepo.add(clientObj);
  }
  async replaceById(id, data) {
    return await this.#dbRepo.replaceById(id, data);
  }
  async deleteById(id) {
    return await this.#dbRepo.deleteById(id);
  }
  async get_count() {
    return await this.#dbRepo.get_count();
  }

  async query(sql, params = []) {
    return await this.#dbRepo.query(sql, params);
  }
}

export class Client_rep_DB_decorator extends ClientRepositoryDecorator {
  async get_k_n_short_list(k, n) {
    const offset = (n - 1) * k;
    let query = `SELECT client_id, full_name, phone FROM clients`;
    const params = [];

    if (this.filter?.field && this.filter?.value) {
      query += ` WHERE ${this.filter.field} ILIKE $1`;
      params.push(`%${this.filter.value}%`);
    }

    query += ` ORDER BY ${this.sort?.field || "client_id"} ${this.sort?.direction || "ASC"}`;
    query += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(k, offset);

    const res = await this.repo.query(query, params);
    return res.rows.map((row) => new ClientShort(row.client_id, row.full_name, row.phone));
  }

  async get_count() {
    let query = `SELECT COUNT(*) FROM clients`;
    const params = [];

    if (this.filter?.field && this.filter?.value) {
      query += ` WHERE ${this.filter.field} ILIKE $1`;
      params.push(`%${this.filter.value}%`);
    }

    const res = await this.repo.query(query, params);
    return parseInt(res.rows[0].count, 10);
  }
}
