-- Протоколы соревнований, загружаемые федерациями (ответ Адыла №5).
-- Лестница: Подан → На проверке → [На доработке] → Опубликован (Отклонён/Отозван).

CREATE TABLE protocol_submissions (
    id BIGSERIAL PRIMARY KEY,
    app_no VARCHAR(50) NOT NULL UNIQUE,
    federation_name VARCHAR(255) NOT NULL,
    sport VARCHAR(100),
    event_name VARCHAR(255) NOT NULL,
    event_date DATE,
    level VARCHAR(100),
    city VARCHAR(100),
    phone VARCHAR(50),
    email VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'Подан',
    submit_date DATE,
    deadline DATE,
    reject_reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE protocol_results (
    id BIGSERIAL PRIMARY KEY,
    protocol_submission_id BIGINT NOT NULL REFERENCES protocol_submissions(id) ON DELETE CASCADE,
    athlete_name VARCHAR(255),
    discipline VARCHAR(120),
    place INT,
    medal_type VARCHAR(40)
);

CREATE TABLE protocol_submission_history (
    id BIGSERIAL PRIMARY KEY,
    protocol_submission_id BIGINT NOT NULL REFERENCES protocol_submissions(id) ON DELETE CASCADE,
    action VARCHAR(500),
    user_name VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_protocol_status ON protocol_submissions(status);

-- Демо-протоколы
INSERT INTO protocol_submissions
  (app_no, federation_name, sport, event_name, event_date, level, city, phone, email, status, submit_date, deadline) VALUES
 ('PR-20260622-0001', 'Федерация бокса КР',           'Бокс',           'Чемпионат КР по боксу 2026',           '2026-06-15', 'Республиканский', 'г. Бишкек', '+996312611005', 'boxing@sport.kg', 'Подан',       '2026-06-22', '2026-06-29'),
 ('PR-20260618-0002', 'Федерация дзюдо КР',           'Дзюдо',          'Кубок Республики по дзюдо',            '2026-06-10', 'Республиканский', 'г. Ош',     '+996312611004', 'judo@sport.kg',   'На проверке', '2026-06-18', '2026-06-25'),
 ('PR-20260601-0003', 'Федерация лёгкой атлетики КР', 'Лёгкая атлетика','Первенство КР среди юниоров',          '2026-05-25', 'Республиканский', 'г. Бишкек', '+996312611001', 'athletics@sport.kg','Опубликован','2026-06-01', NULL);

-- Результаты к протоколам
INSERT INTO protocol_results (protocol_submission_id, athlete_name, discipline, place, medal_type) VALUES
 (1, 'Азисбеков Атабек',     'до 75 кг', 1, 'Золото'),
 (1, 'Орозбеков Бекзат',     'до 75 кг', 2, 'Серебро'),
 (1, 'Маматов Темир',        'до 81 кг', 1, 'Золото'),
 (2, 'Жуманазарова Мээрим',  'до 57 кг', 1, 'Золото'),
 (2, 'Касымова Нурайым',     'до 63 кг', 3, 'Бронза'),
 (3, 'Махмудов Акжол',       '100 м',    1, 'Золото'),
 (3, 'Тыныбекова Айсулуу',   '400 м',    2, 'Серебро');
