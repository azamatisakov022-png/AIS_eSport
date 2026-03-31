-- =============================================================================
-- V1__init_schema.sql
-- AIS eSport - Initial database schema
-- =============================================================================

-- =====================
-- Users & Authentication
-- =====================

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(30) NOT NULL DEFAULT 'EMPLOYEE',
    department VARCHAR(200),
    linked_entity_type VARCHAR(30),
    linked_entity_id BIGINT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    is_blocked BOOLEAN NOT NULL DEFAULT false,
    last_login TIMESTAMP,
    last_login_ip VARCHAR(45),
    failed_attempts INT NOT NULL DEFAULT 0,
    blocked_until TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE refresh_tokens (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token VARCHAR(512) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    revoked BOOLEAN NOT NULL DEFAULT false
);

-- =====================
-- Organizations
-- =====================

CREATE TABLE organizations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    type VARCHAR(50) NOT NULL,
    sport VARCHAR(100),
    inn VARCHAR(14),
    reg_date DATE,
    region VARCHAR(100),
    address TEXT,
    phone VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    head_name VARCHAR(255),
    head_title VARCHAR(255),
    accreditation VARCHAR(50) NOT NULL DEFAULT 'На рассмотрении',
    athletes_count INT NOT NULL DEFAULT 0,
    coaches_count INT NOT NULL DEFAULT 0,
    is_archived BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE organization_staff (
    id BIGSERIAL PRIMARY KEY,
    organization_id BIGINT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(100),
    rank VARCHAR(100)
);

-- =====================
-- Coaches
-- =====================

