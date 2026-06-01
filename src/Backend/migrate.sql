-- Run this once in MySQL Workbench to add token expiry support
USE ai_resume;

ALTER TABLE auth
ADD COLUMN reset_token_expiry DATETIME DEFAULT NULL;
