CREATE TABLE `rolemaster` (
	`roleid` int8 unsigned not null unique auto_increment,
    `rolename` VARCHAR(20) NOT NULL,
    `createdby` VARCHAR(50) NOT NULL,
    `createddate` DATETIME NOT NULL,
    `lastmodifiedby` VARCHAR(50),
    `lastmodifieddate` DATETIME,
    `isactive` boolean not null,
    PRIMARY KEY (roleid),
    INDEX (rolename)
);

ALTER TABLE  rolemaster ADD UNIQUE (`rolename`);

CREATE TABLE `usermaster` (
  `usermasterid` bigint unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(150) NOT NULL,
  `roleid` bigint unsigned NOT NULL,
  `mobileno` varchar(15) NOT NULL,
  `emailaddress` varchar(150) NOT NULL unique,
  `address` text,
  `password` varchar(255) NOT NULL,
  `createdby` varchar(50) NOT NULL,
  `createddate` datetime NOT NULL,
  `lastmodifiedby` varchar(50) DEFAULT NULL,
  `lastmodifieddate` datetime DEFAULT NULL,
  `isactive` tinyint(1) NOT NULL,
  PRIMARY KEY (`usermasterid`),
  INDEX (emailaddress),
  INDEX (mobileno),
  FOREIGN KEY (`roleid`)
        REFERENCES rolemaster (`roleid`)
        ON DELETE no action ON UPDATE CASCADE
);

ALTER TABLE  usermaster ADD UNIQUE (`mobileno`);

CREATE TABLE `carmaster` (
	`carmasterid` int8 unsigned not null unique auto_increment,
    `carno` VARCHAR(255)  NOT NULL,
    `longitude` VARCHAR(255)  NOT NULL,
    `latitude` VARCHAR(255)  NOT NULL,
    `usermasterid` bigint unsigned NOT NULL,
    `ridestatus` VARCHAR(20) NOT NULL,
    `createdby` VARCHAR(50) NOT NULL,
    `createddate` DATETIME NOT NULL,
    `lastmodifiedby` VARCHAR(50),
    `lastmodifieddate` DATETIME,
    `isactive` boolean not null,
    PRIMARY KEY (carmasterid),
    FOREIGN KEY (`usermasterid`)
        REFERENCES usermaster (`usermasterid`)
        ON DELETE no action ON UPDATE no action,
    INDEX (carno)
);

ALTER TABLE  carmaster ADD UNIQUE (`carno`);

CREATE TABLE `ridehistory` (
	`ridehistoryid` int8 unsigned not null unique auto_increment,
    `carmasterid` bigint unsigned NOT NULL,
    `pickup_longitude` VARCHAR(255)  NOT NULL,
    `pickup_latitude` VARCHAR(255)  NOT NULL,
    `drop_longitude` varchar(255),
    `drop_latitude` varchar(255),
    `bookingotp` varchar(6) NOT NULL,
    `rideamount` bigint unsigned NOT NULL,
    `status` varchar(20) NOT NULL,
    `usermasterid` bigint unsigned NOT NULL,
    `createdby` VARCHAR(50) NOT NULL,
    `createddate` DATETIME NOT NULL,
    `lastmodifiedby` VARCHAR(50),
    `lastmodifieddate` DATETIME,
    `isactive` boolean not null,
    PRIMARY KEY (ridehistoryid),
    FOREIGN KEY (`usermasterid`)
        REFERENCES usermaster (`usermasterid`)
        ON DELETE no action ON UPDATE no action,
    FOREIGN KEY (`carmasterid`)
        REFERENCES carmaster (`carmasterid`)
        ON DELETE no action ON UPDATE no action
);

insert into rolemaster(rolename,createdby,createddate,isactive)
values('admin','9604896633',now(),true),('user','9604896633',now(),true),('driver','9604896633',now(),true);