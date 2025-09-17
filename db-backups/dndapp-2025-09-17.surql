-- ------------------------------
-- OPTION
-- ------------------------------

OPTION IMPORT;

-- ------------------------------
-- ACCESSES
-- ------------------------------

DEFINE ACCESS user ON DATABASE TYPE RECORD SIGNUP (CREATE user CONTENT { email: $email, name: $name, password: crypto::argon2::generate($password) }) SIGNIN (SELECT * FROM user WHERE email = $email AND crypto::argon2::compare(password, $password)) WITH JWT ALGORITHM HS512 KEY 'fzaxkinDlvaG8CgTiFHQssRW07SUudlS4mDg7ZPCIYDV4SjwRF09DCWokTGSGbd0oqMGPZIxayhUdKj5hAKmJ2TDx6nrGZ0UbslAsKx5sTsVrRIR6pSb4vJvL5ukvyE0' WITH ISSUER KEY 'fzaxkinDlvaG8CgTiFHQssRW07SUudlS4mDg7ZPCIYDV4SjwRF09DCWokTGSGbd0oqMGPZIxayhUdKj5hAKmJ2TDx6nrGZ0UbslAsKx5sTsVrRIR6pSb4vJvL5ukvyE0' DURATION FOR TOKEN 1h, FOR SESSION NONE;

-- ------------------------------
-- TABLE: adventure_artifact
-- ------------------------------

DEFINE TABLE adventure_artifact TYPE RELATION IN adventures OUT artifacts SCHEMAFULL PERMISSIONS FULL;

DEFINE FIELD in ON adventure_artifact TYPE record<adventures> PERMISSIONS FULL;
DEFINE FIELD out ON adventure_artifact TYPE record<artifacts> PERMISSIONS FULL;



-- ------------------------------
-- TABLE DATA: adventure_artifact
-- ------------------------------

INSERT RELATION [ { __: true, id: adventure_artifact:469zy4y41yvt7h1v08pd, in: adventures:8hp10q7fhs8wy7avqqp7, out: artifacts:6lug1iuf2sc0u8jmnt0e }, { __: true, id: adventure_artifact:hozkk4goz4768la5t0xm, in: adventures:8hp10q7fhs8wy7avqqp7, out: artifacts:5131elrotwj4035nu3j5 }, { __: true, id: adventure_artifact:t5n5lqg3hrdxya6qchft, in: adventures:8hp10q7fhs8wy7avqqp7, out: artifacts:cwrrqscrofqctmm8d2aw } ];

-- ------------------------------
-- TABLE: adventure_chapter
-- ------------------------------

DEFINE TABLE adventure_chapter TYPE RELATION IN adventures OUT chapters SCHEMAFULL PERMISSIONS FULL;

DEFINE FIELD in ON adventure_chapter TYPE record<adventures> PERMISSIONS FULL;
DEFINE FIELD out ON adventure_chapter TYPE record<chapters> PERMISSIONS FULL;



-- ------------------------------
-- TABLE DATA: adventure_chapter
-- ------------------------------

INSERT RELATION [ { __: true, id: adventure_chapter:9w6k7i4688kb94avkg3e, in: adventures:8hp10q7fhs8wy7avqqp7, out: chapters:12g4iyisrreqihuspdcz } ];

-- ------------------------------
-- TABLE: adventure_map
-- ------------------------------

DEFINE TABLE adventure_map TYPE RELATION IN adventures OUT maps SCHEMAFULL PERMISSIONS FULL;

DEFINE FIELD in ON adventure_map TYPE record<adventures> PERMISSIONS FULL;
DEFINE FIELD out ON adventure_map TYPE record<maps> PERMISSIONS FULL;



-- ------------------------------
-- TABLE DATA: adventure_map
-- ------------------------------

INSERT RELATION [ { __: true, id: adventure_map:2t3rbugw20hwthjlsejr, in: adventures:8hp10q7fhs8wy7avqqp7, out: maps:fv5kmziflbkyxxztzmwa } ];

-- ------------------------------
-- TABLE: adventure_note
-- ------------------------------

DEFINE TABLE adventure_note TYPE RELATION IN adventures OUT notes SCHEMAFULL PERMISSIONS FULL;

DEFINE FIELD in ON adventure_note TYPE record<adventures> PERMISSIONS FULL;
DEFINE FIELD out ON adventure_note TYPE record<notes> PERMISSIONS FULL;



-- ------------------------------
-- TABLE DATA: adventure_note
-- ------------------------------

