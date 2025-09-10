-- ------------------------------
-- OPTION
-- ------------------------------

OPTION IMPORT;

-- ------------------------------
-- ACCESSES
-- ------------------------------

DEFINE ACCESS user ON DATABASE TYPE RECORD SIGNUP (CREATE user CONTENT { email: $email, name: $name, password: crypto::argon2::generate($password) }) SIGNIN (SELECT * FROM user WHERE email = $email AND crypto::argon2::compare(password, $password)) WITH JWT ALGORITHM HS512 KEY 'fzaxkinDlvaG8CgTiFHQssRW07SUudlS4mDg7ZPCIYDV4SjwRF09DCWokTGSGbd0oqMGPZIxayhUdKj5hAKmJ2TDx6nrGZ0UbslAsKx5sTsVrRIR6pSb4vJvL5ukvyE0' WITH ISSUER KEY 'fzaxkinDlvaG8CgTiFHQssRW07SUudlS4mDg7ZPCIYDV4SjwRF09DCWokTGSGbd0oqMGPZIxayhUdKj5hAKmJ2TDx6nrGZ0UbslAsKx5sTsVrRIR6pSb4vJvL5ukvyE0' DURATION FOR TOKEN 1h, FOR SESSION NONE;

-- ------------------------------
-- TABLE: adventure_note
-- ------------------------------

DEFINE TABLE adventure_note TYPE RELATION IN adventures OUT notes SCHEMAFULL PERMISSIONS FULL;

DEFINE FIELD in ON adventure_note TYPE record<adventures> PERMISSIONS FULL;
DEFINE FIELD out ON adventure_note TYPE record<notes> PERMISSIONS FULL;



-- ------------------------------
-- TABLE DATA: adventure_note
-- ------------------------------

INSERT RELATION [ { __: true, id: adventure_note:vjb8u7dwhpsrbbiuk3jc, in: adventures:8hp10q7fhs8wy7avqqp7, out: notes:o0pjez5ziaja8zkr6fa0 } ];

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



-- ------------------------------
-- TABLE DATA: adventures
-- ------------------------------

INSERT [ { createdAt: d'2025-08-21T18:07:06.351207181Z', description: '', id: adventures:8hp10q7fhs8wy7avqqp7, isPublic: false, name: 'tesst', owner: user:s0k9cjgh18qeqs9ei32l, status: 'created', tags: ['исследование', 'битва', 'политика', 'выживание'] } ];

-- ------------------------------
-- TABLE: notes
-- ------------------------------

DEFINE TABLE notes TYPE NORMAL SCHEMAFULL PERMISSIONS FOR select, update, delete WHERE owner = $auth.id, FOR create FULL;

DEFINE FIELD category ON notes TYPE string PERMISSIONS FULL;
DEFINE FIELD content ON notes TYPE string DEFAULT '' PERMISSIONS FULL;
DEFINE FIELD createdAt ON notes TYPE datetime DEFAULT time::now() PERMISSIONS FULL;
DEFINE FIELD owner ON notes TYPE record<user> PERMISSIONS FULL;
DEFINE FIELD tags ON notes TYPE set<string> DEFAULT [] PERMISSIONS FULL;
DEFINE FIELD tags[*] ON notes TYPE string PERMISSIONS FULL;
DEFINE FIELD title ON notes TYPE string DEFAULT '' PERMISSIONS FULL;
DEFINE FIELD updatedAt ON notes TYPE datetime DEFAULT ALWAYS time::now() PERMISSIONS FULL;



-- ------------------------------
-- TABLE DATA: notes
-- ------------------------------

INSERT [ { content: '', id: notes:o0pjez5ziaja8zkr6fa0, owner: user:s0k9cjgh18qeqs9ei32l, tags: [], title: 'test' } ];

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

