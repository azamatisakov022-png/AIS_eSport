# Схема БД АИС eSport

Всего таблиц: 38. Источник: backend/src/main/resources/db/migration (Flyway V1-V16).

## Пользователи и безопасность

### users

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| username | VARCHAR(100) NOT NULL UNIQUE |
| email | VARCHAR(255) NOT NULL UNIQUE |
| password_hash | VARCHAR(255) NOT NULL |
| full_name | VARCHAR(255) NOT NULL |
| phone | VARCHAR(50) |
| role | VARCHAR(30) NOT NULL DEFAULT 'EMPLOYEE' |
| department | VARCHAR(200) |
| linked_entity_type | VARCHAR(30) |
| linked_entity_id | BIGINT |
| is_active | BOOLEAN NOT NULL DEFAULT true |
| is_blocked | BOOLEAN NOT NULL DEFAULT false |
| last_login | TIMESTAMP |
| last_login_ip | VARCHAR(45) |
| failed_attempts | INT NOT NULL DEFAULT 0 |
| blocked_until | TIMESTAMP |
| created_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |

### refresh_tokens

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| user_id | BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE |
| token | VARCHAR(512) NOT NULL UNIQUE |
| expires_at | TIMESTAMP NOT NULL |
| created_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |
| revoked | BOOLEAN NOT NULL DEFAULT false |

Внешние ключи: `user_id` -> `users`

### audit_logs

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| user_id | BIGINT REFERENCES users(id) |
| user_name | VARCHAR(255) |
| action | VARCHAR(50) NOT NULL |
| entity_type | VARCHAR(100) |
| entity_id | BIGINT |
| details | JSONB |
| ip_address | VARCHAR(45) |
| created_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |

Внешние ключи: `user_id` -> `users`

### system_config

| Колонка | Тип и ограничения |
|---|---|
| key | VARCHAR(100) PRIMARY KEY |
| value | TEXT NOT NULL |
| description | VARCHAR(500) |
| updated_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |

### notifications

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| user_id | BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE |
| title | VARCHAR(500) NOT NULL |
| message | TEXT |
| type | VARCHAR(50) |
| is_read | BOOLEAN NOT NULL DEFAULT false |
| created_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |

Внешние ключи: `user_id` -> `users`

### applicant_notifications

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| recipient_email | VARCHAR(255) |
| recipient_name | VARCHAR(255) |
| service_type | VARCHAR(120) |
| app_no | VARCHAR(50) |
| status | VARCHAR(80) |
| message | TEXT |
| channel | VARCHAR(20) NOT NULL DEFAULT 'email' |
| is_read | BOOLEAN NOT NULL DEFAULT FALSE |
| created_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |

## Реестр спортсменов

### athletes

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| full_name | VARCHAR(255) NOT NULL |
| birth_date | DATE NOT NULL |
| sex | VARCHAR(5) NOT NULL |
| phone | VARCHAR(50) |
| email | VARCHAR(255) |
| region | VARCHAR(100) |
| sport | VARCHAR(100) |
| rank | VARCHAR(30) |
| coach_name | VARCHAR(255) |
| coach_id | BIGINT REFERENCES coaches(id) |
| organization_id | BIGINT REFERENCES organizations(id) |
| team_id | BIGINT REFERENCES teams(id) |
| med_exp_date | DATE |
| med_issued_date | DATE |
| med_issued_by | VARCHAR(255) |
| ins_exp_date | DATE |
| is_archived | BOOLEAN NOT NULL DEFAULT false |
| created_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |
| verification_status | VARCHAR(20) NOT NULL DEFAULT 'DRAFT' |
| lifecycle_status | VARCHAR(20) NOT NULL DEFAULT 'ACTIVE' |
| status_note | VARCHAR(500) |
| club | VARCHAR(255) |

Внешние ключи: `coach_id` -> `coaches`, `organization_id` -> `organizations`, `team_id` -> `teams`

