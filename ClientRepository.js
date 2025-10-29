import fs from "fs";
import yaml from "js-yaml";
import { Client, ClientShort } from "./Client.js";
import { DatabaseConnection } from "./DatabaseConnection.js";

class ClientRepositoryBase {
  #filePath;
  #clients = [];

  constructor(filePath) {
    this.#filePath = filePath;
    this.load();
  }

  load() {
  }

  save() {
  }

  getById(id) {
    return this.#clients.find((c) => c.clientId === id) || null;
  }

  get_k_n_short_list(k, n) {
    const start = (n - 1) * k;
    const end = start + k;
    const slice = this.#clients.slice(start, end);
    return slice.map((c) => new ClientShort(c.clientId, c.fullName, c.phone));
  }

  sortByField(field = "fullName") {
    const validFields = ["clientId", "fullName", "phone", "email", "address"];
    if (!validFields.includes(field)) {
      throw new Error(`Cannot sort by field "${field}"`);
    }

    this.#clients.sort((a, b) => {
      const valA = a[field];
      const valB = b[field];
      if (typeof valA === "string") return valA.localeCompare(valB);
      return valA - valB;
    });
    this.save();
  }

  add(clientObj) {
    const maxId = this.#clients.length
      ? Math.max(...this.#clients.map((c) => c.clientId))
      : 0;

    const newClient = new Client({
      clientId: maxId + 1,
      fullName: clientObj.fullName,
      phone: clientObj.phone,
      email: clientObj.email,
      address: clientObj.address,
    });

    this.#clients.push(newClient);
    this.save();
    return newClient;
  }

  replaceById(id, newData) {
    const index = this.#clients.findIndex((c) => c.clientId === id);
    if (index === -1) throw new Error(`Client with ID=${id} not found`);

    const updated = new Client({
      clientId: id,
      fullName: newData.fullName,
      phone: newData.phone,
      email: newData.email,
      address: newData.address,
    });

    this.#clients[index] = updated;
    this.save();
    return updated;
  }

  deleteById(id) {
    const index = this.#clients.findIndex((c) => c.clientId === id);
    if (index === -1) throw new Error(`Client with ID=${id} not found`);
    this.#clients.splice(index, 1);
    this.save();
  }

  get_count() {
    return this.#clients.length;
  }

  get clients() {
    return this.#clients;
  }

  set clients(value) {
    this.#clients = value;
  }

  get filePath() {
    return this.#filePath;
  }
}

export class Client_rep_json extends ClientRepositoryBase {
  load() {
    if (!fs.existsSync(this.filePath)) {
      this.clients = [];
      return;
    }
    const data = fs.readFileSync(this.filePath, "utf-8");
    const arr = JSON.parse(data);
    this.clients = arr.map((obj) => new Client(obj));
  }

  save() {
    const arr = this.clients.map((c) => ({
      clientId: c.clientId,
      fullName: c.fullName,
      phone: c.phone,
      email: c.email,
      address: c.address,
    }));
    fs.writeFileSync(this.filePath, JSON.stringify(arr, null, 2), "utf-8");
  }
}

export class Client_rep_yaml extends ClientRepositoryBase {
  load() {
    if (!fs.existsSync(this.filePath)) {
      this.clients = [];
      return;
    }
    const data = fs.readFileSync(this.filePath, "utf-8");
    const arr = yaml.load(data) || [];
    this.clients = arr.map((obj) => new Client(obj));
  }

  save() {
    const arr = this.clients.map((c) => ({
      clientId: c.clientId,
      fullName: c.fullName,
      phone: c.phone,
      email: c.email,
      address: c.address,
    }));
    const yamlStr = yaml.dump(arr);
    fs.writeFileSync(this.filePath, yamlStr, "utf-8");
  }
}

export class Client_rep_DB {
  #db;
  constructor(config) {
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

    return res.rows.map(
      (row) => new ClientShort(row.client_id, row.full_name, row.phone)
    );
  }

  async add(clientObj) {
    try {
      const res = await this.#db.query(
        `INSERT INTO clients (full_name, phone, email, address)
         VALUES ($1, $2, $3, $4)
         RETURNING client_id`,
        [clientObj.fullName, clientObj.phone, clientObj.email, clientObj.address]
      );
      const newId = res.rows[0].client_id;
      return new Client({
        clientId: newId,
        fullName: clientObj.fullName,
        phone: clientObj.phone,
        email: clientObj.email,
        address: clientObj.address,
      });
    } catch (err) {
        console.warn(err);
        throw err;
      
    }
  }

  async replaceById(id, newData) {
    const res = await this.#db.query(
      `UPDATE clients 
       SET full_name = $1, phone = $2, email = $3, address = $4
       WHERE client_id = $5 RETURNING client_id`,
      [newData.fullName, newData.phone, newData.email, newData.address, id]
    );
    if (res.rowCount === 0) throw new Error(`Client with ID=${id} not found`);

    return new Client({
      clientId: id,
      fullName: newData.fullName,
      phone: newData.phone,
      email: newData.email,
      address: newData.address,
    });
  }

  async deleteById(id) {
    const res = await this.#db.query("DELETE FROM clients WHERE client_id = $1", [id]);
    if (res.rowCount === 0) throw new Error(`Client with ID=${id} not found`);
  }

  async get_count() {
    const res = await this.#db.query("SELECT COUNT(*) FROM clients");
    return parseInt(res.rows[0].count, 10);
  }
}