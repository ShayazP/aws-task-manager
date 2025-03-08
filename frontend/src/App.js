import React, { useState, useEffect } from 'react';
import {
  Container,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Checkbox,
  Paper,
  Typography,
  Box,
  Fade,
  CircularProgress,
  ThemeProvider,
  createTheme,
  AppBar,
  Toolbar,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddTaskIcon from '@mui/icons-material/AddTask';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import axios from 'axios';

// Create a custom theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#ff4081',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/todos');
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
    setLoading(false);
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    
    try {
      await axios.post('http://localhost:5000/api/todos', {
        title: newTodo
      });
      setNewTodo('');
      fetchTodos();
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

  const toggleTodo = async (todo) => {
    try {
      await axios.put(`http://localhost:5000/api/todos/${todo.id}`, {
        ...todo,
        completed: !todo.completed
      });
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/todos/${id}`);
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ flexGrow: 1, minHeight: '100vh', bgcolor: 'background.default' }}>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <FormatListBulletedIcon sx={{ mr: 2 }} />
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              My Todo List
            </Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <form onSubmit={addTodo}>
              <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
                <TextField
                  fullWidth
                  value={newTodo}
                  onChange={(e) => setNewTodo(e.target.value)}
                  placeholder="What needs to be done?"
                  variant="outlined"
                  size="small"
                  sx={{ bgcolor: 'background.paper' }}
                />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  startIcon={<AddTaskIcon />}
                  sx={{ px: 3 }}
                >
                  Add
                </Button>
              </Box>
            </form>

            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                <CircularProgress />
              </Box>
            ) : (
              <List sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
                {todos.map((todo, index) => (
                  <Fade in={true} key={todo.id}>
                    <ListItem
                      sx={{
                        borderBottom: index < todos.length - 1 ? '1px solid #eee' : 'none',
                        '&:hover': {
                          bgcolor: 'rgba(0, 0, 0, 0.04)',
                        },
                      }}
                    >
                      <Checkbox
                        edge="start"
                        checked={todo.completed}
                        onChange={() => toggleTodo(todo)}
                        sx={{
                          color: 'primary.main',
                          '&.Mui-checked': {
                            color: 'primary.main',
                          },
                        }}
                      />
                      <ListItemText
                        primary={todo.title}
                        sx={{
                          textDecoration: todo.completed ? 'line-through' : 'none',
                          color: todo.completed ? 'text.secondary' : 'text.primary',
                        }}
                      />
                      <ListItemSecondaryAction>
                        <IconButton
                          edge="end"
                          onClick={() => deleteTodo(todo.id)}
                          sx={{
                            color: 'error.light',
                            '&:hover': {
                              color: 'error.main',
                            },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </Fade>
                ))}
                {todos.length === 0 && (
                  <Box sx={{ p: 3, textAlign: 'center' }}>
                    <Typography color="text.secondary">
                      No todos yet. Add one above!
                    </Typography>
                  </Box>
                )}
              </List>
            )}
          </Paper>
          
          {todos.length > 0 && (
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                {todos.filter(t => t.completed).length} of {todos.length} tasks completed
              </Typography>
            </Box>
          )}
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;