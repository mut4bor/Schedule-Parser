# University Schedule Project

Проект для управления расписанием университета. Клиентская часть написана на **React** с использованием **Vite** и **TypeScript**, серверная часть — на **Node.js** с **Express** и **TypeScript**. Данные хранятся в базе данных **MongoDB**.

## Структура проекта

```
root/
├── client/         # Клиентская часть (React + Vite)
├── server/         # Серверная часть (Node.js + Express)
├── README.md       # Документация
├── .gitignore
```

---

## Установка и настройка

### 1. Клонирование репозитория

Склонируйте репозиторий на локальную машину:

```bash
git clone https://github.com/mut4bor/Schedule-Parser.git
cd Schedule-Parser
```

### 2. Установка зависимостей

Установите зависимости для клиента и сервера:

```bash
# Установка зависимостей клиента
cd client
npm install

# Установка зависимостей сервера
cd ../server
npm install
```

### 3. Настройка переменных окружения

Создайте файлы `.env` в папках `client` и `server`, используя предоставленные примеры `.env.sample`.

#### Пример `.env` для клиента:

```env
VITE_API_URL="https://example.com"
VITE_X_ADMIN_PASSWORD=**********
```

#### Пример `.env` для сервера:

```env
UNIVERSITY_URL=https://example.com
FETCH_URL=https://example.com
PRODUCTION_DOMAIN=https://example.com
SERVER_HOST_NAME=Example
PORT=8080
X_ADMIN_PASSWORD=**********
MONGODB_URL=mongodb://username
REFRESH_PASSWORD=**********
```

> **Важно:** Убедитесь, что вы заменили значения переменных на свои собственные.

### 4. Настройка базы данных MongoDB

Убедитесь, что у вас установлен и запущен **MongoDB**. Укажите URL подключения в переменной `MONGODB_URL` в файле `.env` сервера.

---

## Запуск проекта

### 1. Запуск клиента

Перейдите в папку `client` и выполните команду:

```bash
npm run dev
```

Клиент будет доступен по адресу [http://localhost:5173](http://localhost:5173) (порт может отличаться).

### 2. Запуск сервера

Перейдите в папку `server` и выполните команду:

```bash
npm run dev
```

Сервер будет доступен по адресу [http://localhost:8080](http://localhost:8080) (порт указан в переменной `PORT`).

---

## NPM-скрипты

### Клиент

- **`npm run dev`** — Запускает клиент в режиме разработки.
- **`npm run build`** — Собирает клиент для продакшена.
- **`npm run preview`** — Предпросмотр собранного клиента.

### Сервер

- **`npm run dev`** — Запускает сервер в режиме разработки с использованием `nodemon`.
- **`npm run build`** — Компилирует TypeScript-код в папку `dist` и обновляет алиасы с помощью `tsc-alias`.
- **`npm run start`** — Запускает сервер из собранной папки `dist`.
- **`npm run lint`** — Проверяет код на соответствие правилам ESLint.
- **`npm run format`** — Исправляет ошибки форматирования кода с помощью ESLint.
- **`npm run create`** — Удаляет текущую базу данных и создает расписание с нуля, используя скрипт `dist/npm-scripts/create.js`.
- **`npm run update`** — Обновляет существующее расписание, используя скрипт `dist/npm-scripts/update.js`.

---

## Описание функциональности

### Расписание

Сервер работает с расписанием, которое парсится из Excel-таблиц, скачанных с другого сайта. Для управления расписанием доступны два скрипта:

1. **`npm run create`** — Полностью очищает базу данных и создает новое расписание.
2. **`npm run update`** — Обновляет существующее расписание в базе данных.

---

## Дополнительные инструкции

### Сборка и запуск в продакшене

1. Соберите клиент и сервер:

```bash
# Сборка клиента
cd client
npm run build

# Сборка сервера
cd ../server
npm run build
```

2. Запустите сервер из собранной папки:

```bash
cd server
npm run start
```

3. Раздавайте собранные файлы клиента через сервер или используйте любой статический хостинг.
