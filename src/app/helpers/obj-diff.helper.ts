/**
 * Сравнивает два объекта и возвращает различия
 * @param original Исходный объект
 * @param updated Обновленный объект
 * @param deep Флаг глубокого сравнения (по умолчанию true)
 * @returns Объект с различиями или null, если различий нет
 */
export function deepCompare(original: any, updated: any, deep: boolean = true): any {
  // Если оба объекта идентичны (включая примитивы)
  if (original === updated) {
    return null;
  }

  // Если один из объектов null или undefined
  if (original == null || updated == null) {
    return updated !== original ? updated : null;
  }

  // Если объекты разных типов
  if (typeof original !== typeof updated) {
    return updated;
  }

  // Обработка примитивных типов
  if (typeof original !== 'object') {
    return original !== updated ? updated : null;
  }

  // Обработка массивов
  if (Array.isArray(original) || Array.isArray(updated)) {
    if (!Array.isArray(original) || !Array.isArray(updated)) {
      return updated;
    }

    if (original.length !== updated.length) {
      return updated;
    }

    const arrayDiff: any[] = [];
    let hasDifferences = false;

    for (let i = 0; i < original.length; i++) {
      const itemDiff = deep ? deepCompare(original[i], updated[i], deep) : original[i] !== updated[i] ? updated[i] : null;

      if (itemDiff !== null) {
        arrayDiff[i] = itemDiff;
        hasDifferences = true;
      } else {
        arrayDiff[i] = original[i];
      }
    }

    return hasDifferences ? arrayDiff : null;
  }

  // Обработка объектов
  const differences: any = {};
  let hasDifferences = false;

  // Проверяем все ключи из обновленного объекта
  for (const key of Object.keys(updated)) {
    if (original.hasOwnProperty(key)) {
      // Свойство есть в обоих объектах
      if (deep) {
        const diff = deepCompare(original[key], updated[key], deep);
        if (diff !== null) {
          differences[key] = diff;
          hasDifferences = true;
        }
      } else if (original[key] !== updated[key]) {
        differences[key] = updated[key];
        hasDifferences = true;
      }
    } else {
      // Свойство добавлено в обновленном объекте
      differences[key] = updated[key];
      hasDifferences = true;
    }
  }

  // Проверяем ключи, которые были удалены из исходного объекта
  for (const key of Object.keys(original)) {
    if (!updated.hasOwnProperty(key)) {
      // Помечаем удаленные свойства специальным значением
      differences[key] = Symbol('deleted');
      hasDifferences = true;
    }
  }

  return hasDifferences ? differences : null;
}

/**
 * Вспомогательная функция для форматирования результата сравнения
 * @param diffObj Объект с различиями
 * @returns Отформатированная строка с описанием различий
 */
export function formatDiff(diffObj: any): string {
  if (diffObj === null) {
    return 'Объекты идентичны';
  }

  const formatValue = (value: any): string => {
    if (value === Symbol('deleted')) {
      return '[УДАЛЕНО]';
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value, (k, v) => v === Symbol('deleted') ? '[УДАЛЕНО]' : v, 2);
    }
    return String(value);
  };

  const lines: string[] = [];

  const processObject = (obj: any, path: string = '') => {
    for (const key of Object.keys(obj)) {
      const fullPath = path ? `${path}.${key}` : key;
      const value = obj[key];

      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        processObject(value, fullPath);
      } else {
        lines.push(`${fullPath}: ${formatValue(value)}`);
      }
    }
  };

  processObject(diffObj);
  return lines.join('\n');
}

/**
 * Проверяет, есть ли различия между объектами
 * @param diffObj Результат выполнения deepCompare
 * @returns true если есть различия, false если нет
 */
export function hasDifferences(diffObj: any): boolean {
  return diffObj !== null;
}

/**
 * Применяет различия к исходному объекту
 * @param original Исходный объект
 * @param differences Объект с различиями
 * @returns Новый объект с примененными изменениями
 */
export function applyDiff(original: any, differences: any): any {
  if (differences === null) {
    return { ...original };
  }

  const result = { ...original };

  for (const key of Object.keys(differences)) {
    const diffValue = differences[key];

    if (diffValue === Symbol('deleted')) {
      delete result[key];
    } else if (typeof diffValue === 'object' && diffValue !== null && typeof original[key] === 'object') {
      result[key] = applyDiff(original[key], diffValue);
    } else {
      result[key] = diffValue;
    }
  }

  return result;
}

/**
 * Создает патч для отправки на сервер
 * @param differences Объект с различиями
 * @returns Упрощенный объект для отправки
 */
export function createPatch(differences: any): any {
  if (differences === null) {
    return null;
  }

  const patch: any = {};

  for (const key of Object.keys(differences)) {
    const value = differences[key];

    if (value === Symbol('deleted')) {
      patch[key] = null; // Для сервера null может означать удаление
    } else if (typeof value === 'object' && value !== null) {
      patch[key] = createPatch(value);
    } else {
      patch[key] = value;
    }
  }

  return patch;
}
