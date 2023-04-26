ALTER TABLE `items`
ADD `percent` INT(11) UNSIGNED DEFAULT 0;

UPDATE `items`
SET `percent` = 0;
 