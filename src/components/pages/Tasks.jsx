import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import TaskCard from '@/components/molecules/TaskCard';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ApperIcon from '@/components/ApperIcon';
import { taskService } from '@/services/api/taskService';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: format(new Date(), 'yyyy-MM-dd'),
    priority: 'Medium'
  });

  const loadTasks = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await taskService.getAll();
      setTasks(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast.error("Please enter a task title");
      return;
    }

    try {
      if (editingTask) {
        const updatedTask = await taskService.update(editingTask.Id, formData);
        setTasks(tasks.map(task => task.Id === editingTask.Id ? updatedTask : task));
        toast.success("Task updated successfully! ✅");
      } else {
        const newTask = await taskService.create(formData);
        setTasks([newTask, ...tasks]);
        toast.success("Task created successfully! 🎉");
      }
      
      resetForm();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleToggleComplete = async (taskId) => {
    try {
      const task = tasks.find(t => t.Id === taskId);
      const updatedTask = await taskService.update(taskId, { completed: !task.completed });
      setTasks(tasks.map(t => t.Id === taskId ? updatedTask : t));
      toast.success(updatedTask.completed ? "Great job! Task completed! 🎉" : "Task marked as incomplete");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      try {
        await taskService.delete(taskId);
        setTasks(tasks.filter(t => t.Id !== taskId));
        toast.success("Task deleted successfully");
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
setFormData({
      title: task.title,
      description: task.description,
      dueDate: task.due_date,
      priority: task.priority
    });
    setShowAddForm(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      dueDate: format(new Date(), 'yyyy-MM-dd'),
      priority: 'Medium'
    });
    setEditingTask(null);
    setShowAddForm(false);
  };

  const filteredTasks = tasks.filter(task => {
    switch (filter) {
      case 'completed':
        return task.completed;
      case 'pending':
        return !task.completed;
      case 'overdue':
        return !task.completed && new Date(task.dueDate) < new Date();
      default:
        return true;
    }
  });

  const completedCount = tasks.filter(t => t.completed).length;
  const pendingCount = tasks.filter(t => !t.completed).length;
  const overdueCount = tasks.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length;

  if (loading) return <Loading type="skeleton" />;
  if (error) return <Error message={error} onRetry={loadTasks} />;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-display">Tasks</h1>
            <p className="text-gray-600 text-sm">Organize your day beautifully</p>
          </div>
          <Button
            icon="Plus"
            onClick={() => setShowAddForm(true)}
            size="sm"
          >
            Add Task
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          className="grid grid-cols-3 gap-3 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card padding="sm" className="text-center">
            <div className="text-2xl font-bold text-accent">{completedCount}</div>
            <div className="text-xs text-gray-600">Completed</div>
          </Card>
          <Card padding="sm" className="text-center">
            <div className="text-2xl font-bold text-primary">{pendingCount}</div>
            <div className="text-xs text-gray-600">Pending</div>
          </Card>
          <Card padding="sm" className="text-center">
            <div className="text-2xl font-bold text-error">{overdueCount}</div>
            <div className="text-xs text-gray-600">Overdue</div>
          </Card>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          className="flex space-x-2 mb-6 overflow-x-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {[
            { key: 'all', label: 'All', count: tasks.length },
            { key: 'pending', label: 'Pending', count: pendingCount },
            { key: 'completed', label: 'Completed', count: completedCount },
            { key: 'overdue', label: 'Overdue', count: overdueCount }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                filter === tab.key
                  ? 'bg-primary text-white'
                  : 'bg-surface text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </motion.div>

        {/* Add/Edit Task Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6"
            >
              <Card>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900">
                    {editingTask ? 'Edit Task' : 'Add New Task'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <ApperIcon name="X" size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Input
                    label="Task Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="What needs to be done?"
                  />
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Add details..."
                      className="block w-full rounded-xl border border-gray-200 bg-surface px-4 py-3 text-gray-900 placeholder-gray-500 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors resize-none"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Due Date"
                      type="date"
                      value={formData.dueDate}
                      onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    />
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="block w-full rounded-xl border border-gray-200 bg-surface px-4 py-3 text-gray-900 focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none transition-colors"
                      >
                        <option value="Low">Low</option>
                        <option value="Medium">Medium</option>
                        <option value="High">High</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="flex space-x-3">
                    <Button type="submit" className="flex-1">
                      {editingTask ? 'Update Task' : 'Add Task'}
                    </Button>
                    <Button type="button" variant="secondary" onClick={resetForm}>
                      Cancel
                    </Button>
                  </div>
                </form>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tasks List */}
        <motion.div
          className="space-y-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {filteredTasks.length === 0 ? (
            <Empty
              icon="CheckSquare"
              title="No tasks found"
              message={filter === 'all' ? "Create your first task to get started!" : `No ${filter} tasks at the moment.`}
              actionLabel={filter === 'all' ? "Add Your First Task" : undefined}
              onAction={filter === 'all' ? () => setShowAddForm(true) : undefined}
            />
          ) : (
            filteredTasks.map((task, index) => (
              <motion.div
                key={task.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <TaskCard
                  task={task}
                  onToggleComplete={handleToggleComplete}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Tasks;