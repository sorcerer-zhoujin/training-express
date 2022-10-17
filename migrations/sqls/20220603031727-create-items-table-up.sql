/* Replace with your SQL commands */
CREATE TABLE items (
                       `id` int(11) unsigned NOT NULL COMMENT "アイテムID",
                       `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL COMMENT "アイテム名",
                       `heal` int(11) unsigned NOT NULL COMMENT "回復量",
                       `price` int(11) unsigned NOT NULL COMMENT "値段",
                       PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
