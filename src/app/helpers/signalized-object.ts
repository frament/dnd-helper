import { signal, WritableSignal, computed, Signal } from '@angular/core';

export type TSignalizedObject<T extends object> = {
  [K in keyof T]: T[K] extends object
    ? SignalizedObject<T[K]>
    : WritableSignal<T[K]>;
};

export class SignalizedObject<T extends object> {
  private _originalObject: T;
  private _signalized: TSignalizedObject<T>;
  private _valueSignal: Signal<T>;

  constructor(obj: T) {
    this._originalObject = this.deepClone(obj);
    this._signalized = this.createSignalizedObject(obj) as TSignalizedObject<T>;
    this._valueSignal = computed(() => this.extractValues(this._signalized));
  }

  /**
   * Рекурсивно создает сигнализированную версию объекта
   */
  private createSignalizedObject<U extends object>(obj: U): TSignalizedObject<U> {
    const result: any = {};

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];

        if (this.isObject(value) && !this.isDate(value) && !Array.isArray(value)) {
          // Рекурсия для вложенных объектов
          result[key] = this.createSignalizedObject(value);
        } else if (Array.isArray(value)) {
          // Обработка массивов
          result[key] = this.createSignalizedArray(value);
        } else {
          // Примитивы - создаем сигнал
          result[key] = signal(value);
        }
      }
    }

    return result as TSignalizedObject<U>;
  }

  /**
   * Создает сигнализированную версию массива
   */
  private createSignalizedArray<U>(array: U[]): WritableSignal<U[]> | any[] {
    if (array.length === 0) {
      return signal([]);
    }

    // Если массив содержит объекты, рекурсивно обрабатываем каждый элемент
    if (this.isObject(array[0])) {
      return array.map(item =>
        this.isObject(item) ? this.createSignalizedObject(item as object) : signal(item)
      );
    }

    // Для массива примитивов создаем один сигнал для всего массива
    return signal(array);
  }

  /**
   * Извлекает значения из сигнализированного объекта
   */
  private extractValues<U>(signalizedObj: any): U {
    if (Array.isArray(signalizedObj)) {
      return signalizedObj.map((item: any) => this.extractValues(item)) as unknown as U;
    }

    if (this.isSignal(signalizedObj)) {
      // Это сигнал - возвращаем его значение
      return signalizedObj();
    }

    if (this.isObject(signalizedObj)) {
      const result: any = {};
      for (const key in signalizedObj) {
        if (signalizedObj.hasOwnProperty(key)) {
          result[key] = this.extractValues((signalizedObj as any)[key]);
        }
      }
      return result;
    }

    return signalizedObj;
  }

  /**
   * Глубокое клонирование объекта
   */
  private deepClone<U>(obj: U): U {
    if (obj === null || typeof obj !== 'object') return obj;
    if (obj instanceof Date) return new Date(obj.getTime()) as unknown as U;

    if (Array.isArray(obj)) {
      return obj.map(item => this.deepClone(item)) as unknown as U;
    }

    const cloned = {} as U;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        (cloned as any)[key] = this.deepClone((obj as any)[key]);
      }
    }

    return cloned;
  }

  /**
   * Проверяет, является ли значение объектом (но не массивом и не датой)
   */
  private isObject(value: any): value is object {
    return value !== null && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date);
  }

  /**
   * Проверяет, является ли значение датой
   */
  private isDate(value: any): value is Date {
    return value instanceof Date;
  }

  /**
   * Проверяет, является ли значение сигналом
   */
  private isSignal(value: any): value is WritableSignal<any> {
    return value && typeof value === 'object' && 'set' in value && 'subscribe' in value;
  }

  /**
   * Получает сигнал по пути свойства
   */
  getSignalByPath(path: string): WritableSignal<any> | null {
    const pathParts = path.split('.');
    let current: any = this._signalized;

    for (const part of pathParts) {
      if (current && current[part] !== undefined) {
        current = current[part];
      } else {
        return null;
      }
    }

    return this.isSignal(current) ? current : null;
  }

  /**
   * Устанавливает значение по пути свойства
   */
  setValueByPath(path: string, value: any): boolean {
    const signal = this.getSignalByPath(path);
    if (signal) {
      signal.set(value);
      return true;
    }
    return false;
  }

  /**
   * Возвращает сигнализированную версию объекта
   */
  get signalized(): TSignalizedObject<T> {
    return this._signalized;
  }

  /**
   * Возвращает computed сигнал с текущим значением объекта
   */
  get value(): Signal<T> {
    return this._valueSignal;
  }

  /**
   * Возвращает текущее значение объекта
   */
  getValue(): T {
    return this._valueSignal();
  }

  /**
   * Обновляет весь объект
   */
  update(obj: T): void {
    this._originalObject = this.deepClone(obj);
    this._signalized = this.createSignalizedObject(obj) as TSignalizedObject<T>;
    // Пересоздаем valueSignal с новым signalized объектом
    this._valueSignal = computed(() => this.extractValues(this._signalized));
  }

  /**
   * Возвращает оригинальный объект (без сигналов)
   */
  getOriginalObject(): T {
    return this.deepClone(this._originalObject);
  }

  /**
   * Сравнивает текущее значение с оригинальным объектом
   */
  hasChanges(): boolean {
    return JSON.stringify(this.getValue()) !== JSON.stringify(this._originalObject);
  }

  /**
   * Сбрасывает все изменения к оригинальному состоянию
   */
  reset(): void {
    this.update(this._originalObject);
  }

  /**
   * Создает снапшот текущего состояния
   */
  createSnapshot(): T {
    return this.deepClone(this.getValue());
  }
}
