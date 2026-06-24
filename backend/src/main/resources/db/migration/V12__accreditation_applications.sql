-- Заявки на аккредитацию спортивных федераций (ответ Адыла №12).
-- Жизненный цикл: Подана → Проверка документов → [На доработке] → Аккредитована ↔ Приостановлена → Аккредитация отозвана.

CREATE TABLE accreditation_applications (
    id BIGSERIAL PRIMARY KEY,
    app_no VARCHAR(50) NOT NULL UNIQUE,
    federation_name VARCHAR(255) NOT NULL,
    sport VARCHAR(100),
    inn VARCHAR(20),
    head_name VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(255),
    organization_id BIGINT,
    status VARCHAR(50) NOT NULL DEFAULT 'Подана',
    docs_uploaded INT NOT NULL DEFAULT 0,
    docs_total INT NOT NULL DEFAULT 0,
    deadline DATE,
    submit_date DATE,
    accreditation_number VARCHAR(80),
    accreditation_end DATE,
    suspension_reason TEXT,
    reject_reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE accreditation_application_history (
    id BIGSERIAL PRIMARY KEY,
    accreditation_application_id BIGINT NOT NULL REFERENCES accreditation_applications(id) ON DELETE CASCADE,
    action VARCHAR(500),
    user_name VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_accreditation_status ON accreditation_applications(status);

-- Демо-заявки по статусам жизненного цикла
INSERT INTO accreditation_applications
  (app_no, federation_name, sport, inn, head_name, phone, email, status, docs_uploaded, docs_total,
   deadline, submit_date, accreditation_number, accreditation_end, suspension_reason) VALUES
 ('AC-20260622-0001', 'Федерация лёгкой атлетики КР', 'Лёгкая атлетика', '02501202010011', 'Асанбеков Кубат Мырзаевич',  '+996312611001', 'athletics@sport.kg', 'Подана',              4, 6, '2026-07-10', '2026-06-22', NULL,               NULL,         NULL),
 ('AC-20260618-0002', 'Федерация шахмат КР',          'Шахматы',         '02501202010022', 'Дуйшеева Назгуль Болотовна',  '+996312611002', 'chess@sport.kg',     'Проверка документов', 6, 6, '2026-07-08', '2026-06-18', NULL,               NULL,         NULL),
 ('AC-20260610-0003', 'Федерация тяжёлой атлетики КР','Тяжёлая атлетика','02501202010033', 'Осмонов Темир Калыкович',     '+996312611003', 'weight@sport.kg',    'На доработке',        4, 6, '2026-06-30', '2026-06-10', NULL,               NULL,         NULL),
 ('AC-20260515-0004', 'Федерация дзюдо КР',           'Дзюдо',           '02501202010044', 'Бакиров Азамат Сапарович',    '+996312611004', 'judo@sport.kg',      'Аккредитована',       6, 6, NULL,         '2026-05-15', 'АКР-2026-0001',    '2030-05-29', NULL),
 ('AC-20260401-0005', 'Федерация бокса КР',           'Бокс',            '02501202010055', 'Тологонов Бектур Асанович',   '+996312611005', 'boxing@sport.kg',    'Приостановлена',      6, 6, NULL,         '2026-04-01', 'АКР-2026-0002',    '2030-04-15', 'Нарушение регламента: непредставление годового отчёта и финансовой документации'),
 ('AC-20260320-0006', 'Федерация настольного тенниса КР','Настольный теннис','02501202010066','Маматова Айгуль Эркиновна', '+996312611006', 'tt@sport.kg',        'Отклонена',           3, 6, NULL,         '2026-03-20', NULL,               NULL,         NULL);
