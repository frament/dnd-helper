import {Component, computed, signal} from '@angular/core';
import {InputGroupAddonModule} from 'primeng/inputgroupaddon';
import {FormsModule} from '@angular/forms';
import {InputGroupModule} from 'primeng/inputgroup';
import {InputTextModule} from 'primeng/inputtext';
import {ButtonModule} from 'primeng/button';
import {AutoCompleteModule} from 'primeng/autocomplete';
import { PaginatorModule} from 'primeng/paginator';
import {DialogModule} from 'primeng/dialog';
import {wikiCategories} from './category';

interface KnowledgeItem {
  id: string;
  name: string;
  type: string;
  description: string;
  rarity: string;
  source: string;
  level?: number;
}

@Component({
  selector: 'app-knowledge-base',
  templateUrl: './knowledge-base.html',
  imports: [
    InputGroupModule,
    InputGroupAddonModule,
    FormsModule,
    InputTextModule,
    ButtonModule,
    AutoCompleteModule,
    PaginatorModule,
    DialogModule
  ],
  styleUrls: ['./knowledge-base.css']
})
export class KnowledgeBase {

  categories = wikiCategories;

  // Тестовые данные
  knowledgeItems: KnowledgeItem[] = [
    {
      id: '1',
      name: 'Воин',
      type: 'classes',
      description: 'Мастер боевых искусств, специализирующийся на оружии и доспехах',
      rarity: 'Обычный',
      source: 'Player\'s Handbook',
      level: 1
    },
    {
      id: '2',
      name: 'Волшебник',
      type: 'classes',
      description: 'Исследователь магических искусств, использующий заклинания из книги заклинаний',
      rarity: 'Обычный',
      source: 'Player\'s Handbook',
      level: 1
    },
    {
      id: '3',
      name: 'Огненный шар',
      type: 'spells',
      description: 'Создает взрыв огня, наносящий урон всем в зоне действия',
      rarity: 'Обычный',
      source: 'Player\'s Handbook',
      level: 3
    },
    {
      id: '4',
      name: 'Дракон',
      type: 'bestiary',
      description: 'Могучее крылатое существо, дышащее огнем',
      rarity: 'Легендарный',
      source: 'Monster Manual'
    },
    {
      id: '5',
      name: 'Меч заката',
      type: 'magic-items',
      description: 'Волшебный меч, светящийся на закате',
      rarity: 'Редкий',
      source: 'Dungeon Master\'s Guide'
    }
  ];

  activeCategoryId = signal<string>('');
  activeSubcategoryId = signal<string>('');

  searchQuery = signal<string>('');
  viewMode: 'grid' | 'list' = 'grid';
  selectedFilter = signal<string>('all');
  selectedSort = signal<string>('name');
  itemsPerPage = signal<number>(12);
  currentPage = signal<number>(0);

  showItemDialog: boolean = false;
  selectedItem: KnowledgeItem | null = null;

  filterOptions = [
    { label: 'Все', value: 'all' },
    { label: 'Обычные', value: 'common' },
    { label: 'Редкие', value: 'rare' },
    { label: 'Очень редкие', value: 'very-rare' },
    { label: 'Легендарные', value: 'legendary' }
  ];

  sortOptions = [
    { label: 'По имени', value: 'name' },
    { label: 'По уровню', value: 'level' },
    { label: 'По редкости', value: 'rarity' },
    { label: 'По источнику', value: 'source' }
  ];

  selectCategory(categoryId: string): void {
    if (this.activeCategoryId() === categoryId) {
      this.activeCategoryId.set('');
      this.activeSubcategoryId.set('');
    } else {
      this.activeCategoryId.set(categoryId);
      this.activeSubcategoryId.set(
        this.categories.find(c => c.id === categoryId)?.subcategories[0]?.id
        || ''
      );
    }
    this.currentPage.set(0);
  }

  selectSubcategory(subcategoryId: string): void {
    this.activeSubcategoryId.set(subcategoryId);
    this.currentPage.set(0);
  }

  getActiveCategoryName(): string {
    if (!this.activeCategoryId()) return 'База знаний';
    return this.categories.find(c => c.id === this.activeCategoryId())?.name || '';
  }

  getActiveSubcategoryName(): string {
    if (!this.activeCategoryId() || !this.activeSubcategoryId()) return '';
    const category = this.categories.find(c => c.id === this.activeCategoryId());
    return category?.subcategories.find(s => s.id === this.activeSubcategoryId())?.name || '';
  }

  filteredItems = computed<KnowledgeItem[]>(() => {
    let items = this.knowledgeItems.filter(item =>
      item.type === this.activeCategoryId()
    );
    // Фильтрация по поисковому запросу
    if (this.searchQuery()) {
      const query = this.searchQuery().toLowerCase();
      items = items.filter(item =>
        item.name.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query)
      );
    }

    // Фильтрация по редкости
    if (this.selectedFilter() !== 'all') {
      items = items.filter(item => item.rarity.toLowerCase().includes(this.selectedFilter()));
    }

    // Сортировка
    items.sort((a, b) => {
      switch (this.selectedSort()) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'level':
          return (a.level || 0) - (b.level || 0);
        case 'rarity':
          return a.rarity.localeCompare(b.rarity);
        case 'source':
          return a.source.localeCompare(b.source);
        default:
          return 0;
      }
    });

    // Пагинация
    const startIndex = this.currentPage() * this.itemsPerPage();
    return items.slice(startIndex, startIndex + this.itemsPerPage());
  });

  getItemCount(): number {
    return this.knowledgeItems.filter(item =>
      item.type === this.activeCategoryId()
    ).length;
  }

  getCategoryIcon(type: string): string {
    const category = this.categories.find(c => c.id === type);
    return category?.icon || 'pi pi-question-circle';
  }

  openItem(item: KnowledgeItem): void {
    this.selectedItem = item;
    this.showItemDialog = true;
  }

  onPageChange(event: any): void {
    this.currentPage.set(event.page);
  }
}
