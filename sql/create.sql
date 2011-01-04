
CREATE SEQUENCE files_id_seq;

CREATE TABLE files (
	id INTEGER PRIMARY KEY,
	extension VARCHAR(10),
	content_type VARCHAR(100),
	content_length INTEGER
);

CREATE TABLE users_roles (
	system_name VARCHAR(10) PRIMARY KEY,
	name VARCHAR(30) NOT NULL
);

INSERT INTO users_roles(system_name, name) VALUES('admin', 'Администратор'),
	('teacher', 'Учитель'),
	('student', 'Ученик'),
	('parent', 'Родитель');

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	name1 VARCHAR(100) NOT NULL,
	name2 VARCHAR(100) NOT NULL,
	name3 VARCHAR(100),
	address TEXT,
	phone VARCHAR(100),
	photo INTEGER REFERENCES files(id),
	_login VARCHAR(100) UNIQUE NOT NULL,
	_password VARCHAR(100) NOT NULL,
	_role_id VARCHAR(10) REFERENCES users_roles(system_name) NOT NULL,
	_blocked BOOL NOT NULL DEFAULT FALSE,
	_fts tsvector
);

CREATE TRIGGER users_ftstg BEFORE INSERT OR UPDATE
ON users FOR EACH ROW EXECUTE PROCEDURE
	tsvector_update_trigger(_fts, 'pg_catalog.russian', name1, name2, name3, phone, _role_id);
CREATE INDEX users_ftsidx ON users USING gin(_fts);

CREATE INDEX users_by_role_idx ON users(_role_id);
CREATE INDEX users_sort_idx ON users(name1, name2, id);


INSERT INTO users(name1, name2, _login, _password, _role_id) VALUES('Администратор', 'Администратор', 'admin', 'moulin', 'admin');

CREATE TABLE users_sessions (
	id VARCHAR(32) PRIMARY KEY DEFAULT md5(to_char(now(), 'HH12:MI:SS:MS') || to_char(random(),'9D9999999999')),
	started TIMESTAMP NOT NULL DEFAULT now(),
	user_id INTEGER REFERENCES users(id) NOT NULL
);

CREATE TABLE users_messages (
	id SERIAL PRIMARY KEY,
	send_date timestamp NOT NULL,
	to_id INTEGER REFERENCES users NOT NULL,
	from_id INTEGER REFERENCES users NOT NULL,
	confirmed BOOL DEFAULT FALSE,
	title VARCHAR(200),
	content TEXT NOT NULL
);

CREATE INDEX idx_users_messages_to ON users_messages(to_id, send_date DESC);
CREATE INDEX idx_users_messages_to_unread ON users_messages(to_id, send_date DESC) WHERE NOT confirmed;
CREATE INDEX idx_users_messages_from ON users_messages(from_id, send_date DESC);
CREATE INDEX idx_users_messages_history ON users_messages(to_id, from_id, send_date DESC);

CREATE TABLE groups (
	id SERIAL PRIMARY KEY,
	name VARCHAR(100) NOT NULL,
	description TEXT,
	manager_id INTEGER REFERENCES users
);

CREATE TABLE groups_users (
	group_id INTEGER REFERENCES groups,
	user_id INTEGER REFERENCES users,
	PRIMARY KEY(group_id, user_id)
);

CREATE INDEX idx_groups_users ON groups_users(user_id, group_id);


CREATE TABLE forums (
	
);

CREATE TABLE forums_messages (
	
);

CREATE TABLE forums_users (
	
);

CREATE TABLE forums_groups (
	
);




