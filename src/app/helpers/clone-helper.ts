/**
 * Создает глубокую копию объекта
 * @param obj Объект для копирования
 * @param visited Map для отслеживания циклических ссылок (внутреннее использование)
 * @returns Глубокая копия объекта
 */
export function deepClone<T>(obj: T, visited = new WeakMap()): T {
  // Обработка примитивных типов и функций
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  // Обработка циклических ссылок
  if (visited.has(obj)) {
    return visited.get(obj);
  }

  // Обработка специальных объектов
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags) as unknown as T;
  }

  if (obj instanceof Map) {
    const copy = new Map();
    visited.set(obj, copy);
    obj.forEach((value, key) => {
      copy.set(deepClone(key, visited), deepClone(value, visited));
    });
    return copy as unknown as T;
  }

  if (obj instanceof Set) {
    const copy = new Set();
    visited.set(obj, copy);
    obj.forEach(value => {
      copy.add(deepClone(value, visited));
    });
    return copy as unknown as T;
  }

  if (obj instanceof ArrayBuffer) {
    return obj.slice(0) as unknown as T;
  }

  if (ArrayBuffer.isView(obj)) {
    // Обработка TypedArrays (Uint8Array, Int32Array и т.д.)
    return new (obj.constructor as any)(
      deepClone(obj.buffer, visited),
      obj.byteOffset,
      obj.byteLength / (obj as any).BYTES_PER_ELEMENT
    );
  }

  // Обработка массивов
  if (Array.isArray(obj)) {
    const copy: any[] = [];
    visited.set(obj, copy);
    for (let i = 0; i < obj.length; i++) {
      copy[i] = deepClone(obj[i], visited);
    }
    return copy as unknown as T;
  }

  // Обработка обычных объектов
  if (typeof obj === 'object') {
    // Проверка на наличие прототипа, отличного от Object.prototype
    const proto = Object.getPrototypeOf(obj);
    if (proto !== null && proto !== Object.prototype) {
      // Для объектов с кастомным прототипом создаем новый объект с тем же прототипом
      const copy = Object.create(proto);
      visited.set(obj, copy);

      // Копируем все свойства, включая неперечисляемые
      const allProps = Object.getOwnPropertyNames(obj).concat(
        Object.getOwnPropertySymbols(obj) as any
      );

      for (const key of allProps) {
        const descriptor = Object.getOwnPropertyDescriptor(obj, key);
        if (descriptor) {
          if (descriptor.value && typeof descriptor.value === 'object') {
            descriptor.value = deepClone(descriptor.value, visited);
          }
          Object.defineProperty(copy, key, descriptor);
        }
      }

      return copy as T;
    } else {
      // Для простых объектов
      const copy = {} as any;
      visited.set(obj, copy);

      // Копируем все свойства (включая символы)
      const keys = Reflect.ownKeys(obj);
      for (const key of keys) {
        copy[key] = deepClone((obj as any)[key], visited);
      }

      return copy;
    }
  }

  // Для любых других типов возвращаем оригинал
  return obj;
}

/**
 * Проверяет, является ли значение объектом (не null и не массивом)
 */
function isObject(obj: any): boolean {
  return obj !== null && typeof obj === 'object' && !Array.isArray(obj);
}

/**
 * Создает глубокую копию объекта с возможностью обработки циклических ссылок
 * Альтернативная реализация с лучшей производительностью для простых случаев
 */
export function deepCloneSimple<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime()) as unknown as T;
  }

  if (obj instanceof RegExp) {
    return new RegExp(obj.source, obj.flags) as unknown as T;
  }

  if (obj instanceof Map) {
    const copy = new Map();
    obj.forEach((value, key) => {
      copy.set(deepCloneSimple(key), deepCloneSimple(value));
    });
    return copy as unknown as T;
  }

  if (obj instanceof Set) {
    const copy = new Set();
    obj.forEach(value => {
      copy.add(deepCloneSimple(value));
    });
    return copy as unknown as T;
  }

  if (Array.isArray(obj)) {
    return obj.map(item => deepCloneSimple(item)) as unknown as T;
  }

  if (isObject(obj)) {
    const copy = {} as any;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        copy[key] = deepCloneSimple(obj[key]);
      }
    }
    return copy;
  }

  return obj;
}

/**
 * Функция для измерения производительности глубокого копирования
 */
export function measureClonePerformance<T>(obj: T, iterations: number = 1000): {
  deepCloneTime: number,
  deepCloneSimpleTime: number,
  jsonCloneTime: number
} {
  // Замер deepClone
  const start1 = performance.now();
  for (let i = 0; i < iterations; i++) {
    deepClone(obj);
  }
  const deepCloneTime = performance.now() - start1;

  // Замер deepCloneSimple
  const start2 = performance.now();
  for (let i = 0; i < iterations; i++) {
    deepCloneSimple(obj);
  }
  const deepCloneSimpleTime = performance.now() - start2;

  // Замер JSON clone (для сравнения)
  const start3 = performance.now();
  for (let i = 0; i < iterations; i++) {
    JSON.parse(JSON.stringify(obj));
  }
  const jsonCloneTime = performance.now() - start3;

  return { deepCloneTime, deepCloneSimpleTime, jsonCloneTime };
}
