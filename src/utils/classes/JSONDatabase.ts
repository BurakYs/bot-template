import fs from 'node:fs';

type JSONDatabaseOptions = {
  path: string;
  cache?: boolean;
}

export default class JSONDatabase {
  path: string;
  private cache?: Record<string, unknown>;

  constructor(options: JSONDatabaseOptions) {
    this.path = options.path;
    this.cache = options.cache ? {} : undefined;

    const fileExists = fs.existsSync(this.path);
    if (!fileExists && !this.cache) {
      const folderPath = this.path.substring(0, this.path.lastIndexOf('/'));
      fs.mkdirSync(folderPath, { recursive: true });
      fs.writeFileSync(this.path, '{}');

      if (this.cache) this.cache = {};
    } else {
      if (this.cache) {
        this.cache = this.path ? JSON.parse(fs.readFileSync(this.path, 'utf8')) : {};
      }
    }
  }

  all() {
    return this.cache || JSON.parse(fs.readFileSync(this.path, 'utf8'));
  }

  set<T>(key: string, value: T): T {
    const keys = key.split('.');
    let current = this.all();

    for (const key of keys.slice(0, -1)) {
      current[key] = current[key] || {};
      current = current[key];
    }

    current[keys[keys.length - 1]] = value;

    if (!this.cache) {
      fs.writeFileSync(this.path, JSON.stringify(current, null, 2));
    } else {
      this.cache = current;
    }

    return value;
  }

  get<T>(key: string): T | null {
    const keys = key.split('.') || [];
    let current = this.all();

    for (const key of keys) {
      if (current[key] !== undefined) {
        current = current[key];
      } else {
        return null;
      }
    }

    return current;
  }

  push<T>(key: string, value: T): T {
    let currentValue = this.get<T[]>(key);

    if (!Array.isArray(currentValue)) currentValue = [];

    currentValue.push(value);
    this.set(key, currentValue);

    return value;
  }

  delete(key: string) {
    this.set(key, undefined);
  }

  add<T extends number>(key: string, value: T): T {
    if (isNaN(value)) throw new Error('Value must be a number');

    const currentValue = this.get<T>(key) || 0;
    this.set(key, currentValue + value);

    return value;
  }

  subtract<T extends number>(key: string, value: T): T {
    return this.add(key, -value as T);
  }

  destroy() {
    this.cache = {};
    fs.writeFileSync(this.path, '{}');
  }
}