INSERT RELATION [ { __: true, id: adventure_note:5ubhwfzwabj8s32hytj5, in: adventures:8hp10q7fhs8wy7avqqp7, out: notes:029g49v5mt15fosur58t }, { __: true, id: adventure_note:vjb8u7dwhpsrbbiuk3jc, in: adventures:8hp10q7fhs8wy7avqqp7, out: notes:o0pjez5ziaja8zkr6fa0 } ];

-- ------------------------------
-- TABLE: adventure_npc
-- ------------------------------

DEFINE TABLE adventure_npc TYPE RELATION IN adventures OUT npcs SCHEMAFULL PERMISSIONS FULL;

DEFINE FIELD in ON adventure_npc TYPE record<adventures> PERMISSIONS FULL;
DEFINE FIELD out ON adventure_npc TYPE record<npcs> PERMISSIONS FULL;



-- ------------------------------
-- TABLE DATA: adventure_npc
-- ------------------------------

INSERT RELATION [ { __: true, id: adventure_npc:4g8c33ron80gagoxd5bh, in: adventures:8hp10q7fhs8wy7avqqp7, out: npcs:etc38p9rvbivsu4cw8pq } ];

-- ------------------------------
-- TABLE: adventures
-- ------------------------------

DEFINE TABLE adventures TYPE NORMAL SCHEMAFULL PERMISSIONS FOR select, create FULL, FOR update, delete WHERE owner = $auth.id;

DEFINE FIELD createdAt ON adventures TYPE datetime DEFAULT time::now() READONLY PERMISSIONS FULL;
DEFINE FIELD description ON adventures TYPE string DEFAULT '' PERMISSIONS FULL;
DEFINE FIELD isPublic ON adventures TYPE bool DEFAULT false PERMISSIONS FULL;
DEFINE FIELD name ON adventures TYPE string PERMISSIONS FULL;
DEFINE FIELD owner ON adventures TYPE record<user> DEFAULT $auth.id READONLY PERMISSIONS FULL;
DEFINE FIELD status ON adventures TYPE string DEFAULT 'created' PERMISSIONS FULL;
DEFINE FIELD tags ON adventures TYPE set<string> DEFAULT [] PERMISSIONS FULL;
DEFINE FIELD tags[*] ON adventures TYPE string PERMISSIONS FULL;
DEFINE FIELD updatedAt ON adventures TYPE datetime DEFAULT ALWAYS time::now() PERMISSIONS FULL;



-- ------------------------------
-- TABLE DATA: adventures
-- ------------------------------

INSERT [ { createdAt: d'2025-08-21T18:07:06.351207181Z', description: '', id: adventures:8hp10q7fhs8wy7avqqp7, isPublic: false, name: 'tesst', owner: user:s0k9cjgh18qeqs9ei32l, status: 'created', tags: ['исследование', 'битва', 'политика', 'выживание'] } ];

-- ------------------------------
-- TABLE: artifacts
-- ------------------------------

DEFINE TABLE artifacts TYPE NORMAL SCHEMAFULL PERMISSIONS FOR select, create FULL, FOR update, delete WHERE owner = $auth.id;

DEFINE FIELD `value` ON artifacts TYPE number DEFAULT 0 PERMISSIONS FULL;
DEFINE FIELD attunement ON artifacts TYPE string DEFAULT '' PERMISSIONS FULL;
DEFINE FIELD charges_current ON artifacts TYPE number DEFAULT 0 PERMISSIONS FULL;
DEFINE FIELD charges_max ON artifacts TYPE number DEFAULT 0 PERMISSIONS FULL;
DEFINE FIELD charges_recharge ON artifacts TYPE string DEFAULT '' PERMISSIONS FULL;
DEFINE FIELD createdAt ON artifacts TYPE datetime DEFAULT time::now() READONLY PERMISSIONS FULL;
DEFINE FIELD curse ON artifacts TYPE string DEFAULT '' PERMISSIONS FULL;
DEFINE FIELD description ON artifacts TYPE string DEFAULT '' PERMISSIONS FULL;
DEFINE FIELD goals ON artifacts TYPE array<string> DEFAULT [] PERMISSIONS FULL;
DEFINE FIELD goals[*] ON artifacts TYPE string PERMISSIONS FULL;
DEFINE FIELD history_creation ON artifacts TYPE string DEFAULT '' PERMISSIONS FULL;
DEFINE FIELD history_currentLocation ON artifacts TYPE string DEFAULT '' PERMISSIONS FULL;
DEFINE FIELD history_legend ON artifacts TYPE string DEFAULT '' PERMISSIONS FULL;
DEFINE FIELD history_owners ON artifacts TYPE array<string> DEFAULT [] PERMISSIONS FULL;
DEFINE FIELD history_owners[*] ON artifacts TYPE string PERMISSIONS FULL;
DEFINE FIELD history_significantEvents ON artifacts TYPE string DEFAULT '' PERMISSIONS FULL;
DEFINE FIELD imageUrl ON artifacts TYPE string DEFAULT '' PERMISSIONS FULL;
DEFINE FIELD name ON artifacts TYPE string PERMISSIONS FULL;
DEFINE FIELD owner ON artifacts TYPE record<user> DEFAULT $auth.id READONLY PERMISSIONS FULL;
DEFINE FIELD properties ON artifacts TYPE string DEFAULT '' PERMISSIONS FULL;
DEFINE FIELD rarity ON artifacts TYPE string DEFAULT '' PERMISSIONS FULL;
DEFINE FIELD specialAbilities ON artifacts TYPE array<object> DEFAULT [] PERMISSIONS FULL;
DEFINE FIELD specialAbilities[*] ON artifacts TYPE object PERMISSIONS FULL;
DEFINE FIELD type ON artifacts TYPE string DEFAULT '' PERMISSIONS FULL;
DEFINE FIELD updatedAt ON artifacts TYPE datetime DEFAULT time::now() READONLY PERMISSIONS FULL;
DEFINE FIELD weight ON artifacts TYPE number DEFAULT 0 PERMISSIONS FULL;



