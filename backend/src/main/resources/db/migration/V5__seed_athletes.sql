-- Демо-спортсмены для реестра (с разными статусами верификации и жизненного цикла)
INSERT INTO athletes (full_name, birth_date, sex, region, sport, rank, coach_name, verification_status, lifecycle_status, created_at, updated_at) VALUES
 ('Махмудов Акжол',            '1999-09-25', 'MALE',   'Чуйская область', 'Вольная борьба', 'МСМК', 'Юсупов Р.',   'VERIFIED',  'ACTIVE',       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
 ('Тыныбекова Айсулуу',        '1993-04-19', 'FEMALE', 'г. Бишкек',       'Женская борьба', 'ЗМС',  'Асанов К.',   'VERIFIED',  'ACTIVE',       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
 ('Жуманазарова Мээрим',       '1998-02-10', 'FEMALE', 'г. Бишкек',       'Дзюдо',          'МС',   'Бакиров А.',  'VERIFIED',  'ACTIVE',       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
 ('Азисбеков Атабек',          '2001-07-14', 'MALE',   'Ошская область',  'Бокс',           'МС',   'Тологонов Б.','VERIFIED',  'ACTIVE',       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
 ('Орозбеков Бекзат',          '2003-11-30', 'MALE',   'г. Ош',           'Бокс',           'КМС',  'Тологонов Б.','IN_REVIEW', 'ACTIVE',       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
 ('Касымова Нурайым',          '2005-03-22', 'FEMALE', 'Нарынская область','Дзюдо',         '1 разряд','Бакиров А.','DRAFT',    'ACTIVE',       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
 ('Сатыбалдиев Эрлан',         '1996-06-08', 'MALE',   'Иссык-Кульская область','Тяжёлая атлетика','МС','Дуйшеев М.','VERIFIED','RETIRED',      CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
 ('Маматов Темир',             '2000-12-01', 'MALE',   'Джалал-Абадская область','Самбо',   'КМС',  'Осмонов С.',  'REJECTED',  'ACTIVE',       CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
