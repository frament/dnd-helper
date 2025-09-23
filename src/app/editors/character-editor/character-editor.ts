import {Component, OnInit} from '@angular/core';
import {Character, Skill} from '../../models/character.model';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {CardModule} from 'primeng/card';
import {InputTextModule} from 'primeng/inputtext';
import {InputNumberModule} from 'primeng/inputnumber';
import {ButtonModule} from 'primeng/button';
import {CheckboxModule} from 'primeng/checkbox';
import {TextareaModule} from 'primeng/textarea';
import {DividerModule} from 'primeng/divider';
import {AutoCompleteModule} from 'primeng/autocomplete';
import {TabsModule} from 'primeng/tabs';

@Component({
  selector: 'app-character-editor',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    TabsModule,
    InputTextModule,
    InputNumberModule,
    AutoCompleteModule,
    ButtonModule,
    CheckboxModule,
    TextareaModule,
    DividerModule
  ],
  templateUrl: './character-editor.html',
  styleUrl: './character-editor.css'
})
export class CharacterEditor implements OnInit {
  character: Character = this.createEmptyCharacter();

  // Данные для выпадающих списков
  classes = ['Barbarian', 'Bard', 'Cleric', 'Druid', 'Fighter', 'Monk', 'Paladin', 'Ranger', 'Rogue', 'Sorcerer', 'Warlock', 'Wizard'];
  races = ['Human', 'Elf', 'Dwarf', 'Halfling', 'Gnome', 'Half-Elf', 'Half-Orc', 'Tiefling', 'Dragonborn'];
  backgrounds = ['Acolyte', 'Charlatan', 'Criminal', 'Entertainer', 'Folk Hero', 'Guild Artisan', 'Hermit', 'Noble', 'Outlander', 'Sage', 'Sailor', 'Soldier', 'Urchin'];
  alignments = ['Lawful Good', 'Neutral Good', 'Chaotic Good', 'Lawful Neutral', 'True Neutral', 'Chaotic Neutral', 'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'];
  abilities = ['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'];
  skills = [
    { name: 'Acrobatics', ability: 'dexterity' },
    { name: 'Animal Handling', ability: 'wisdom' },
    { name: 'Arcana', ability: 'intelligence' },
    { name: 'Athletics', ability: 'strength' },
    { name: 'Deception', ability: 'charisma' },
    { name: 'History', ability: 'intelligence' },
    { name: 'Insight', ability: 'wisdom' },
    { name: 'Intimidation', ability: 'charisma' },
    { name: 'Investigation', ability: 'intelligence' },
    { name: 'Medicine', ability: 'wisdom' },
    { name: 'Nature', ability: 'intelligence' },
    { name: 'Perception', ability: 'wisdom' },
    { name: 'Performance', ability: 'charisma' },
    { name: 'Persuasion', ability: 'charisma' },
    { name: 'Religion', ability: 'intelligence' },
    { name: 'Sleight of Hand', ability: 'dexterity' },
    { name: 'Stealth', ability: 'dexterity' },
    { name: 'Survival', ability: 'wisdom' }
  ];

  constructor() {}

  ngOnInit() {
    this.initializeSkills();
  }

  createEmptyCharacter(): Character {
    return {
      name: '',
      level: 1,
      class: '',
      race: '',
      background: '',
      alignment: '',
      experiencePoints: 0,
      abilities_strength: 10,
      abilities_dexterity: 10,
      abilities_constitution: 10,
      abilities_intelligence: 10,
      abilities_wisdom: 10,
      abilities_charisma: 10,
      combat: {
        armorClass: 10,
        initiative: 0,
        speed: 30,
        hitPoints: {
          current: 10,
          maximum: 10,
          temporary: 0
        },
        hitDice: '1d10'
      },
      skills: [],
      features: [],
      equipment: [],
      spells: [],
      description: {
        age: '',
        height: '',
        weight: '',
        eyes: '',
        skin: '',
        hair: '',
        appearance: '',
        backstory: ''
      }
    };
  }

  initializeSkills() {
    this.character.skills = this.skills.map(skill => ({
      name: skill.name,
      ability: skill.ability,
      proficient: false,
      expertise: false,
      bonus: 0
    }));
  }

  getAbilityModifier(abilityScore: number): number {
    return Math.floor((abilityScore - 10) / 2);
  }

  calculateSkillBonus(skill: Skill): number {
    const key = ('abilities_'+skill.ability) as keyof typeof this.character;
    let bonus = this.getAbilityModifier(this.character[key] as number);

    if (skill.proficient) bonus += this.character.level >= 5 ? 3 : 2;
    if (skill.expertise) bonus += this.character.level >= 5 ? 3 : 2;

    return bonus;
  }

  updateSkillBonuses() {
    this.character.skills.forEach(skill => {
      skill.bonus = this.calculateSkillBonus(skill);
    });
  }

  addFeature() {
    this.character.features.push({
      name: '',
      description: '',
      source: ''
    });
  }

  removeFeature(index: number) {
    this.character.features.splice(index, 1);
  }

  addEquipment() {
    this.character.equipment.push({
      name: '',
      quantity: 1,
      weight: 0,
      description: '',
      equipped: false
    });
  }

  removeEquipment(index: number) {
    this.character.equipment.splice(index, 1);
  }

  addSpell() {
    this.character.spells.push({
      name: '',
      level: 0,
      school: '',
      preparation: false,
      description: ''
    });
  }

  removeSpell(index: number) {
    this.character.spells.splice(index, 1);
  }

  saveCharacter() {
    // Здесь логика сохранения персонажа
  }

  calculateProficiencyBonus(): number {
    return this.character.level >= 5 ? 3 : 2;
  }

  getAbilityName(ability: string): string {
    const names: { [key: string]: string } = {
      strength: 'Сила',
      dexterity: 'Ловкость',
      constitution: 'Телосложение',
      intelligence: 'Интеллект',
      wisdom: 'Мудрость',
      charisma: 'Харизма'
    };
    return names[ability] || ability;
  }

  getAbilityAbbreviation(ability: string): string {
    const abbreviations: { [key: string]: string } = {
      strength: 'STR',
      dexterity: 'DEX',
      constitution: 'CON',
      intelligence: 'INT',
      wisdom: 'WIS',
      charisma: 'CHA'
    };
    return abbreviations[ability] || ability;
  }
}