-- ------------------------------
-- TABLE DATA: artifacts
-- ------------------------------

INSERT [ { attunement: '', charges_current: 0, charges_max: 0, charges_recharge: '', createdAt: d'2025-09-17T16:47:44.142455111Z', curse: '', description: '', goals: [], history_creation: '', history_currentLocation: '', history_legend: '', history_owners: [], history_significantEvents: '', id: artifacts:5131elrotwj4035nu3j5, imageUrl: '', name: 'Новый артефакт', owner: user:s0k9cjgh18qeqs9ei32l, properties: '', rarity: '', specialAbilities: [], type: '', updatedAt: d'2025-09-17T16:47:44.142941704Z', value: 0, weight: 0 }, { attunement: '', charges_current: 0, charges_max: 0, charges_recharge: '', createdAt: d'2025-09-17T16:46:08.068914661Z', curse: '', description: '', goals: [], history_creation: '', history_currentLocation: '', history_legend: '', history_owners: [], history_significantEvents: '', id: artifacts:6lug1iuf2sc0u8jmnt0e, imageUrl: '', name: 'Новый артефакт', owner: user:s0k9cjgh18qeqs9ei32l, properties: '', rarity: '', specialAbilities: [], type: '', updatedAt: d'2025-09-17T16:46:08.069761811Z', value: 0, weight: 0 }, { attunement: '', charges_current: 0, charges_max: 0, charges_recharge: '', createdAt: d'2025-09-17T16:47:08.694729020Z', curse: '', description: '', goals: [], history_creation: '', history_currentLocation: '', history_legend: '', history_owners: [], history_significantEvents: '', id: artifacts:cwrrqscrofqctmm8d2aw, imageUrl: '', name: 'Новый артефакт', owner: user:s0k9cjgh18qeqs9ei32l, properties: '', rarity: '', specialAbilities: [], type: '', updatedAt: d'2025-09-17T16:47:08.694999607Z', value: 0, weight: 0 } ];

-- ------------------------------
-- TABLE: chapters
-- ------------------------------

DEFINE TABLE chapters TYPE NORMAL SCHEMAFULL PERMISSIONS FOR select, create FULL, FOR update, delete WHERE owner = $auth.id;

DEFINE FIELD avatar ON chapters TYPE string DEFAULT '' PERMISSIONS FULL;
DEFINE FIELD description ON chapters TYPE string DEFAULT '' PERMISSIONS FULL;
DEFINE FIELD difficulty ON chapters TYPE number DEFAULT 0 PERMISSIONS FULL;
DEFINE FIELD isPublic ON chapters TYPE bool DEFAULT false PERMISSIONS FULL;
DEFINE FIELD owner ON chapters TYPE record<user> DEFAULT $auth.id READONLY PERMISSIONS FULL;
DEFINE FIELD recommendedLevel ON chapters TYPE number DEFAULT 1 PERMISSIONS FULL;
DEFINE FIELD status ON chapters TYPE string PERMISSIONS FULL;
DEFINE FIELD tags ON chapters TYPE set<string> DEFAULT [] PERMISSIONS FULL;
DEFINE FIELD tags[*] ON chapters TYPE string PERMISSIONS FULL;
DEFINE FIELD title ON chapters TYPE string PERMISSIONS FULL;



