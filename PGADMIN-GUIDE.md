# pgAdmin Setup and Usage Guide for TaskFlow

## 🎯 What is pgAdmin?

pgAdmin is a web-based administration tool for PostgreSQL databases. It provides a user-friendly interface to manage your database, run queries, view data, and perform administrative tasks.

## 🚀 Quick Setup

### 1. Start the Application with pgAdmin

```bash
# Start all services including pgAdmin
docker-compose up -d

# Wait for services to start (about 30 seconds)
# Then access pgAdmin at: http://localhost:8080
```

### 2. Login to pgAdmin

- **URL**: http://localhost:8080
- **Email**: admin@taskflow.com
- **Password**: admin123

## 📊 Database Connection Setup

### Automatic Setup (Recommended)
The database connection is pre-configured in `pgadmin/servers.json`. If it doesn't appear automatically:

### Manual Setup
1. Right-click "Servers" in the left panel
2. Select "Register" → "Server..."
3. Fill in the connection details:

| Field | Value |
|-------|-------|
| **Name** | TaskFlow Database |
| **Host name/address** | postgres |
| **Port** | 5432 |
| **Maintenance database** | taskflow |
| **Username** | postgres |
| **Password** | password |

4. Click "Save"

## 🔍 Exploring Your Database

### 1. Navigate the Database Structure

```
TaskFlow Database
├── Databases
│   └── taskflow
│       ├── Schemas
│       │   └── public
│       │       ├── Tables
│       │       │   ├── users
│       │       │   ├── projects
│       │       │   ├── tasks
│       │       │   └── comments
│       │       ├── Functions
│       │       └── Triggers
│       └── Extensions
```

### 2. View Table Data

1. Expand: **TaskFlow Database** → **taskflow** → **Schemas** → **public** → **Tables**
2. Right-click any table (e.g., `users`)
3. Select "View/Edit Data" → "All Rows"

### 3. Run SQL Queries

1. Click the **SQL** button in the toolbar
2. Write your query in the editor
3. Click **Execute** (F5) to run

## 📝 Common Tasks in pgAdmin

### 1. View All Users
```sql
SELECT * FROM users;
```

### 2. View All Projects
```sql
SELECT * FROM projects;
```

### 3. View All Tasks
```sql
SELECT * FROM tasks;
```

### 4. View Tasks with Project Names
```sql
SELECT 
    t.id,
    t.title,
    t.description,
    t.status,
    t.priority,
    p.name as project_name,
    u.name as assigned_user
FROM tasks t
LEFT JOIN projects p ON t.project_id = p.id
LEFT JOIN users u ON t.assigned_to = u.id;
```

### 5. View Project Statistics
```sql
SELECT 
    p.name as project_name,
    COUNT(t.id) as total_tasks,
    COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks,
    COUNT(CASE WHEN t.status = 'in_progress' THEN 1 END) as in_progress_tasks,
    COUNT(CASE WHEN t.status = 'pending' THEN 1 END) as pending_tasks
FROM projects p
LEFT JOIN tasks t ON p.id = t.project_id
GROUP BY p.id, p.name;
```

### 6. View User Task Assignments
```sql
SELECT 
    u.name as user_name,
    u.email,
    COUNT(t.id) as assigned_tasks,
    COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks
FROM users u
LEFT JOIN tasks t ON u.id = t.assigned_to
GROUP BY u.id, u.name, u.email;
```

## 🛠️ Database Administration Tasks

### 1. Create a New User (if needed)
```sql
INSERT INTO users (name, email, password_hash, role, created_at, updated_at)
VALUES ('John Doe', 'john@example.com', '$2b$10$...', 'user', NOW(), NOW());
```

### 2. Create a New Project
```sql
INSERT INTO projects (name, description, created_by, created_at, updated_at)
VALUES ('New Project', 'Project description', 1, NOW(), NOW());
```

### 3. Create a New Task
```sql
INSERT INTO tasks (title, description, project_id, assigned_to, status, priority, created_at, updated_at)
VALUES ('New Task', 'Task description', 1, 1, 'pending', 'medium', NOW(), NOW());
```