### athlete_medals

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| athlete_id | BIGINT NOT NULL REFERENCES athletes(id) ON DELETE CASCADE |
| medal_type | VARCHAR(20) NOT NULL |
| event_name | VARCHAR(500) NOT NULL |
| year | INT NOT NULL |
| country | VARCHAR(100) |

Внешние ключи: `athlete_id` -> `athletes`

### documents

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| entity_type | VARCHAR(50) NOT NULL |
| entity_id | BIGINT NOT NULL |
| doc_type | VARCHAR(100) |
| file_name | VARCHAR(500) NOT NULL |
| file_size | BIGINT |
| mime_type | VARCHAR(100) |
| minio_key | VARCHAR(1000) NOT NULL |
| uploaded_by | BIGINT REFERENCES users(id) |
| verified | BOOLEAN NOT NULL DEFAULT false |
| created_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |

Внешние ключи: `uploaded_by` -> `users`

## Звания и разряды

### award_applications

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| app_no | VARCHAR(50) NOT NULL UNIQUE |
| athlete_id | BIGINT REFERENCES athletes(id) |
| applicant_name | VARCHAR(255) NOT NULL |
| award | VARCHAR(50) NOT NULL |
| sport | VARCHAR(100) |
| submit_date | DATE NOT NULL |
| status | VARCHAR(50) NOT NULL DEFAULT 'Подана' |
| docs_uploaded | INT NOT NULL DEFAULT 0 |
| docs_total | INT NOT NULL DEFAULT 0 |
| award_group | VARCHAR(5) |
| deadline | DATE |
| conclusion | TEXT |
| reject_reason | TEXT |
| created_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |

Внешние ключи: `athlete_id` -> `athletes`

### award_application_history

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| award_application_id | BIGINT NOT NULL REFERENCES award_applications(id) ON DELETE CASCADE |
| action | VARCHAR(500) NOT NULL |
| user_name | VARCHAR(255) |
| created_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |

Внешние ключи: `award_application_id` -> `award_applications`

### award_commission_members

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| award_application_id | BIGINT NOT NULL REFERENCES award_applications(id) ON DELETE CASCADE |
| name | VARCHAR(255) NOT NULL |
| position | VARCHAR(255) NOT NULL |

Внешние ключи: `award_application_id` -> `award_applications`

### award_deprivations

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| athlete_id | BIGINT REFERENCES athletes(id) |
| name | VARCHAR(255) NOT NULL |
| award | VARCHAR(50) NOT NULL |
| sport | VARCHAR(100) |
| reason | VARCHAR(255) NOT NULL |
| initiated_date | DATE NOT NULL |
| appeal_deadline | DATE |
| status | VARCHAR(50) NOT NULL DEFAULT 'На рассмотрении' |
| created_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |

Внешние ключи: `athlete_id` -> `athletes`

### award_restorations

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| athlete_id | BIGINT REFERENCES athletes(id) |
| name | VARCHAR(255) NOT NULL |
| award | VARCHAR(50) NOT NULL |
| sport | VARCHAR(100) |
| submit_date | DATE NOT NULL |
| deadline | DATE |
| votes | VARCHAR(100) |
| status | VARCHAR(50) NOT NULL DEFAULT 'На рассмотрении' |
| created_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |

Внешние ключи: `athlete_id` -> `athletes`

### restoration_applications

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| app_no | VARCHAR(50) NOT NULL UNIQUE |
| applicant_name | VARCHAR(255) NOT NULL |
| inn | VARCHAR(20) |
| phone | VARCHAR(50) |
| email | VARCHAR(255) |
| doc_type | VARCHAR(120) NOT NULL |
| reason | VARCHAR(120) |
| old_number | VARCHAR(80) |
| issue_date | DATE |
| status | VARCHAR(50) NOT NULL DEFAULT 'Подана' |
| docs_uploaded | INT NOT NULL DEFAULT 0 |
| docs_total | INT NOT NULL DEFAULT 0 |
| deadline | DATE |
| submit_date | DATE |
| dup_number | VARCHAR(80) |
| old_invalidated | BOOLEAN NOT NULL DEFAULT FALSE |
| reject_reason | TEXT |
| created_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |

