# Django Project with Local MariaDB

## 📌 Project Overview
- **Location**: `C:\Users\dEN5\.gemini\antigravity-cli\brain\b6272683-cbec-4de8-9c82-90d51c3d5aad\scratch\django_project`
- **Junction / Shortcut**: `C:\Users\dEN5\django_scratch`
- **Django Version**: 6.1.2
- **Python Version**: 3.14.4
- **MariaDB Version**: 11.4.3 LTS (Installed locally & running as Windows Service `MariaDB`)

---

## 🗄️ Database Credentials (MariaDB)
- **Host**: `127.0.0.1`
- **Port**: `3306`
- **Database Name**: `django_db`
- **Database User**: `django_user`
- **Database Password**: `django_pass`
- **Root User**: `root` / `root`

All configurations are managed via `.env` in the project root.

---

## 🚀 Quick Start Commands

### 1. Run Development Server
```powershell
# From project directory:
.\run_server.ps1
# Or directly via venv python:
.\.venv\Scripts\python.exe manage.py runserver
```
Visit http://127.0.0.1:8000 in your browser.
Admin panel: http://127.0.0.1:8000/admin (Default superuser: `admin` / `admin`)

### 2. Run Django Management Commands
```powershell
.\manage.ps1 migrate
.\manage.ps1 makemigrations
.\manage.ps1 createsuperuser
```

### 3. MariaDB Service Management
```powershell
# Located in scratch directory:
# Start service:
powershell -File C:\Users\dEN5\.gemini\antigravity-cli\brain\b6272683-cbec-4de8-9c82-90d51c3d5aad\scratch\start_mariadb.ps1

# Stop service:
powershell -File C:\Users\dEN5\.gemini\antigravity-cli\brain\b6272683-cbec-4de8-9c82-90d51c3d5aad\scratch\stop_mariadb.ps1

# Connect to MariaDB CLI:
powershell -File C:\Users\dEN5\.gemini\antigravity-cli\brain\b6272683-cbec-4de8-9c82-90d51c3d5aad\scratch\mariadb_cli.ps1
```

---

## 📦 Installed Dependencies in `.venv`
- `Django` (6.1.2) - High-level Python web framework
- `mysqlclient` (2.3.0) - Fast C-extension MariaDB/MySQL connector
- `PyMySQL` (1.2.3) - Pure-Python MySQL/MariaDB fallback driver
- `cryptography` (50.0.2) - Encryption and auth plugin support
- `python-dotenv` (1.2.4) - Environment variable management
