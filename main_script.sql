use mydb;
CREATE TABLE `company` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4;


CREATE TABLE `contact` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `number` varchar(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;


CREATE TABLE `contactcompanylist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idContact` int NOT NULL,
  `idCompany` int NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `id_contact_idx` (`idContact`),
  KEY `id_comp_idx` (`idCompany`),
  CONSTRAINT `id_comp` FOREIGN KEY (`idCompany`) REFERENCES `company` (`id`),
  CONSTRAINT `id_contact` FOREIGN KEY (`idContact`) REFERENCES `contact` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4;


CREATE TABLE `contracttype` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4;


CREATE TABLE `contractstatus` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `file` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE `governmentcontract` (
  `id` int NOT NULL AUTO_INCREMENT,
  `number` varchar(255) DEFAULT NULL,
  `innerNumber` varchar(255) DEFAULT NULL,
  `city` varchar(50) DEFAULT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `isActive` tinyint DEFAULT NULL,
  `idType` int DEFAULT NULL,
  `idStatus` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `id_conract_type_idx` (`idType`),
  KEY `id_contract_status_idx` (`idStatus`),
  CONSTRAINT `id_conract_type` FOREIGN KEY (`idType`) REFERENCES `contracttype` (`id`),
  CONSTRAINT `id_contract_status` FOREIGN KEY (`idStatus`) REFERENCES `contractstatus` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `state` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4;


CREATE TABLE `type` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `product` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT NULL,
  `code` varchar(255) DEFAULT NULL,
  `number` varchar(255) DEFAULT '0',
  `isMain` tinyint DEFAULT '0',
  `count` int DEFAULT '1',
  `idType` int DEFAULT NULL,
  `idState` int DEFAULT NULL,
  `idCompany` int DEFAULT NULL,
  `startDate` date DEFAULT NULL,
  `endDate` date DEFAULT NULL,
  `note` text DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idproduct_UNIQUE` (`id`),
  KEY `id_type_idx` (`idType`),
  KEY `id_state_idx` (`idState`),
  KEY `id_provider_idx` (`idCompany`),
  CONSTRAINT `id_provider` FOREIGN KEY (`idCompany`) REFERENCES `company` (`id`),
  CONSTRAINT `id_sstate` FOREIGN KEY (`idState`) REFERENCES `state` (`id`),
  CONSTRAINT `id_type` FOREIGN KEY (`idType`) REFERENCES `type` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=32 DEFAULT CHARSET=utf8mb4;

CREATE TABLE `parentchildlist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idParent` int DEFAULT NULL,
  `idChild` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `idparent_child_UNIQUE` (`id`),
  KEY `id_parent_idx` (`idParent`),
  KEY `id_child_idx` (`idChild`),
  CONSTRAINT `id_child` FOREIGN KEY (`idChild`) REFERENCES `product` (`id`),
  CONSTRAINT `id_parent` FOREIGN KEY (`idParent`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4;


CREATE TABLE `productcontractlist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idGovernmentContract` int DEFAULT NULL,
  `idProduct` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `id_gov_contract_idx` (`idGovernmentContract`),
  KEY `id_product_idx` (`idProduct`),
  CONSTRAINT `id_gov_contract` FOREIGN KEY (`idGovernmentContract`) REFERENCES `governmentcontract` (`id`),
  CONSTRAINT `id_product` FOREIGN KEY (`idProduct`) REFERENCES `product` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4;


CREATE TABLE `productfilelist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `idProduct` int DEFAULT NULL,
  `idFile` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`),
  KEY `id_productt_idx` (`idProduct`),
  KEY `id_file_idx` (`idFile`),
  CONSTRAINT `id_file` FOREIGN KEY (`idFile`) REFERENCES `file` (`id`),
  CONSTRAINT `id_productt` FOREIGN KEY (`idProduct`) REFERENCES `product` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `user` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_UNIQUE` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;