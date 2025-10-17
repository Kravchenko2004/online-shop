class ClientBase {
  #clientId;
  #fullName;
  #phone;

  constructor(clientId, fullName, phone) {
    this.#clientId = ClientBase.validateId(clientId);
    this.#fullName = ClientBase.validateFullName(fullName);
    this.#phone = ClientBase.validatePhone(phone);
  }

  _initBase(clientId, fullName, phone) {
    this.#clientId = ClientBase.validateId(clientId);
    this.#fullName = ClientBase.validateFullName(fullName);
    this.#phone = ClientBase.validatePhone(phone);
  }

  get clientId() {
    return this.#clientId;
  }
  get fullName() {
    return this.#fullName;
  }
  get phone() {
    return this.#phone;
  }

  toStringShort() {
    return `Client ${this.#clientId}: ${this.#fullName} (${this.#phone})`;
  }

  equals(other) {
    return other instanceof ClientBase && this.#clientId === other.#clientId;
  }

  static validateNonEmptyString(value, fieldName = "Поле") {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error(`${fieldName} должно быть непустой строкой`);
    }
    return value.trim();
  }

  static validateId(id) {
    if (!Number.isInteger(id) || id <= 0) {
      throw new Error("ID должен быть положительным целым числом");
    }
    return id;
  }

  static validatePhone(phone) {
    const phoneRegex = /^\+?[0-9]{7,15}$/;
    if (!phoneRegex.test(phone)) {
      throw new Error("Телефон должен содержать от 7 до 15 цифр");
    }
    return phone;
  }

  static validateFullName(fullName) {
    const value = this.validateNonEmptyString(fullName, "ФИО");
    const regex = /^[A-Za-zА-Яа-яЁё\s-]+$/;
    if (!regex.test(value)) {
      throw new Error("ФИО может содержать только буквы, пробелы и дефисы");
    }
    return value.trim();
  }
}

class ClientShort extends ClientBase {
  constructor(clientId, fullName, phone) {
    super(clientId, fullName, phone);
  }

  toString() {
    return `ClientShort ${this.clientId}: ${this.fullName} (${this.phone})`;
  }
}

class Client extends ClientBase {
  #email;
  #address;

  constructor(...args) {
    super(1, "temp", "+70000000000");

    if (args.length === 1 && typeof args[0] === "string") {
      const data = args[0].trim();
      if (data.startsWith("{") && data.endsWith("}")) {
        this._initFromJSON(data);
      } else if (data.startsWith("<") && data.endsWith(">")) {
        this._initFromXML(data);
      } else {
        this._initFromString(data);
      }
    } else if (
      args.length === 1 &&
      typeof args[0] === "object" &&
      args[0] !== null
    ) {
      this._initFromObject(args[0]);
    } else if (args.length === 5) {
      const [clientId, fullName, phone, email, address] = args;
      this._initFromParams(clientId, fullName, phone, email, address);
    } else {
      throw new Error("Некорректный формат аргументов конструктора Client");
    }
  }

  _initFromParams(clientId, fullName, phone, email, address) {
    this._initBase(clientId, fullName, phone);
    this.#email = Client.validateEmail(email);
    this.#address = Client.validateNonEmptyString(address, "Адрес");
  }

  _initFromObject(obj) {
    this._initFromParams(
      obj.clientId,
      obj.fullName,
      obj.phone,
      obj.email,
      obj.address
    );
  }

  _initFromString(str) {
    const parts = str.split(";");
    if (parts.length !== 5) {
      throw new Error("Строка должна быть вида: id;ФИО;телефон;email;адрес");
    }
    const [idStr, fullName, phone, email, address] = parts;
    this._initFromParams(parseInt(idStr, 10), fullName, phone, email, address);
  }

  _initFromJSON(jsonString) {
    const obj = JSON.parse(jsonString);
    this._initFromObject(obj);
  }

  _initFromXML(xmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, "application/xml");
    const clientId = parseInt(doc.querySelector("clientId")?.textContent, 10);
    const fullName = doc.querySelector("fullName")?.textContent;
    const phone = doc.querySelector("phone")?.textContent;
    const email = doc.querySelector("email")?.textContent;
    const address = doc.querySelector("address")?.textContent;
    this._initFromParams(clientId, fullName, phone, email, address);
  }

  get email() {
    return this.#email;
  }
  get address() {
    return this.#address;
  }

static validateEmail(email) {
  if (typeof email !== "string") {
    throw new Error("Email должен быть строкой");
  }
  const emailRegex = /^[A-Za-z0-9](\.?[A-Za-z0-9_-])*@[A-Za-z0-9-]+(\.[A-Za-z]{2,})+$/;
  if (!emailRegex.test(email)) {
    throw new Error("Некорректный email");
  }
  return email.trim();
}


  toStringFull() {
    return `Client ${this.clientId}: ${this.fullName}, Телефон: ${
      this.phone
    }, Email: ${this.#email}, Адрес: ${this.#address}`;
  }

}

export { ClientBase, ClientShort, Client };