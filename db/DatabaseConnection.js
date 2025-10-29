import { Client as PgClient } from "pg";

export class DatabaseConnection {
  static #instance = null;
  #client = null;
  #connected = false;

  constructor(config) {
    if (DatabaseConnection.#instance) {
      return DatabaseConnection.#instance;
    }

    this.config = config || {
      host: "localhost",
      user: "viktoria",
      password: "",
      database: "postgres",
      port: 5432,
    };

    this.#client = new PgClient(this.config);
    DatabaseConnection.#instance = this;
  }

  async connect() {
    if (!this.#connected) {
      await this.#client.connect();
      this.#connected = true;
      console.log("Подключено к PostgreSQL");
    }
  }

  async query(sql, params = []) {
    if (!this.#connected)
      throw new Error("Нет подключения к базе данных. Сначала вызовите connect().");
    return this.#client.query(sql, params);
  }

  async close() {
    if (this.#connected) {
      await this.#client.end();
      this.#connected = false;
      console.log("Соединение закрыто");
    }
  }

  static getInstance(config) {
    if (!DatabaseConnection.#instance) {
      DatabaseConnection.#instance = new DatabaseConnection(config);
    }
    return DatabaseConnection.#instance;
  }
}
