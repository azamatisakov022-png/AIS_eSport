-- Заявки на восстановление (выдачу дубликата) спортивного документа (ответ Адыла №11).
-- Лестница: Подана → Проверка документов → [На доработке] → Приказ подписан → Выдан дубликат.

CREATE TABLE restoration_applications (
    id BIGSERIAL PRIMARY KEY,
    app_no VARCHAR(50) NOT NULL UNIQUE,
    applicant_name VARCHAR(255) NOT NULL,
    inn VARCHAR(20),
    phone VARCHAR(50),
    email VARCHAR(255),
    doc_type VARCHAR(120) NOT NULL,
    reason VARCHAR(120),
    old_number VARCHAR(80),
    issue_date DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'Подана',
    docs_uploaded INT NOT NULL DEFAULT 0,
    docs_total INT NOT NULL DEFAULT 0,
    deadline DATE,
    submit_date DATE,
    dup_number VARCHAR(80),
    old_invalidated BOOLEAN NOT NULL DEFAULT FALSE,
    reject_reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE restoration_application_history (
    id BIGSERIAL PRIMARY KEY,
    restoration_application_id BIGINT NOT NULL REFERENCES restoration_applications(id) ON DELETE CASCADE,
    action VARCHAR(500),
    user_name VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_restoration_status ON restoration_applications(status);

-- Демо-заявки по всем статусам
INSERT INTO restoration_applications
  (app_no, applicant_name, inn, phone, email, doc_type, reason, old_number, issue_date,
   status, docs_uploaded, docs_total, deadline, submit_date, dup_number, old_invalidated) VALUES
 ('RD-20260622-0001', 'Сапаров Эрлан Болотович',    '20512199001011', '+996700111222', 'saparov@mail.kg',  'Судейское удостоверение',          'Утеря',              'УД-КР-2024-0078', '2024-03-12', 'Подана',              2, 2, '2026-07-01', '2026-06-22', NULL,               false),
 ('RD-20260620-0002', 'Бекова Айдана Маратовна',     '21803199502022', '+996700333444', 'bekova@gmail.com', 'Свидетельство о спортивном звании','Порча / повреждение','СВ-КР-2025-00120','2025-05-10', 'Проверка документов', 2, 2, '2026-06-30', '2026-06-20', NULL,               false),
 ('RD-20260618-0003', 'Осмонов Тилек Кадырович',     '22405198803033', '+996555555666', 'osmonov@inbox.kg', 'Тренерский сертификат',            'Кража',              'СВ-КР-2024-00045','2024-02-15', 'Приказ подписан',     3, 3, '2026-06-29', '2026-06-18', NULL,               false),
 ('RD-20260601-0004', 'Маматова Гулнара Токтосуновна','21607198504044','+996700777888', 'mamatova@mail.kg', 'Судейское удостоверение',          'Утеря',              'УД-КР-2023-0034', '2023-01-18', 'Выдан дубликат',      3, 3, NULL,         '2026-06-01', 'ДУБ-КР-2026-0001', true),
 ('RD-20260528-0005', 'Кадыров Руслан Байышович',    '21301197507066', '+996555101010', 'kadyrov@mail.kg',  'Удостоверение к медали / награде', 'Порча / повреждение','НГ-КР-2022-0011', '2022-11-30', 'Отклонена',           1, 2, NULL,         '2026-05-28', NULL,               false);