### restoration_application_history

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| restoration_application_id | BIGINT NOT NULL REFERENCES restoration_applications(id) ON DELETE CASCADE |
| action | VARCHAR(500) |
| user_name | VARCHAR(255) |
| created_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |

Внешние ключи: `restoration_application_id` -> `restoration_applications`

## Тренеры

### coaches

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| full_name | VARCHAR(255) NOT NULL |
| birth_date | DATE NOT NULL |
| sex | VARCHAR(5) NOT NULL |
| phone | VARCHAR(50) |
| email | VARCHAR(255) |
| cert_number | VARCHAR(50) UNIQUE |
| reg_date | DATE NOT NULL |
| sport | VARCHAR(100) |
| rank | VARCHAR(100) |
| organization_id | BIGINT REFERENCES organizations(id) |
| employment | VARCHAR(30) NOT NULL DEFAULT 'Штатный' |
| region | VARCHAR(100) |
| annulled | BOOLEAN NOT NULL DEFAULT false |
| end_date | DATE |
| is_archived | BOOLEAN NOT NULL DEFAULT false |
| created_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |

Внешние ключи: `organization_id` -> `organizations`

### trainer_applications

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| app_no | VARCHAR(50) NOT NULL UNIQUE |
| applicant_name | VARCHAR(255) NOT NULL |
| birth_date | DATE |
| phone | VARCHAR(50) |
| email | VARCHAR(255) |
| sport | VARCHAR(100) |
| submit_date | DATE NOT NULL |
| status | VARCHAR(50) NOT NULL DEFAULT 'submitted' |
| docs_uploaded | INT NOT NULL DEFAULT 0 |
| docs_total | INT NOT NULL DEFAULT 5 |
| cert_number | VARCHAR(50) |
| tunduk_verified | BOOLEAN NOT NULL DEFAULT false |
| deadline | DATE |
| created_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |
| cert_issue_date | DATE |
| cert_end_date | DATE |
| reject_reason | TEXT |

## Судьи

### judges

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| full_name | VARCHAR(255) NOT NULL |
| birth_date | DATE NOT NULL |
| sex | VARCHAR(5) NOT NULL |
| phone | VARCHAR(50) |
| email | VARCHAR(255) |
| cert_number | VARCHAR(50) UNIQUE |
| category | VARCHAR(50) NOT NULL |
| attest_date | DATE |
| end_date | DATE |
| region | VARCHAR(100) |
| organization_id | BIGINT REFERENCES organizations(id) |
| annulled | BOOLEAN NOT NULL DEFAULT false |
| is_archived | BOOLEAN NOT NULL DEFAULT false |
| created_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |

Внешние ключи: `organization_id` -> `organizations`

### judge_sports

| Колонка | Тип и ограничения |
|---|---|
| judge_id | BIGINT NOT NULL REFERENCES judges(id) ON DELETE CASCADE |
| sport | VARCHAR(100) NOT NULL |

Внешние ключи: `judge_id` -> `judges`

### judge_applications

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| app_no | VARCHAR(50) NOT NULL UNIQUE |
| applicant_name | VARCHAR(255) NOT NULL |
| inn | VARCHAR(20) |
| phone | VARCHAR(50) |
| email | VARCHAR(255) |
| sport | VARCHAR(100) |
| current_category | VARCHAR(100) |
| requested_category | VARCHAR(100) NOT NULL |
| events_served | INT |
| experience_years | INT |
| region | VARCHAR(100) |
| status | VARCHAR(50) NOT NULL DEFAULT 'Подана' |
| docs_uploaded | INT NOT NULL DEFAULT 0 |
| docs_total | INT NOT NULL DEFAULT 0 |
| deadline | DATE |
| submit_date | DATE |
| reject_reason | TEXT |
| judge_id | BIGINT |
| created_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |

### judge_application_history

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| judge_application_id | BIGINT NOT NULL REFERENCES judge_applications(id) ON DELETE CASCADE |
| action | VARCHAR(500) |
| user_name | VARCHAR(255) |
| created_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |

