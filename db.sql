CREATE DATABASE IF NOT EXISTS shopping;
USE shopping;
DROP TABLE IF EXISTS shopping_items;
CREATE TABLE shopping_items(
	item_id INT PRIMARY KEY, name VARCHAR(50) NOT NULL, amount INT DEFAULT 1, bought BOOLEAN
);