### 4. Update Task Status
```sql
UPDATE tasks 
SET status = 'completed', updated_at = NOW() 
WHERE id = 1;
```

### 5. Delete a Task
```sql
DELETE FROM tasks WHERE id = 1;
```

## 📊 Monitoring and Analytics

### 1. Task Completion Rate
```sql
SELECT 
    DATE(created_at) as date,
    COUNT(*) as total_tasks,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
    ROUND(
        COUNT(CASE WHEN status = 'completed' THEN 1 END) * 100.0 / COUNT(*), 2
    ) as completion_rate
FROM tasks
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

### 2. User Productivity
```sql
SELECT 
    u.name,
    COUNT(t.id) as total_tasks,
    COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks,
    AVG(CASE 
        WHEN t.status = 'completed' 
        THEN EXTRACT(EPOCH FROM (t.updated_at - t.created_at))/3600 
    END) as avg_completion_hours
FROM users u
LEFT JOIN tasks t ON u.id = t.assigned_to
GROUP BY u.id, u.name
ORDER BY completed_tasks DESC;
```

### 3. Project Progress
```sql
SELECT 
    p.name as project_name,
    COUNT(t.id) as total_tasks,
    COUNT(CASE WHEN t.status = 'completed' THEN 1 END) as completed_tasks,
    COUNT(CASE WHEN t.status = 'in_progress' THEN 1 END) as in_progress_tasks,
    COUNT(CASE WHEN t.status = 'pending' THEN 1 END) as pending_tasks,
    ROUND(
        COUNT(CASE WHEN t.status = 'completed' THEN 1 END) * 100.0 / COUNT(*), 2
    ) as completion_percentage
FROM projects p
LEFT JOIN tasks t ON p.id = t.project_id
GROUP BY p.id, p.name
ORDER BY completion_percentage DESC;
```

## 🔧 Troubleshooting

### Common Issues:

#### 1. Cannot Connect to Database
- **Check**: Is PostgreSQL running? `docker-compose ps`
- **Solution**: `docker-compose restart postgres`

#### 2. pgAdmin Not Loading
- **Check**: Is pgAdmin running? `docker-compose ps`
- **Solution**: `docker-compose restart pgadmin`

#### 3. Database Connection Refused
- **Check**: Database credentials in pgAdmin
- **Solution**: Verify host is `postgres` (not `localhost`)

#### 4. Tables Not Visible
- **Check**: Are you connected to the correct database?
- **Solution**: Expand `TaskFlow Database` → `taskflow` → `Schemas` → `public` → `Tables`

## 🔐 Security Best Practices

### For Development:
- Default credentials are fine for local development
- pgAdmin is only accessible from localhost

### For Production:
1. **Change Default Passwords**:
   ```bash
   # Update .env.prod file
   PGADMIN_EMAIL=admin@yourcompany.com
   PGADMIN_PASSWORD=your-secure-password
   ```

2. **Enable Server Mode**:
   ```yaml
   # In docker-compose.prod.yml
   PGADMIN_CONFIG_SERVER_MODE: 'True'
   ```

3. **Restrict Access**:
   - Use firewall rules
   - Enable HTTPS
   - Use strong passwords

## 📚 Useful pgAdmin Features

### 1. Query Tool
- Write and execute SQL queries
- Save frequently used queries
- Export query results

### 2. Dashboard
- View database statistics
- Monitor active connections
- Check database size

### 3. Backup/Restore
- Right-click database → "Backup..."
- Choose format (SQL, Custom, Tar)
- Set compression options

### 4. User Management
- Create new database users
- Set permissions and roles
- Manage user privileges

## 🎯 Next Steps

1. **Explore the Database**: Browse tables and data
2. **Run Sample Queries**: Try the SQL examples above
3. **Create Reports**: Use the analytics queries for insights
4. **Set Up Monitoring**: Create dashboards for project tracking
5. **Backup Strategy**: Set up regular database backups

## 📞 Support

If you encounter issues:
1. Check Docker containers: `docker-compose ps`
2. View logs: `docker-compose logs pgadmin`
3. Restart services: `docker-compose restart`
4. Check the main documentation: `README-JENKINS-DOCKER-PGADMIN.md`