Внешние ключи: `judge_application_id` -> `judge_applications`

## Организации и команды

### organizations

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| name | VARCHAR(500) NOT NULL |
| type | VARCHAR(50) NOT NULL |
| sport | VARCHAR(100) |
| inn | VARCHAR(14) |
| reg_date | DATE |
| region | VARCHAR(100) |
| address | TEXT |
| phone | VARCHAR(50) |
| email | VARCHAR(255) |
| website | VARCHAR(255) |
| head_name | VARCHAR(255) |
| head_title | VARCHAR(255) |
| accreditation | VARCHAR(50) NOT NULL DEFAULT 'На рассмотрении' |
| athletes_count | INT NOT NULL DEFAULT 0 |
| coaches_count | INT NOT NULL DEFAULT 0 |
| is_archived | BOOLEAN NOT NULL DEFAULT false |
| created_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |

### organization_staff

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| organization_id | BIGINT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE |
| name | VARCHAR(255) NOT NULL |
| role | VARCHAR(100) |
| rank | VARCHAR(100) |

Внешние ключи: `organization_id` -> `organizations`

### teams

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| name | VARCHAR(500) NOT NULL |
| sport | VARCHAR(100) |
| age_category | VARCHAR(30) |
| gender | VARCHAR(20) |
| status | VARCHAR(30) NOT NULL DEFAULT 'active' |
| head_coach_id | BIGINT REFERENCES coaches(id) |
| doctor_name | VARCHAR(255) |
| created_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |

Внешние ключи: `head_coach_id` -> `coaches`

### team_athletes

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| team_id | BIGINT NOT NULL REFERENCES teams(id) ON DELETE CASCADE |
| athlete_id | BIGINT NOT NULL REFERENCES athletes(id) |
| role | VARCHAR(50) |
| since_year | INT |

Внешние ключи: `team_id` -> `teams`, `athlete_id` -> `athletes`

### team_coaches

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| team_id | BIGINT NOT NULL REFERENCES teams(id) ON DELETE CASCADE |
| coach_id | BIGINT NOT NULL REFERENCES coaches(id) |
| role | VARCHAR(50) |

Внешние ключи: `team_id` -> `teams`, `coach_id` -> `coaches`

### facilities

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| name | VARCHAR(500) NOT NULL |
| type | VARCHAR(50) NOT NULL |
| address | TEXT |
| region | VARCHAR(100) |
| city | VARCHAR(200) |
| lat | DOUBLE PRECISION |
| lng | DOUBLE PRECISION |
| capacity | INT |
| area_sqm | INT |
| owner_organization_id | BIGINT REFERENCES organizations(id) |
| status | VARCHAR(30) NOT NULL DEFAULT 'active' |
| equipment | JSONB |
| schedule | JSONB |
| created_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |

Внешние ключи: `owner_organization_id` -> `organizations`

## Соревнования и протоколы

### events

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| title | VARCHAR(500) NOT NULL |
| type | VARCHAR(50) NOT NULL |
| sport | VARCHAR(100) |
| start_date | DATE NOT NULL |
| end_date | DATE NOT NULL |
| city | VARCHAR(200) |
| venue | VARCHAR(500) |
| age_category | VARCHAR(30) |
| level | VARCHAR(50) |
| organizer | VARCHAR(500) |
| main_judge_id | BIGINT REFERENCES judges(id) |
| in_plan | BOOLEAN NOT NULL DEFAULT false |
| funded | BOOLEAN NOT NULL DEFAULT false |
| cancelled | BOOLEAN NOT NULL DEFAULT false |
| status | VARCHAR(30) NOT NULL DEFAULT 'planned' |
| created_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |

Внешние ключи: `main_judge_id` -> `judges`

### event_participants

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| event_id | BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE |
| athlete_id | BIGINT NOT NULL REFERENCES athletes(id) |
| weight_class | VARCHAR(50) |