-- ------------------------------
-- TABLE DATA: chapters
-- ------------------------------

INSERT [ { avatar: '', description: '', difficulty: 0, id: chapters:12g4iyisrreqihuspdcz, isPublic: false, owner: user:s0k9cjgh18qeqs9ei32l, recommendedLevel: 1, status: 'draft', tags: [], title: '123' } ];

-- ------------------------------
-- TABLE: maps
-- ------------------------------

DEFINE TABLE maps TYPE NORMAL SCHEMAFULL PERMISSIONS FOR select, create FULL, FOR update, delete WHERE owner = $auth.id;

DEFINE FIELD createdAt ON maps TYPE datetime DEFAULT time::now() PERMISSIONS FULL;
DEFINE FIELD description ON maps TYPE string DEFAULT '' PERMISSIONS FULL;
DEFINE FIELD file ON maps TYPE string DEFAULT '' PERMISSIONS FULL;
DEFINE FIELD height ON maps TYPE number DEFAULT 1000 PERMISSIONS FULL;
DEFINE FIELD owner ON maps TYPE record<user> DEFAULT $auth.id PERMISSIONS FULL;
DEFINE FIELD tags ON maps TYPE set<string> DEFAULT [] PERMISSIONS FULL;
DEFINE FIELD tags[*] ON maps TYPE string PERMISSIONS FULL;
DEFINE FIELD title ON maps TYPE string PERMISSIONS FULL;
DEFINE FIELD type ON maps TYPE string PERMISSIONS FULL;
DEFINE FIELD updatedAt ON maps TYPE datetime DEFAULT time::now() PERMISSIONS FULL;
DEFINE FIELD width ON maps TYPE number DEFAULT 1000 PERMISSIONS FULL;



-- ------------------------------
-- TABLE DATA: maps
-- ------------------------------

INSERT [ { createdAt: d'2025-09-17T11:56:46.024069962Z', description: '', file: '', height: 1000, id: maps:fv5kmziflbkyxxztzmwa, owner: user:s0k9cjgh18qeqs9ei32l, tags: [], title: 'Новая карта111', type: 'world', updatedAt: d'2025-09-17T11:56:46.025099421Z', width: 1000 } ];

-- ------------------------------
-- TABLE: notes
-- ------------------------------

DEFINE TABLE notes TYPE NORMAL SCHEMAFULL PERMISSIONS FOR select, update, delete WHERE owner = $auth.id, FOR create FULL;

DEFINE FIELD category ON notes TYPE string PERMISSIONS FULL;
DEFINE FIELD content ON notes TYPE string DEFAULT '' PERMISSIONS FULL;
DEFINE FIELD createdAt ON notes TYPE datetime DEFAULT time::now() PERMISSIONS FULL;
DEFINE FIELD owner ON notes TYPE record<user> DEFAULT $auth.id PERMISSIONS FULL;
DEFINE FIELD tags ON notes TYPE set<string> DEFAULT [] PERMISSIONS FULL;
DEFINE FIELD tags[*] ON notes TYPE string PERMISSIONS FULL;
DEFINE FIELD title ON notes TYPE string DEFAULT '' PERMISSIONS FULL;
DEFINE FIELD updatedAt ON notes TYPE datetime DEFAULT time::now() PERMISSIONS FULL;



-- ------------------------------
-- TABLE DATA: notes
-- ------------------------------

INSERT [ { category: '', content: '', createdAt: d'2025-09-11T16:03:42.855269802Z', id: notes:029g49v5mt15fosur58t, owner: user:s0k9cjgh18qeqs9ei32l, tags: [], title: 'Новая заметка23', updatedAt: d'2025-09-11T16:03:42.855513134Z' }, { category: '', content: '', createdAt: d'2025-09-11T15:55:37.066736682Z', id: notes:1oy3rtcuutpwj9xi11yf, owner: user:s0k9cjgh18qeqs9ei32l, tags: [], title: 'Новая заметка', updatedAt: d'2025-09-11T15:55:37.067518717Z' }, { content: '', id: notes:o0pjez5ziaja8zkr6fa0, owner: user:s0k9cjgh18qeqs9ei32l, tags: [], title: 'test' } ];

-- ------------------------------
-- TABLE: npcs
-- ------------------------------

DEFINE TABLE npcs TYPE NORMAL SCHEMAFULL PERMISSIONS FOR select, create FULL, FOR update, delete WHERE owner = $auth.id;

