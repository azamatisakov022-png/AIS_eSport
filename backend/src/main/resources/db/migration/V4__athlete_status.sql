-- Статусы спортсмена по ответам Управления развития массового спорта:
--  - верификация записи: DRAFT / IN_REVIEW / VERIFIED / REJECTED
--  - жизненный цикл:      ACTIVE / INACTIVE / SUSPENDED / DISQUALIFIED / RETIRED / EXCLUDED

ALTER TABLE athletes ADD COLUMN verification_status VARCHAR(20) NOT NULL DEFAULT 'DRAFT';
ALTER TABLE athletes ADD COLUMN lifecycle_status    VARCHAR(20) NOT NULL DEFAULT 'ACTIVE';
ALTER TABLE athletes ADD COLUMN status_note         VARCHAR(500);

-- Уже существующие записи считаем подтверждёнными (чтобы публичный список их показывал)
UPDATE athletes SET verification_status = 'VERIFIED';

CREATE INDEX idx_athletes_verification ON athletes(verification_status);
CREATE INDEX idx_athletes_lifecycle    ON athletes(lifecycle_status);

-- Исправление длины поля пола: enum STRING хранит 'MALE'/'FEMALE' (до 6 символов), а было VARCHAR(5)
ALTER TABLE athletes ALTER COLUMN sex TYPE VARCHAR(10);

-- Исправление демо-паролей: в сиде V3 был некорректный хэш. Пароль всех демо-пользователей: password123
UPDATE users SET password_hash = '$2b$10$bQDnLwvhyuLPlmAc7zDifeIQj7Fucx4JhSr6EvC1Lxcq31chJ3EJK';