Внешние ключи: `event_id` -> `events`, `athlete_id` -> `athletes`

### event_results

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| event_id | BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE |
| athlete_id | BIGINT NOT NULL REFERENCES athletes(id) |
| place | INT |
| medal_type | VARCHAR(20) |
| result_value | VARCHAR(255) |

Внешние ключи: `event_id` -> `events`, `athlete_id` -> `athletes`

### protocol_submissions

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| app_no | VARCHAR(50) NOT NULL UNIQUE |
| federation_name | VARCHAR(255) NOT NULL |
| sport | VARCHAR(100) |
| event_name | VARCHAR(255) NOT NULL |
| event_date | DATE |
| level | VARCHAR(100) |
| city | VARCHAR(100) |
| phone | VARCHAR(50) |
| email | VARCHAR(255) |
| status | VARCHAR(50) NOT NULL DEFAULT 'Подан' |
| submit_date | DATE |
| deadline | DATE |
| reject_reason | TEXT |
| created_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |

### protocol_results

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| protocol_submission_id | BIGINT NOT NULL REFERENCES protocol_submissions(id) ON DELETE CASCADE |
| athlete_name | VARCHAR(255) |
| discipline | VARCHAR(120) |
| place | INT |
| medal_type | VARCHAR(40) |

Внешние ключи: `protocol_submission_id` -> `protocol_submissions`

### protocol_submission_history

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| protocol_submission_id | BIGINT NOT NULL REFERENCES protocol_submissions(id) ON DELETE CASCADE |
| action | VARCHAR(500) |
| user_name | VARCHAR(255) |
| created_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |

Внешние ключи: `protocol_submission_id` -> `protocol_submissions`

## Аккредитация и переходы

### accreditation_applications

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| app_no | VARCHAR(50) NOT NULL UNIQUE |
| federation_name | VARCHAR(255) NOT NULL |
| sport | VARCHAR(100) |
| inn | VARCHAR(20) |
| head_name | VARCHAR(255) |
| phone | VARCHAR(50) |
| email | VARCHAR(255) |
| organization_id | BIGINT |
| status | VARCHAR(50) NOT NULL DEFAULT 'Подана' |
| docs_uploaded | INT NOT NULL DEFAULT 0 |
| docs_total | INT NOT NULL DEFAULT 0 |
| deadline | DATE |
| submit_date | DATE |
| accreditation_number | VARCHAR(80) |
| accreditation_end | DATE |
| suspension_reason | TEXT |
| reject_reason | TEXT |
| created_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |

### accreditation_application_history

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| accreditation_application_id | BIGINT NOT NULL REFERENCES accreditation_applications(id) ON DELETE CASCADE |
| action | VARCHAR(500) |
| user_name | VARCHAR(255) |
| created_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |

Внешние ключи: `accreditation_application_id` -> `accreditation_applications`

### transfer_applications

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| app_no | VARCHAR(50) NOT NULL UNIQUE |
| athlete_id | BIGINT |
| athlete_name | VARCHAR(255) NOT NULL |
| sport | VARCHAR(100) |
| old_club | VARCHAR(255) |
| new_club | VARCHAR(255) |
| region | VARCHAR(100) |
| reason | VARCHAR(500) |
| phone | VARCHAR(50) |
| email | VARCHAR(255) |
| status | VARCHAR(50) NOT NULL DEFAULT 'Подана' |
| docs_uploaded | INT NOT NULL DEFAULT 0 |
| docs_total | INT NOT NULL DEFAULT 0 |
| deadline | DATE |
| submit_date | DATE |
| reject_reason | TEXT |
| created_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |
| updated_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |

### transfer_application_history

| Колонка | Тип и ограничения |
|---|---|
| id | BIGSERIAL PRIMARY KEY |
| transfer_application_id | BIGINT NOT NULL REFERENCES transfer_applications(id) ON DELETE CASCADE |
| action | VARCHAR(500) |
| user_name | VARCHAR(255) |
| created_at | TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP |

Внешние ключи: `transfer_application_id` -> `transfer_applications`
