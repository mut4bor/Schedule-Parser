-- database/schema.sql

-- Пользователи для аутентификации
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Типы обучения
CREATE TABLE education_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL -- бакалавриат, магистратура, аспирантура
);

-- Преподаватели
CREATE TABLE teachers (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    surname VARCHAR(255) NOT NULL,
    patronymic VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Группы
CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    course INTEGER NOT NULL CHECK (course > 0),
    education_type_id INTEGER REFERENCES education_types(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, education_type_id)
);

-- Расписания (привязка к группе и дате)
CREATE TABLE schedules (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES groups(id) ON DELETE CASCADE,
    schedule_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(group_id, schedule_date)
);

-- Занятия в расписании
CREATE TABLE lessons (
    id SERIAL PRIMARY KEY,
    schedule_id INTEGER REFERENCES schedules(id) ON DELETE CASCADE,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    subject_name VARCHAR(255) NOT NULL,
    classroom VARCHAR(50) NOT NULL,
    teacher_id INTEGER REFERENCES teachers(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для оптимизации
CREATE INDEX idx_schedules_group_date ON schedules(group_id, schedule_date);
CREATE INDEX idx_lessons_schedule ON lessons(schedule_id);
CREATE INDEX idx_groups_education_type ON groups(education_type_id);

-- Базовые данные
INSERT INTO education_types (name) VALUES 
('Бакалавриат'), 
('Магистратура'), 
('Аспирантура');