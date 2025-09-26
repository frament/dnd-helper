// property-path.utils.ts
export type PropertyPath<T> = T extends object ? {
  [K in keyof T]: K extends string | number
    ? T[K] extends object
      ? `${K}` | `${K}.${PropertyPath<T[K]>}`
      : `${K}`
    : never;
}[keyof T] : never;

export class PropertyPathHelper {
  /**
   * Получает значение из объекта по пути
   */
  static getValueByPath<T>(obj: T, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj as any);
  }

  /**
   * Устанавливает значение в объекте по пути
   */
  static setValueByPath<T>(obj: T, path: string, value: any): T {
    const pathParts = path.split('.');
    const newObj = this.deepClone(obj);

    let current: any = newObj;
    for (let i = 0; i < pathParts.length - 1; i++) {
      if (!current[pathParts[i]]) {
        current[pathParts[i]] = {};
      }
      current = current[pathParts[i]];
    }

    current[pathParts[pathParts.length - 1]] = value;
    return newObj;
  }

  /**
   * Проверяет существование пути в объекте
   */
  static hasPath<T>(obj: T, path: string): boolean {
    const pathParts = path.split('.');
    let current: any = obj;

    for (const part of pathParts) {
      if (current && current.hasOwnProperty(part)) {
        current = current[part];
      } else {
        return false;
      }
    }

    return true;
  }

  private static deepClone<T>(obj: T): T {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as unknown as T;

    if (Array.isArray(obj)) {
      return obj.map(item => this.deepClone(item)) as unknown as T;
    }

    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        (cloned as any)[key] = this.deepClone((obj as any)[key]);
      }
    }

    return cloned;
  }
}
