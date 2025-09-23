export type Category = {
  id: string;
  name: string;
  icon: string;
  subcategories: Subcategory[];
}

export type Subcategory = {
  id: string;
  name: string;
}

export const wikiCategories: Category[] = [
  {
    id: 'classes',
    name: 'Классы',
    icon: 'pi pi-user',
    subcategories: [
      { id: 'warrior', name: 'Воинские' },
      { id: 'magic', name: 'Магические' },
      { id: 'hybrid', name: 'Гибридные' },
      { id: 'special', name: 'Специальные' }
    ]
  },
  {
    id: 'races',
    name: 'Расы',
    icon: 'pi pi-users',
    subcategories: [
      { id: 'humanoid', name: 'Гуманоиды' },
      { id: 'elf', name: 'Эльфы' },
      { id: 'dwarf', name: 'Дварфы' },
      { id: 'orc', name: 'Орки' },
      { id: 'beast', name: 'Звери' }
    ]
  },
  {
    id: 'backgrounds',
    name: 'Предыстории',
    icon: 'pi pi-history',
    subcategories: [
      { id: 'noble', name: 'Благородные' },
      { id: 'common', name: 'Простонародные' },
      { id: 'criminal', name: 'Криминальные' },
      { id: 'magical', name: 'Магические' }
    ]
  },
  {
    id: 'traits',
    name: 'Черты',
    icon: 'pi pi-star',
    subcategories: [
      { id: 'racial', name: 'Расые' },
      { id: 'class', name: 'Классовые' },
      { id: 'feats', name: 'Умения' }
    ]
  },
  {
    id: 'spells',
    name: 'Заклинания',
    icon: 'pi pi-bolt',
    subcategories: [
      { id: 'evocation', name: 'Воплощение' },
      { id: 'abjuration', name: 'Ограждение' },
      { id: 'illusion', name: 'Иллюзия' },
      { id: 'necromancy', name: 'Некромантия' }
    ]
  },
  {
    id: 'bestiary',
    name: 'Бестиарий',
    icon: 'pi pi-paw',
    subcategories: [
      { id: 'beasts', name: 'Звери' },
      { id: 'humanoids', name: 'Гуманоиды' },
      { id: 'dragons', name: 'Драконы' },
      { id: 'undead', name: 'Нежить' }
    ]
  },
  {
    id: 'magic-items',
    name: 'Магические предметы',
    icon: 'pi pi-gem',
    subcategories: [
      { id: 'weapons', name: 'Оружие' },
      { id: 'armor', name: 'Броня' },
      { id: 'potions', name: 'Зелья' },
      { id: 'artifacts', name: 'Артефакты' }
    ]
  },
  {
    id: 'equipment',
    name: 'Снаряжение',
    icon: 'pi pi-shopping-bag',
    subcategories: [
      { id: 'weapons', name: 'Оружие' },
      { id: 'armor', name: 'Броня' },
      { id: 'tools', name: 'Инструменты' },
      { id: 'consumables', name: 'Расходники' }
    ]
  }
];
