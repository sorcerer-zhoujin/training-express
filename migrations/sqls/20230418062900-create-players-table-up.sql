/* Replace with your SQL commands */
CREATE TABLE `players` (
  `id` INT(11) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT "ユーザーID",
  `name` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci' COMMENT "ユーザー名",
  `password` VARCHAR(255) NOT NULL COLLATE 'utf8mb4_general_ci' COMMENT "パスワード",
  `money` INT(11) UNSIGNED NOT NULL COMMENT "所持金",
  `hp` INT(11) UNSIGNED NOT NULL COMMENT "体力",
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
