-- Переход спортсмена в другой клуб (ответ Адыла №13: подтверждают старый клуб, новый клуб и федерация).

-- Текущий клуб спортсмена в реестре (обновляется при оформлении перехода)
ALTER TABLE athletes ADD COLUMN club VARCHAR(255);

CREATE TABLE transfer_applications (
    id BIGSERIAL PRIMARY KEY,
    app_no VARCHAR(50) NOT NULL UNIQUE,
    athlete_id BIGINT,
    athlete_name VARCHAR(255) NOT NULL,
    sport VARCHAR(100),
    old_club VARCHAR(255),
    new_club VARCHAR(255),
    region VARCHAR(100),
    reason VARCHAR(500),
    phone VARCHAR(50),
    email VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'Подана',
    docs_uploaded INT NOT NULL DEFAULT 0,
    docs_total INT NOT NULL DEFAULT 0,
    deadline DATE,
    submit_date DATE,
    reject_reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transfer_application_history (
    id BIGSERIAL PRIMARY KEY,
    transfer_application_id BIGINT NOT NULL REFERENCES transfer_applications(id) ON DELETE CASCADE,
    action VARCHAR(500),
    user_name VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_transfer_status ON transfer_applications(status);

-- Демо-заявки по статусам цепочки подтверждений (привязаны к спортсменам из V5)
INSERT INTO transfer_applications
  (app_no, athlete_id, athlete_name, sport, old_club, new_club, region, reason, phone, email,
   status, docs_uploaded, docs_total, deadline, submit_date) VALUES
 ('TF-20260622-0001', 5, 'Орозбеков Бекзат',     'Бокс',           'СДЮСШОР г. Ош',        'ЦСКА Бишкек',           'г. Бишкек', 'Переезд в столицу',           '+996700111222', 'oroz@mail.kg',  'Подана',                       3, 3, '2026-07-08', '2026-06-22'),
 ('TF-20260620-0002', 8, 'Маматов Темир',        'Самбо',          'Клуб «Алмаз»',         'Клуб «Манас»',          'г. Бишкек', 'Смена тренера',               '+996700333444', 'mamatov@mail.kg','Подтверждён старым клубом',    3, 3, '2026-07-06', '2026-06-20'),
 ('TF-20260618-0003', 1, 'Махмудов Акжол',       'Вольная борьба', 'Клуб «Барс» Чуй',      'СДЮСШОР г. Бишкек',     'Чуйская',   'Переход в спортшколу высшего',  '+996700555666', 'mahmudov@mail.kg','Подтверждён новым клубом',    3, 3, '2026-07-04', '2026-06-18'),
 ('TF-20260610-0004', 3, 'Жуманазарова Мээрим',  'Дзюдо',          'Клуб «Шер»',           'Клуб «Ак-Шумкар»',      'г. Бишкек', 'Семейные обстоятельства',     '+996700777888', 'jum@mail.kg',   'Подтверждён федерацией',       3, 3, '2026-06-30', '2026-06-10'),
 ('TF-20260520-0005', 6, 'Касымова Нурайым',     'Дзюдо',          'СДЮСШОР Нарын',        'Клуб «Ак-Шумкар» Бишкек','г. Бишкек', 'Переезд',                     '+996700999000', 'kasymova@mail.kg','Переход оформлен',           3, 3, NULL,         '2026-05-20'),
 ('TF-20260515-0006', 7, 'Сатыбалдиев Эрлан',    'Тяжёлая атлетика','Клуб «Динамо»',       'Клуб «Жеңиш»',          'Иссык-Кульская','Конфликт с руководством',   '+996700121212', 'saty@mail.kg',  'Отклонена',                    2, 3, NULL,         '2026-05-15');

-- Завершённый переход отражён в реестре спортсмена
UPDATE athletes SET club = 'Клуб «Ак-Шумкар» Бишкек' WHERE id = 6;
