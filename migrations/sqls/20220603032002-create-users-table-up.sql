/* Replace with your SQL commands */
CREATE TABLE `users` (
                         `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT "ユーザーID",
                         `name` VARCHAR(50) NOT NULL DEFAULT '' COLLATE 'utf8mb4_general_ci' COMMENT "ユーザー名",
                         `password` VARCHAR(50) NOT NULL DEFAULT '' COLLATE 'utf8mb4_general_ci' COMMENT "パスワード",
                         `money` INT(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT "所持金",
                         `hp` INT(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT "体力",
                         PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
