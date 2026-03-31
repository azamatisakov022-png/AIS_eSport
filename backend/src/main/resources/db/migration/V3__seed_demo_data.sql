-- =============================================================================
-- V3__seed_demo_data.sql
-- AIS eSport - Demo users for development and testing
-- Password for all users: password123
-- BCrypt hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- =============================================================================

INSERT INTO users (username, email, password_hash, full_name, phone, role, department, is_active, is_blocked, failed_attempts, created_at, updated_at)
VALUES
    ('superadmin', 'superadmin@gafkis.kg', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
     'Суперадмин Системы', '+996700000001', 'SUPERADMIN', 'IT отдел', true, false, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('admin', 'admin@gafkis.kg', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
     'Администратор Системы', '+996700000002', 'ADMIN', 'Администрация', true, false, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('employee', 'employee@gafkis.kg', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
     'Иванов Петр Сергеевич', '+996700000003', 'EMPLOYEE', 'Отдел спорта', true, false, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('athlete', 'athlete@gafkis.kg', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
     'Асанов Бакыт Маратович', '+996700000004', 'ATHLETE', NULL, true, false, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('coach', 'coach@gafkis.kg', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
     'Сыдыков Эрлан Жумабекович', '+996700000005', 'COACH', NULL, true, false, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),

    ('judge', 'judge@gafkis.kg', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
     'Токтосунова Айнура Калысовна', '+996700000006', 'JUDGE', NULL, true, false, 0, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
