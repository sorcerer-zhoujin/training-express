/* Replace with your SQL commands */
CREATE TABLE `users_items` (
                               `id` INT(10) UNSIGNED NOT NULL AUTO_INCREMENT COMMENT "ユーザー、アイテム紐づけID",
                               `user_id` INT(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT "ユーザーID",
                               `item_id` INT(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT "アイテムID",
                               `num` INT(10) UNSIGNED NOT NULL DEFAULT '0' COMMENT "所持数",
                               PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
