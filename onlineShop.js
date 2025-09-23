class Client {
  #clientId;
  #fullName;
  #phone;
  #email;
  #address;

  constructor(...args) {
    if (args.length === 1 && typeof args[0] === "string") {
      const data = args[0].trim();

      if (data.startsWith("{") && data.endsWith("}")) {
        this._initFromJSON(data);
      } else if (data.startsWith("<") && data.endsWith(">")) {
        this._initFromXML(data);
      } else {
        this._initFromString(data);
      }

    } else if (args.length === 1 && typeof args[0] === "object" && args[0] !== null) {
      this._initFromObject(args[0]);
    } else if (args.length === 5) {
      this._initFromParams(...args);
    } else {
      throw new Error("Некорректный формат аргументов конструктора Client");
    }
  }

  _initFromParams(clientId, fullName, phone, email, address) {
    this.#clientId = Client.validateId(clientId);
    this.#fullName = Client.validateNonEmptyString(fullName, "ФИО");
    this.#phone = Client.validatePhone(phone);
    this.#email = Client.validateEmail(email);
    this.#address = Client.validateNonEmptyString(address, "Адрес");
  }

  _initFromObject(obj) {
    this._initFromParams(obj.clientId, obj.fullName, obj.phone, obj.email, obj.address);
  }

  _initFromString(str) {
    const parts = str.split(";");
    if (parts.length !== 5) {
      throw new Error("Строка должна быть вида: id;ФИО;телефон;email;адрес");
    }

    const [idStr, fullName, phone, email, address] = parts;
    const id = parseInt(idStr, 10);
    if (isNaN(id)) {
      throw new Error("ID должен быть числом");
    }

    this._initFromParams(id, fullName, phone, email, address);
  }

  _initFromJSON(jsonString) {
    let obj;
    try {
      obj = JSON.parse(jsonString);
    } catch {
      throw new Error("Некорректный JSON");
    }
    this._initFromObject(obj);
  }
  _initFromXML(xmlString) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(xmlString, "application/xml");

    if (doc.querySelector("parsererror")) {
      throw new Error("Некорректный XML");
    }

    const clientId = parseInt(doc.querySelector("clientId")?.textContent, 10);
    const fullName = doc.querySelector("fullName")?.textContent;
    const phone = doc.querySelector("phone")?.textContent;
    const email = doc.querySelector("email")?.textContent;
    const address = doc.querySelector("address")?.textContent;

    this._initFromParams(clientId, fullName, phone, email, address);
  }

  get clientId() { return this.#clientId; }
  get fullName() { return this.#fullName; }
  get phone()    { return this.#phone; }
  get email()    { return this.#email; }
  get address()  { return this.#address; }

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

  static validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Некорректный email");
    }
    return email;
  }
}