CREATE TABLE coaches (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    sex VARCHAR(5) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    cert_number VARCHAR(50) UNIQUE,
    reg_date DATE NOT NULL,
    sport VARCHAR(100),
    rank VARCHAR(100),
    organization_id BIGINT REFERENCES organizations(id),
    employment VARCHAR(30) NOT NULL DEFAULT 'Штатный',
    region VARCHAR(100),
    annulled BOOLEAN NOT NULL DEFAULT false,
    end_date DATE,
    is_archived BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- Judges
-- =====================

CREATE TABLE judges (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    sex VARCHAR(5) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    cert_number VARCHAR(50) UNIQUE,
    category VARCHAR(50) NOT NULL,
    attest_date DATE,
    end_date DATE,
    region VARCHAR(100),
    organization_id BIGINT REFERENCES organizations(id),
    annulled BOOLEAN NOT NULL DEFAULT false,
    is_archived BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE judge_sports (
    judge_id BIGINT NOT NULL REFERENCES judges(id) ON DELETE CASCADE,
    sport VARCHAR(100) NOT NULL
);

-- =====================
-- Teams
-- =====================

CREATE TABLE teams (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    sport VARCHAR(100),
    age_category VARCHAR(30),
    gender VARCHAR(20),
    status VARCHAR(30) NOT NULL DEFAULT 'active',
    head_coach_id BIGINT REFERENCES coaches(id),
    doctor_name VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- Athletes
-- =====================

CREATE TABLE athletes (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    birth_date DATE NOT NULL,
    sex VARCHAR(5) NOT NULL,
    phone VARCHAR(50),
    email VARCHAR(255),
    region VARCHAR(100),
    sport VARCHAR(100),
    rank VARCHAR(30),
    coach_name VARCHAR(255),
    coach_id BIGINT REFERENCES coaches(id),
    organization_id BIGINT REFERENCES organizations(id),
    team_id BIGINT REFERENCES teams(id),
    med_exp_date DATE,
    med_issued_date DATE,
    med_issued_by VARCHAR(255),
    ins_exp_date DATE,
    is_archived BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE athlete_medals (
    id BIGSERIAL PRIMARY KEY,
    athlete_id BIGINT NOT NULL REFERENCES athletes(id) ON DELETE CASCADE,
    medal_type VARCHAR(20) NOT NULL,
    event_name VARCHAR(500) NOT NULL,
    year INT NOT NULL,
    country VARCHAR(100)
);

-- =====================
-- Events
-- =====================

CREATE TABLE events (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL,
    type VARCHAR(50) NOT NULL,
    sport VARCHAR(100),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    city VARCHAR(200),
    venue VARCHAR(500),
    age_category VARCHAR(30),
    level VARCHAR(50),
    organizer VARCHAR(500),
    main_judge_id BIGINT REFERENCES judges(id),
    in_plan BOOLEAN NOT NULL DEFAULT false,
    funded BOOLEAN NOT NULL DEFAULT false,
    cancelled BOOLEAN NOT NULL DEFAULT false,
    status VARCHAR(30) NOT NULL DEFAULT 'planned',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE event_participants (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    athlete_id BIGINT NOT NULL REFERENCES athletes(id),
    weight_class VARCHAR(50),
    UNIQUE(event_id, athlete_id)
);

CREATE TABLE event_results (
    id BIGSERIAL PRIMARY KEY,
    event_id BIGINT NOT NULL REFERENCES events(id) ON DELETE CASCADE,
    athlete_id BIGINT NOT NULL REFERENCES athletes(id),
    place INT,
    medal_type VARCHAR(20),
    result_value VARCHAR(255),
    UNIQUE(event_id, athlete_id)
);

-- =====================
-- Facilities
-- =====================

CREATE TABLE facilities (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(500) NOT NULL,
    type VARCHAR(50) NOT NULL,
    address TEXT,
    region VARCHAR(100),
    city VARCHAR(200),
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    capacity INT,
    area_sqm INT,
    owner_organization_id BIGINT REFERENCES organizations(id),
    status VARCHAR(30) NOT NULL DEFAULT 'active',
    equipment JSONB,
    schedule JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- Team Members
-- =====================

CREATE TABLE team_athletes (
    id BIGSERIAL PRIMARY KEY,
    team_id BIGINT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    athlete_id BIGINT NOT NULL REFERENCES athletes(id),
    role VARCHAR(50),
    since_year INT,
    UNIQUE(team_id, athlete_id)
);

CREATE TABLE team_coaches (
    id BIGSERIAL PRIMARY KEY,
    team_id BIGINT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
    coach_id BIGINT NOT NULL REFERENCES coaches(id),
    role VARCHAR(50),
    UNIQUE(team_id, coach_id)
);

-- =====================
-- Award Applications
-- =====================

CREATE TABLE award_applications (
    id BIGSERIAL PRIMARY KEY,
    app_no VARCHAR(50) NOT NULL UNIQUE,
    athlete_id BIGINT REFERENCES athletes(id),
    applicant_name VARCHAR(255) NOT NULL,
    award VARCHAR(50) NOT NULL,
    sport VARCHAR(100),
    submit_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Подана',
    docs_uploaded INT NOT NULL DEFAULT 0,
    docs_total INT NOT NULL DEFAULT 0,
    award_group VARCHAR(5),
    deadline DATE,
    conclusion TEXT,
    reject_reason TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE award_commission_members (
    id BIGSERIAL PRIMARY KEY,
    award_application_id BIGINT NOT NULL REFERENCES award_applications(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255) NOT NULL
);

CREATE TABLE award_application_history (
    id BIGSERIAL PRIMARY KEY,
    award_application_id BIGINT NOT NULL REFERENCES award_applications(id) ON DELETE CASCADE,
    action VARCHAR(500) NOT NULL,
    user_name VARCHAR(255),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE award_deprivations (
    id BIGSERIAL PRIMARY KEY,
    athlete_id BIGINT REFERENCES athletes(id),
    name VARCHAR(255) NOT NULL,
    award VARCHAR(50) NOT NULL,
    sport VARCHAR(100),
    reason VARCHAR(255) NOT NULL,
    initiated_date DATE NOT NULL,
    appeal_deadline DATE,
    status VARCHAR(50) NOT NULL DEFAULT 'На рассмотрении',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE award_restorations (
    id BIGSERIAL PRIMARY KEY,
    athlete_id BIGINT REFERENCES athletes(id),
    name VARCHAR(255) NOT NULL,
    award VARCHAR(50) NOT NULL,
    sport VARCHAR(100),
    submit_date DATE NOT NULL,
    deadline DATE,
    votes VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'На рассмотрении',
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- Trainer Applications
-- =====================

CREATE TABLE trainer_applications (
    id BIGSERIAL PRIMARY KEY,
    app_no VARCHAR(50) NOT NULL UNIQUE,
    applicant_name VARCHAR(255) NOT NULL,
    birth_date DATE,
    phone VARCHAR(50),
    email VARCHAR(255),
    sport VARCHAR(100),
    submit_date DATE NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'submitted',
    docs_uploaded INT NOT NULL DEFAULT 0,
    docs_total INT NOT NULL DEFAULT 5,
    cert_number VARCHAR(50),
    tunduk_verified BOOLEAN NOT NULL DEFAULT false,
    deadline DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- Documents (MinIO references)
-- =====================

CREATE TABLE documents (
    id BIGSERIAL PRIMARY KEY,
    entity_type VARCHAR(50) NOT NULL,
    entity_id BIGINT NOT NULL,
    doc_type VARCHAR(100),
    file_name VARCHAR(500) NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    minio_key VARCHAR(1000) NOT NULL,
    uploaded_by BIGINT REFERENCES users(id),
    verified BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- Notifications
-- =====================

CREATE TABLE notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(500) NOT NULL,
    message TEXT,
    type VARCHAR(50),
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- Audit Log
-- =====================

CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT REFERENCES users(id),
    user_name VARCHAR(255),
    action VARCHAR(50) NOT NULL,
    entity_type VARCHAR(100),
    entity_id BIGINT,
    details JSONB,
    ip_address VARCHAR(45),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =====================
-- System Config
-- =====================

CREATE TABLE system_config (
    key VARCHAR(100) PRIMARY KEY,
    value TEXT NOT NULL,
    description VARCHAR(500),
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- INDEXES
-- =============================================================================

-- Users
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);

-- Athletes
CREATE INDEX idx_athletes_sport ON athletes(sport);
CREATE INDEX idx_athletes_region ON athletes(region);
CREATE INDEX idx_athletes_rank ON athletes(rank);
CREATE INDEX idx_athletes_organization_id ON athletes(organization_id);
CREATE INDEX idx_athletes_coach_id ON athletes(coach_id);
CREATE INDEX idx_athletes_med_exp_date ON athletes(med_exp_date);
CREATE INDEX idx_athletes_full_name ON athletes(full_name);
CREATE INDEX idx_athletes_is_archived ON athletes(is_archived);

-- Coaches
CREATE INDEX idx_coaches_sport ON coaches(sport);
CREATE INDEX idx_coaches_region ON coaches(region);
CREATE INDEX idx_coaches_organization_id ON coaches(organization_id);
CREATE INDEX idx_coaches_end_date ON coaches(end_date);
CREATE INDEX idx_coaches_cert_number ON coaches(cert_number);

-- Judges
CREATE INDEX idx_judges_region ON judges(region);
CREATE INDEX idx_judges_category ON judges(category);
CREATE INDEX idx_judges_end_date ON judges(end_date);

-- Events
CREATE INDEX idx_events_sport ON events(sport);
CREATE INDEX idx_events_dates ON events(start_date, end_date);
CREATE INDEX idx_events_status ON events(status);
CREATE INDEX idx_events_type ON events(type);

-- Organizations
CREATE INDEX idx_organizations_type ON organizations(type);
CREATE INDEX idx_organizations_region ON organizations(region);
CREATE INDEX idx_organizations_accreditation ON organizations(accreditation);

-- Facilities
CREATE INDEX idx_facilities_type ON facilities(type);
CREATE INDEX idx_facilities_region ON facilities(region);
CREATE INDEX idx_facilities_status ON facilities(status);
CREATE INDEX idx_facilities_coords ON facilities(lat, lng);

-- Award Applications
CREATE INDEX idx_award_applications_status ON award_applications(status);
CREATE INDEX idx_award_applications_submit_date ON award_applications(submit_date);

-- Trainer Applications
CREATE INDEX idx_trainer_applications_status ON trainer_applications(status);

-- Documents
CREATE INDEX idx_documents_entity ON documents(entity_type, entity_id);

-- Audit Logs
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Notifications
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
