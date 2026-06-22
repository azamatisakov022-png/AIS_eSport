-- Заявки на присвоение судейских категорий (ответ Адыла №10, 2026-06-22).
-- Лестница: Подана → Проверка документов → [На доработке] → Аттестация →
--           (agency: Рассмотрение комиссией) → Присвоено → Выдано удостоверение
--           (international: Согласование Агентства → Передано в международную федерацию → Записано)

CREATE TABLE judge_applications (
    id BIGSERIAL PRIMARY KEY,
    app_no VARCHAR(50) NOT NULL UNIQUE,
    applicant_name VARCHAR(255) NOT NULL,
    inn VARCHAR(20),
    phone VARCHAR(50),
    email VARCHAR(255),
    sport VARCHAR(100),
    current_category VARCHAR(100),
    requested_category VARCHAR(100) NOT NULL,
    events_served INT,
    experience_years INT,
    region VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'Подана',
    docs_uploaded INT NOT NULL DEFAULT 0,
    docs_total INT NOT NULL DEFAULT 0,
    deadline DATE,
    submit_date DATE,
    reject_reason TEXT,
    judge_id BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE judge_application_history (
    id BIGSERIAL PRIMARY KEY,
    judge_application_id BIGINT NOT NULL REFERENCES judge_applications(id) ON DELETE CASCADE,
    action VARCHAR(500),
    user_name VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_judge_app_status ON judge_applications(status);

-- Демо-заявки по всем статусам и 3 трекам
INSERT INTO judge_applications
  (app_no, applicant_name, inn, phone, email, sport, current_category, requested_category,
   events_served, experience_years, region, status, docs_uploaded, docs_total, deadline, submit_date) VALUES
 ('JD-20260622-0001', 'Сапаров Эрлан Болотович',     '20512199001011', '+996700111222', 'saparov@mail.kg',   'Бокс',            'III категория', 'II категория',          18, 4, 'Чуйская',  'Подана',                            2, 4, '2026-07-01', '2026-06-22'),
 ('JD-20260620-0002', 'Бекова Айдана Маратовна',      '21803199502022', '+996700333444', 'bekova@gmail.com',  'Плавание',        NULL,            'III категория',         12, 3, 'Бишкек',   'Проверка документов',               4, 4, '2026-06-30', '2026-06-20'),
 ('JD-20260618-0003', 'Осмонов Тилек Кадырович',      '22405198803033', '+996555555666', 'osmonov@inbox.kg',  'Дзюдо',           'II категория',  'I категория',           30, 7, 'Ош',       'Аттестация',                        4, 4, '2026-07-06', '2026-06-18'),
 ('JD-20260610-0004', 'Маматова Гулнара Токтосуновна','21607198504044', '+996700777888', 'mamatova@mail.kg',  'Лёгкая атлетика', 'I категория',   'Национальная категория',45, 12,'Бишкек',   'Рассмотрение комиссией',            5, 5, '2026-07-08', '2026-06-10'),
 ('JD-20260605-0005', 'Сыдыков Эркин Бакирович',      '20911198006055', '+996777999000', 'sydykov@gmail.com', 'Борьба',          'Национальная',  'Высшая национальная категория',60,15,'Ош',       'Присвоено',                         5, 5, '2026-07-03', '2026-06-05'),
 ('JD-20260528-0006', 'Кадыров Руслан Байышович',     '21301197507066', '+996555101010', 'kadyrov@mail.kg',   'Каратэ',          'Высшая национальная','Международная категория',80,20,'Джалал-Абадская','Согласование Агентства',     6, 6, '2026-07-10', '2026-05-28'),
 ('JD-20260520-0007', 'Усенова Назгуль Эрмековна',    '21906199208077', '+996700121212', 'usenova@gmail.com', 'Гимнастика',      'I категория',   'Национальная категория',38, 9, 'Бишкек',   'Выдано удостоверение',              5, 5, NULL,         '2026-05-20');
