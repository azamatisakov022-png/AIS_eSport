-- Свидетельство тренера: срок действия 3 года (ответ Адыла №9).
ALTER TABLE trainer_applications ADD COLUMN cert_issue_date DATE;
ALTER TABLE trainer_applications ADD COLUMN cert_end_date DATE;

-- Демо-заявки тренеров по статусам фронтенда (submitted/review/revision/registered/rejected/annulled)
INSERT INTO trainer_applications
  (app_no, applicant_name, birth_date, phone, email, sport, submit_date, status, docs_uploaded, docs_total,
   cert_number, cert_issue_date, cert_end_date, tunduk_verified, deadline) VALUES
 ('TR-20260615-0001', 'Асанов Бакыт Маратович',          '1985-04-12', '+996555112233', 'asanov@mail.kg',     'Дзюдо',           '2026-06-15', 'submitted', 5, 5, NULL,               NULL,         NULL,         false, '2026-07-06'),
 ('TR-20260612-0002', 'Кулматова Айгерим Сагынбековна',   '1990-08-22', '+996700445566', 'kulmatova@gmail.com','Лёгкая атлетика', '2026-06-12', 'review',    5, 5, NULL,               NULL,         NULL,         true,  '2026-07-03'),
 ('TR-20260610-0003', 'Джумабаев Эрлан Калыкович',        '1988-01-30', '+996777889900', 'jumabaev@inbox.kg',  'Бокс',            '2026-06-10', 'revision',  3, 5, NULL,               NULL,         NULL,         false, '2026-07-01'),
 ('TR-20260520-0004', 'Бейшеналиев Данияр Кубатович',     '1982-06-18', '+996700998877', 'beish@mail.kg',      'Борьба',          '2026-05-20', 'registered',5, 5, 'СВ-КР-2026-00001', '2026-06-02', '2029-06-02', true,  NULL),
 ('TR-20260525-0005', 'Абдылдаев Нурбек Турдумаматович',  '1995-03-08', '+996555667788', 'abdyldaev@gmail.com','Тхэквондо',       '2026-05-25', 'rejected',  3, 5, NULL,               NULL,         NULL,         false, NULL),
 ('TR-20250118-0006', 'Жумагулов Тимур Эркинович',        '1991-07-20', '+996555998877', 'jumagulov@mail.kg',  'Шахматы',         '2025-01-18', 'annulled',  5, 5, 'СВ-КР-2025-00042', '2025-02-01', '2028-02-01', false, NULL),
 ('TR-20260618-0007', 'Касымова Жылдыз Болотбековна',     '1994-02-28', '+996700112299', 'kasymova@gmail.com', 'Гимнастика',      '2026-06-18', 'submitted', 4, 5, NULL,               NULL,         NULL,         true,  '2026-07-09');
