-- use mydb;
-------------- "Таблица state" 
INSERT INTO `mydb`.`state` (`id`,`name`) VALUES (1,'Комплектование');
INSERT INTO `mydb`.`state` (`id`,`name`) VALUES (2,'Закупка');
INSERT INTO `mydb`.`state` (`id`,`name`) VALUES (3,'Закупка - Согласование договора');
INSERT INTO `mydb`.`state` (`id`,`name`) VALUES (4,'Закупка - Исполнение договора');
INSERT INTO `mydb`.`state` (`id`,`name`) VALUES (5,'Укомплектован');

-------------- "Таблица type" 
INSERT INTO `mydb`.`type` (`id`,`name`) VALUES (1,'Сборочная единица');
INSERT INTO `mydb`.`type` (`id`,`name`) VALUES (2,'Материал');
INSERT INTO `mydb`.`type` (`id`,`name`) VALUES (3,'Деталь');
INSERT INTO `mydb`.`type` (`id`,`name`) VALUES (4,'Программное обеспечение');
INSERT INTO `mydb`.`type` (`id`,`name`) VALUES (5,'Комплект');
INSERT INTO `mydb`.`type` (`id`,`name`) VALUES (6,'Комплект принадлежностей');
INSERT INTO `mydb`.`type` (`id`,`name`) VALUES (7,'Прочее изделие');
INSERT INTO `mydb`.`type` (`id`,`name`) VALUES (8,'Часть прочего изделия');
INSERT INTO `mydb`.`type` (`id`,`name`) VALUES (9,'Документ');
INSERT INTO `mydb`.`type` (`id`,`name`) VALUES (10,'Стандартное изделие');

-------------- "Таблица contracttype"
INSERT INTO `mydb`.`contracttype` (`id`,`name`) VALUES (1,'Сервис');
INSERT INTO `mydb`.`contracttype` (`id`,`name`) VALUES (2,'Серия');

-------------- "Таблица product"
INSERT INTO `mydb`.`product` (`id`, `name`, `code`, `isMain`, `count`, `idType`, `idState`) VALUES ('1', 'ВОЙСКОВОЙ «ЭЛЕКТРОННЫЙ ПОЛИГОН» ДЛЯ УДАРНЫХ ВЕРТОЛЕТНЫХ КОМПЛЕКСОВ (УМВПК-ВЭП-УВК)', 'ТСЮИ.461271.090', '1', '1', '1', '1');
INSERT INTO `mydb`.`product` (`id`, `name`, `code`, `isMain`, `count`, `idType`, `idState`) VALUES ('2', 'Система имитации разрывов полевая многоразовая (ПМСИР-С) ', 'ТСЮИ.461214.005', '1', '8', '1', '1');
INSERT INTO `mydb`.`product` (`id`, `name`, `code`, `isMain`, `count`, `idType`, `idState`) VALUES ('3', 'Система мишенной обстановки (СМО-С)', 'ТСЮИ.461214.006', '1', '1', '1', '1');
INSERT INTO `mydb`.`product` (`id`, `name`, `code`, `isMain`, `count`, `idType`, `idState`) VALUES ('4', 'Комплект имитатора средств связи, наблюдения и управления передового авианаводчика (КИ ССНУ ПАН-С)', 'ТСЮИ.461963.002', '1', '1', '1', '1');
INSERT INTO `mydb`.`product` (`id`, `name`, `code`, `isMain`, `count`, `idType`, `idState`) VALUES ('5', 'Имитатор пуска и наведения оружия бортовой электронный (БЭИПНО УВК Ми-28Н)', 'ТСЮИ.462989.004', '1', '8', '1', '1');
INSERT INTO `mydb`.`product` (`id`, `name`, `code`, `isMain`, `count`, `idType`, `idState`) VALUES ('6', 'Имитатор пуска и наведения оружия бортовой электронный (БЭИПНО УВК Ка-52)', 'ТСЮИ.462989.005', '1', '1', '1', '1');
INSERT INTO `mydb`.`product` (`id`, `name`, `code`, `isMain`, `count`, `idType`, `idState`) VALUES ('7', 'Пункт контроля и управления тренировкой наземный (НПКУ)', 'ТСЮИ.468369.054', '1', '1', '1', '1');
INSERT INTO `mydb`.`product` (`id`, `name`, `code`, `isMain`, `count`, `idType`, `idState`) VALUES ('8', 'Схема электрическая общая', 'ТСЮИ.461271.090Э6', '0', '1', '9', '1');
INSERT INTO `mydb`.`product` (`id`, `name`, `code`, `isMain`, `count`, `idType`, `idState`) VALUES ('9', 'Ведомость покупных изделий', 'ТСЮИ.461271.090ВП', '0', '1', '9', '1');
INSERT INTO `mydb`.`product` (`id`, `name`, `code`, `isMain`, `count`, `idType`, `idState`) VALUES ('10', 'Технические условия', 'ТСЮИ.461271.090ТУ', '0', '1', '9', '1');
INSERT INTO `mydb`.`product` (`id`, `name`, `code`, `isMain`, `count`, `idType`, `idState`) VALUES ('11', 'Технические условия Лист утверждения', 'ТСЮИ.461271.090ТУ-ЛУ', '0', '1', '9', '1');
INSERT INTO `mydb`.`product` (`id`, `name`, `code`, `isMain`, `count`, `idType`, `idState`) VALUES ('12', 'Руководство по эксплуатации', 'ТСЮИ.461271.090РЭ', '0', '1', '9', '1');
INSERT INTO `mydb`.`product` (`id`, `name`, `code`, `isMain`, `count`, `idType`, `idState`) VALUES ('13', 'Руководство по эксплуатации Лист утверждения', 'ТСЮИ.461271.090РЭ-ЛУ', '0', '1', '9', '1');
INSERT INTO `mydb`.`product` (`id`, `name`, `code`, `isMain`, `count`, `idType`, `idState`) VALUES ('14', 'Формуляр', 'ТСЮИ.461271.090ФО', '0', '1', '9', '1');
INSERT INTO `mydb`.`product` (`id`, `name`, `code`, `isMain`, `count`, `idType`, `idState`) VALUES ('15', 'Формуляр Лист утверждения', 'ТСЮИ.461271.090ФО-ЛУ', '0', '1', '9', '1');
INSERT INTO `mydb`.`product` (`id`, `name`, `code`, `isMain`, `count`, `idType`, `idState`) VALUES ('16', 'Ведомость ЗИП', 'ТСЮИ.461271.090ЗИ', '0', '1', '9', '1');
INSERT INTO `mydb`.`product` (`id`, `name`, `code`, `isMain`, `count`, `idType`, `idState`) VALUES ('17', 'Ведомость ЗИП Лист утверждения', 'ТСЮИ.461271.090ЗИ-ЛУ', '0', '1', '9', '1');
INSERT INTO `mydb`.`product` (`id`, `name`, `code`, `isMain`, `count`, `idType`, `idState`) VALUES ('18', 'Этикетка', 'ТСЮИ.754463.336-05', '0', '1', '3', '1');
INSERT INTO `mydb`.`product` (`id`, `name`, `code`, `isMain`, `count`, `idType`, `idState`) VALUES ('19', 'Ведомость эксплуатационных документов', 'ТСЮИ.461271.090ВЭ', '0', '1', '5', '1');
INSERT INTO `mydb`.`product` (`id`, `name`, `code`, `isMain`, `count`, `idType`, `idState`) VALUES ('20', 'Ведомость эксплуатационных документов Лист утверждения', 'ТСЮИ.461271.090ВЭ-ЛУ', '0', '1', '5', '1');
INSERT INTO `mydb`.`product` (`id`, `name`, `code`, `isMain`, `count`, `idType`, `idState`) VALUES ('21', 'Комплект инструмента и принадлежностей Навигационная аппаратура потребителей глобальных навигационных спутниковых систем ГЛОНАСС/GPS \"Бриз-КМ-ГС\"- навигационный гидрографический комплект  14Ц856', 'ТДЦК.461513.069', '0', '1', '5', '1');
INSERT INTO `mydb`.`product` (`id`, `name`, `code`, `isMain`, `count`, `idType`, `idState`) VALUES ('22', 'Упаковка', 'КЛИВ.305642.003', '0', '1', '5', '1');


