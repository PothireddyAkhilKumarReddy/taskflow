const pool = require('../database/connection');

class Task {
  static async create(taskData) {
    const { title, description, status, priority, project_id, user_id, due_date } = taskData;
    
    const query = `
      INSERT INTO tasks (title, description, status, priority, project_id, user_id, due_date)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *
    `;
    
    const values = [title, description, status, priority, project_id, user_id, due_date];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async findByUserId(userId, filters = {}) {
    let query = `
      SELECT t.*, p.name as project_name
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE t.user_id = $1
    `;
    
    const values = [userId];
    let paramCount = 1;

    if (filters.status) {
      paramCount++;
      query += ` AND t.status = $${paramCount}`;
      values.push(filters.status);
    }

    if (filters.project_id) {
      paramCount++;
      query += ` AND t.project_id = $${paramCount}`;
      values.push(filters.project_id);
    }

    if (filters.priority) {
      paramCount++;
      query += ` AND t.priority = $${paramCount}`;
      values.push(filters.priority);
    }

    query += ` ORDER BY t.created_at DESC`;
    
    const result = await pool.query(query, values);
    return result.rows;
  }

  static async findById(id, userId) {
    const query = `
      SELECT t.*, p.name as project_name
      FROM tasks t
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE t.id = $1 AND t.user_id = $2
    `;
    const result = await pool.query(query, [id, userId]);
    return result.rows[0];
  }

  static async update(id, userId, taskData) {
    const { title, description, status, priority, project_id, due_date } = taskData;
    const query = `
      UPDATE tasks 
      SET title = $1, description = $2, status = $3, priority = $4, 
          project_id = $5, due_date = $6, updated_at = CURRENT_TIMESTAMP
      WHERE id = $7 AND user_id = $8
      RETURNING *
    `;
    const values = [title, description, status, priority, project_id, due_date, id, userId];
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  static async delete(id, userId) {
    const query = 'DELETE FROM tasks WHERE id = $1 AND user_id = $2 RETURNING id';
    const result = await pool.query(query, [id, userId]);
    return result.rows[0];
  }

  static async getStats(userId) {
    const query = `
      SELECT 
        COUNT(*) as total_tasks,
        COUNT(CASE WHEN status = 'todo' THEN 1 END) as todo_tasks,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_tasks,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_tasks,
        COUNT(CASE WHEN due_date < CURRENT_TIMESTAMP AND status != 'completed' THEN 1 END) as overdue_tasks
      FROM tasks 
      WHERE user_id = $1
    `;
    const result = await pool.query(query, [userId]);
    return result.rows[0];
  }
}

module.exports = Task;