DEFINE FIELD alignment ON npcs TYPE string DEFAULT '' PERMISSIONS FULL;
DEFINE FIELD appearance ON npcs TYPE string DEFAULT '' PERMISSIONS FULL;
DEFINE FIELD class ON npcs TYPE string DEFAULT '' PERMISSIONS FULL;
DEFINE FIELD combat_armorClass ON npcs TYPE number DEFAULT 12 PERMISSIONS FULL;
DEFINE FIELD combat_hitPoints ON npcs TYPE number DEFAULT 10 PERMISSIONS FULL;
DEFINE FIELD combat_speed ON npcs TYPE number DEFAULT 30 PERMISSIONS FULL;
DEFINE FIELD createdAt ON npcs TYPE datetime DEFAULT time::now() READONLY PERMISSIONS FULL;
DEFINE FIELD creatureType ON npcs TYPE string DEFAULT '' PERMISSIONS FULL;
DEFINE FIELD features ON npcs TYPE string DEFAULT '' PERMISSIONS FULL;
DEFINE FIELD goals ON npcs TYPE array<string> DEFAULT [] PERMISSIONS FULL;
DEFINE FIELD goals[*] ON npcs TYPE string PERMISSIONS FULL;
DEFINE FIELD history ON npcs TYPE string DEFAULT '' PERMISSIONS FULL;
DEFINE FIELD imageUrl ON npcs TYPE string DEFAULT '' PERMISSIONS FULL;
DEFINE FIELD level ON npcs TYPE number DEFAULT 1 PERMISSIONS FULL;
DEFINE FIELD name ON npcs TYPE string PERMISSIONS FULL;
DEFINE FIELD owner ON npcs TYPE record<user> DEFAULT $auth.id PERMISSIONS FULL;
DEFINE FIELD personality ON npcs TYPE string DEFAULT '' PERMISSIONS FULL;
DEFINE FIELD race ON npcs TYPE string PERMISSIONS FULL;
DEFINE FIELD size ON npcs TYPE string DEFAULT '' PERMISSIONS FULL;
DEFINE FIELD stats_charisma ON npcs TYPE number DEFAULT 10 PERMISSIONS FULL;
DEFINE FIELD stats_constitution ON npcs TYPE number DEFAULT 10 PERMISSIONS FULL;
DEFINE FIELD stats_dexterity ON npcs TYPE number DEFAULT 10 PERMISSIONS FULL;
DEFINE FIELD stats_intelligence ON npcs TYPE number DEFAULT 10 PERMISSIONS FULL;
DEFINE FIELD stats_strength ON npcs TYPE number DEFAULT 10 PERMISSIONS FULL;
DEFINE FIELD stats_wisdom ON npcs TYPE number DEFAULT 10 PERMISSIONS FULL;
DEFINE FIELD updatedAt ON npcs TYPE datetime DEFAULT time::now() PERMISSIONS FULL;



-- ------------------------------
-- TABLE DATA: npcs
-- ------------------------------

INSERT [ { alignment: '', appearance: '', class: '', combat_armorClass: 12, combat_hitPoints: 10, combat_speed: 30, createdAt: d'2025-09-17T15:47:13.683522898Z', creatureType: '', features: '', goals: [], history: '', id: npcs:etc38p9rvbivsu4cw8pq, imageUrl: '', level: 1, name: 'Новый NPC', owner: user:s0k9cjgh18qeqs9ei32l, personality: '', race: 'human', size: '', stats_charisma: 10, stats_constitution: 10, stats_dexterity: 10, stats_intelligence: 10, stats_strength: 10, stats_wisdom: 10, updatedAt: d'2025-09-17T15:47:13.683874125Z' } ];

-- ------------------------------
-- TABLE: user
-- ------------------------------

DEFINE TABLE user TYPE NORMAL SCHEMAFULL PERMISSIONS FOR select, update, delete WHERE id = $auth.id, FOR create NONE;

DEFINE FIELD email ON user TYPE string ASSERT string::is::email($value) PERMISSIONS FULL;
DEFINE FIELD name ON user TYPE string PERMISSIONS FULL;
DEFINE FIELD password ON user TYPE string PERMISSIONS FULL;

DEFINE INDEX email ON user FIELDS email UNIQUE;


-- ------------------------------
-- TABLE DATA: user
-- ------------------------------

INSERT [ { email: 'shpa@mail.ru', id: user:s0k9cjgh18qeqs9ei32l, name: 'shpa', password: '$argon2id$v=19$m=19456,t=2,p=1$yS2DcI42gnm5pj1CKUvQaQ$SzgEiIlJZYoR1inrDN8xfFEHRO2kE+hGNVtC0srYMj4' } ];

