-- ------------------------------
-- OPTION
-- ------------------------------

OPTION IMPORT;

-- ------------------------------
-- ACCESSES
-- ------------------------------

DEFINE ACCESS user ON DATABASE TYPE RECORD SIGNUP (CREATE user CONTENT { email: $email, name: $name, password: crypto::argon2::generate($password) }) SIGNIN (SELECT * FROM user WHERE email = $email AND crypto::argon2::compare(password, $password)) WITH JWT ALGORITHM HS512 KEY 'fzaxkinDlvaG8CgTiFHQssRW07SUudlS4mDg7ZPCIYDV4SjwRF09DCWokTGSGbd0oqMGPZIxayhUdKj5hAKmJ2TDx6nrGZ0UbslAsKx5sTsVrRIR6pSb4vJvL5ukvyE0' WITH ISSUER KEY 'fzaxkinDlvaG8CgTiFHQssRW07SUudlS4mDg7ZPCIYDV4SjwRF09DCWokTGSGbd0oqMGPZIxayhUdKj5hAKmJ2TDx6nrGZ0UbslAsKx5sTsVrRIR6pSb4vJvL5ukvyE0' DURATION FOR TOKEN 1h, FOR SESSION NONE;

-- ------------------------------
-- TABLE: adventures
-- ------------------------------

DEFINE TABLE adventures TYPE NORMAL SCHEMAFULL PERMISSIONS FULL;

DEFINE FIELD created_at ON adventures TYPE datetime DEFAULT time::now() READONLY PERMISSIONS FULL;
DEFINE FIELD name ON adventures TYPE string PERMISSIONS FULL;
DEFINE FIELD owner ON adventures TYPE record<user> DEFAULT $auth.id READONLY PERMISSIONS FULL;



-- ------------------------------
-- TABLE: user
-- ------------------------------

DEFINE TABLE user TYPE NORMAL SCHEMAFULL PERMISSIONS FOR select, update, delete WHERE id = $auth.id, FOR create NONE;

DEFINE FIELD email ON user TYPE string ASSERT string::is::email($value) PERMISSIONS FULL;
DEFINE FIELD name ON user TYPE string PERMISSIONS FULL;
DEFINE FIELD password ON user TYPE string PERMISSIONS FULL;

DEFINE INDEX email ON user FIELDS email UNIQUE;


