

CREATE TABLE users (
	id SERIAL PRIMARY KEY,
	name1 VARCHAR(100) NOT NULL,
	name2 VARCHAR(100) NOT NULL,
	name3 VARCHAR(100),
	address TEXT,
	phone VARCHAR(100),
	photo BYTEA,
	_login VARCHAR(100) NOT NULL,
	_password VARCHAR(100) NOT NULL,
	_role VARCHAR(10) NOT NULL, --ENUM('teacher', 'student')
	_blocked BOOL DEFAULT FALSE
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