-- -------------- "Таблица parentchildlist"
INSERT INTO `mydb`.`parentchildlist` (`id`, `idParent`, `idChild`) VALUES ('1', '1', '2');
INSERT INTO `mydb`.`parentchildlist` (`id`, `idParent`, `idChild`) VALUES ('2', '1', '3');
INSERT INTO `mydb`.`parentchildlist` (`id`, `idParent`, `idChild`) VALUES ('3', '1', '4');
INSERT INTO `mydb`.`parentchildlist` (`id`, `idParent`, `idChild`) VALUES ('4', '1', '5');
INSERT INTO `mydb`.`parentchildlist` (`id`, `idParent`, `idChild`) VALUES ('5', '1', '6');
INSERT INTO `mydb`.`parentchildlist` (`id`, `idParent`, `idChild`) VALUES ('6', '1', '7');
INSERT INTO `mydb`.`parentchildlist` (`id`, `idParent`, `idChild`) VALUES ('7', '1', '8');
INSERT INTO `mydb`.`parentchildlist` (`id`, `idParent`, `idChild`) VALUES ('8', '1', '9');
INSERT INTO `mydb`.`parentchildlist` (`id`, `idParent`, `idChild`) VALUES ('9', '1', '10');
INSERT INTO `mydb`.`parentchildlist` (`id`, `idParent`, `idChild`) VALUES ('10', '1', '11');
INSERT INTO `mydb`.`parentchildlist` (`id`, `idParent`, `idChild`) VALUES ('11', '1', '12');
INSERT INTO `mydb`.`parentchildlist` (`id`, `idParent`, `idChild`) VALUES ('12', '1', '13');
INSERT INTO `mydb`.`parentchildlist` (`id`, `idParent`, `idChild`) VALUES ('13', '1', '14');
INSERT INTO `mydb`.`parentchildlist` (`id`, `idParent`, `idChild`) VALUES ('14', '1', '15');
INSERT INTO `mydb`.`parentchildlist` (`id`, `idParent`, `idChild`) VALUES ('15', '1', '16');
INSERT INTO `mydb`.`parentchildlist` (`id`, `idParent`, `idChild`) VALUES ('16', '1', '17');
INSERT INTO `mydb`.`parentchildlist` (`id`, `idParent`, `idChild`) VALUES ('17', '1', '18');
INSERT INTO `mydb`.`parentchildlist` (`id`, `idParent`, `idChild`) VALUES ('18', '1', '19');
INSERT INTO `mydb`.`parentchildlist` (`id`, `idParent`, `idChild`) VALUES ('19', '1', '20');
INSERT INTO `mydb`.`parentchildlist` (`id`, `idParent`, `idChild`) VALUES ('20', '1', '21');
INSERT INTO `mydb`.`parentchildlist` (`id`, `idParent`, `idChild`) VALUES ('21', '1', '22');

