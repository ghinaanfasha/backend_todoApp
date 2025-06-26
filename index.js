const express = require('express');
const cors = require('cors');
const { v4: generateId } = require('uuid'); // UUID generator

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Data sementara
let todoList = [
    {
        id: generateId(),
        title: "Belajar Cloud Computing",
        description: "Mengerjakan tugas besar komputasi awan",
        completed: false,
        dueDate: "2025-06-25",
        createdAt: "2025-06-16T13:00:00Z"
    }
];

// Respon sukses
const respondSuccess = (res, msg, data = null) => {
    res.status(200).json({
        status: "success",
        message: msg,
        data: data
    });
};

// Respon error
const respondError = (res, code, msg) => {
    res.status(code).json({
        status: "error",
        message: msg
    });
};

// Endpoint root
app.get('/', (req, res) => {
    res.json({
        status: "success",
        message: "Backend API aktif. Gunakan endpoint seperti /api/todos"
    });
});

// GET /api/todos
app.get('/api/todos', (req, res) => {
    respondSuccess(res, "To-do list retrieved successfully", todoList);
});

// POST /api/todos
app.post('/api/todos', (req, res) => {
    const { title, description, dueDate } = req.body;

    if (!title || !description || !dueDate) {
        return respondError(res, 400, "Fields 'title', 'description', and 'dueDate' are required");
    }

    const newTodo = {
        id: generateId(),
        title,
        description,
        completed: false,
        dueDate,
        createdAt: new Date().toISOString()
    };

    todoList.push(newTodo);
    respondSuccess(res, "To-do created successfully", newTodo);
});

// GET /api/todos/:id
app.get('/api/todos/:id', (req, res) => {
    const id = req.params.id;
    const todo = todoList.find(item => item.id === id);

    if (!todo) {
        return respondError(res, 404, "To-do with the given ID not found");
    }

    respondSuccess(res, "To-do retrieved successfully", todo);
});

// PUT /api/todos/:id
app.put('/api/todos/:id', (req, res) => {
    const id = req.params.id;
    const index = todoList.findIndex(item => item.id === id);

    if (index === -1) {
        return respondError(res, 404, "To-do with the given ID not found");
    }

    const { title, description, completed, dueDate } = req.body;

    if (title !== undefined) todoList[index].title = title;
    if (description !== undefined) todoList[index].description = description;
    if (completed !== undefined) todoList[index].completed = completed;
    if (dueDate !== undefined) todoList[index].dueDate = dueDate;

    respondSuccess(res, "To-do updated successfully", todoList[index]);
});

// DELETE /api/todos/:id
app.delete('/api/todos/:id', (req, res) => {
    const id = req.params.id;
    const beforeDelete = todoList.length;
    todoList = todoList.filter(item => item.id !== id);

    if (todoList.length === beforeDelete) {
        return respondError(res, 404, "To-do with the given ID not found");
    }

    respondSuccess(res, "To-do deleted successfully");
});

// Fallback endpoint tidak ditemukan
app.use((req, res) => {
    respondError(res, 404, "Endpoint not found");
});

// Jalankan server
app.listen(PORT, () => {
    console.log(`Server aktif di port ${PORT}`);
    console.log(`Akses API: http://localhost:${PORT}/api/todos`);
});
