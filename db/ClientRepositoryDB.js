import { DatabaseConnection } from "./DatabaseConnection.js";
import { ClientRepositoryBase } from "../ClientRepository.js";
import { Client, ClientShort } from "../Client.js";

export class Client_rep_DB extends ClientRepositoryBase {
  #db;

  constructor(config) {
    super(null);
    this.#db = DatabaseConnection.getInstance(config);
  }

  async connect() {
    await this.#db.connect();
  }
  async close() {
    await this.#db.close();
  }

  async getById(id) {
    const res = await this.#db.query(
      "SELECT client_id, full_name, phone, email, address FROM clients WHERE client_id = $1",
      [id]
    );
    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    return new Client({
      clientId: row.client_id,
      fullName: row.full_name,
      phone: row.phone,
      email: row.email,
      address: row.address,
    });
  }

  async get_k_n_short_list(k, n) {
    const offset = (n - 1) * k;
    const res = await this.#db.query(
      "SELECT client_id, full_name, phone FROM clients ORDER BY client_id LIMIT $1 OFFSET $2",
      [k, offset]
    );
    return res.rows.map((row) => new ClientShort(row.client_id, row.full_name, row.phone));
  }

  async add(clientObj) {
    const res = await this.#db.query(
      `INSERT INTO clients (full_name, phone, email, address)
       VALUES ($1, $2, $3, $4)
       RETURNING client_id`,
      [clientObj.fullName, clientObj.phone, clientObj.email, clientObj.address]
    );
    const newId = res.rows[0].client_id;
    return new Client({ clientId: newId, ...clientObj });
  }

  async replaceById(id, newData) {
    const res = await this.#db.query(
      `UPDATE clients 
       SET full_name = $1, phone = $2, email = $3, address = $4
       WHERE client_id = $5 RETURNING client_id`,
      [newData.fullName, newData.phone, newData.email, newData.address, id]
    );
    if (res.rowCount === 0) throw new Error(`Client with ID=${id} not found`);
    return new Client({ clientId: id, ...newData });
  }

  async deleteById(id) {
    const res = await this.#db.query("DELETE FROM clients WHERE client_id = $1", [id]);
    if (res.rowCount === 0) throw new Error(`Client with ID=${id} not found`);
  }

  async get_count() {
    const res = await this.#db.query("SELECT COUNT(*) FROM clients");
    return parseInt(res.rows[0].count, 10);
  }

  async query(sql, params = []) {
    return await this.#db.query(sql, params);
  }
}
