const express = require('express');
const cors = require('cors');
const { v4: generateId } = require('uuid');

const app = express();
const PORT = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

let taskList = [
    {
        id: "1",
        title: "TB Cloud Computing",
        description: "Mengerjakan tugas besar cloud computing",
        completed: false,
        dueDate: "2025-06-30",
        createdAt: "2025-06-16T13:00:00Z"
    }
];

const respondSuccess = (res, msg, data = null) => {
    res.status(200).json({
        status: "success",
        message: msg,
        data: data
    });
};

const respondError = (res, code, msg) => {
    res.status(code).json({
        status: "error",
        message: msg
    });
};

// Endpoint
app.get('/', (req, res) => {
    res.json({
        status: "success",
        message: "API aktif. Silakan akses /api/tasks untuk data tugas."
    });
});

// Data Task
app.get('/api/tasks', (req, res) => {
    respondSuccess(res, "Daftar tugas berhasil diambil", taskList);
});

// Tambah task baru
app.post('/api/tasks', (req, res) => {
    const { title, description, dueDate } = req.body;

    if (!title || !description || !dueDate) {
        return respondError(res, 400, "Semua field wajib diisi: title, description, dueDate");
    }

    const newTask = {
        id: generateId(),
        title,
        description,
        completed: false,
        dueDate,
        createdAt: new Date().toISOString()
    };

    taskList.push(newTask);
    respondSuccess(res, "Tugas baru berhasil ditambahkan", newTask);
});

// Task berdasarkan ID
app.get('/api/tasks/:id', (req, res) => {
    const task = taskList.find(item => item.id === req.params.id);

    if (!task) {
        return respondError(res, 404, "Tugas dengan ID tersebut tidak ditemukan");
    }

    respondSuccess(res, "Tugas ditemukan", task);
});

// Update task
app.put('/api/tasks/:id', (req, res) => {
    const taskIndex = taskList.findIndex(item => item.id === req.params.id);

    if (taskIndex === -1) {
        return respondError(res, 404, "Tugas tidak ditemukan");
    }

    const { title, description, completed, dueDate } = req.body;

    if (title !== undefined) taskList[taskIndex].title = title;
    if (description !== undefined) taskList[taskIndex].description = description;
    if (completed !== undefined) taskList[taskIndex].completed = completed;
    if (dueDate !== undefined) taskList[taskIndex].dueDate = dueDate;

    respondSuccess(res, "Tugas berhasil diperbarui", taskList[taskIndex]);
});

// Hapus task
app.delete('/api/tasks/:id', (req, res) => {
    const lengthBefore = taskList.length;
    taskList = taskList.filter(item => item.id !== req.params.id);

    if (taskList.length === lengthBefore) {
        return respondError(res, 404, "Tugas tidak ditemukan untuk dihapus");
    }

    respondSuccess(res, "Tugas berhasil dihapus");
});

// Jika tidak ditemukan
app.use((req, res) => {
    respondError(res, 404, "Endpoint tidak ditemukan");
});

app.listen(PORT, () => {
    console.log(`Server aktif di port ${PORT}`);
    console.log(`Akses API di http://localhost:${PORT}/api/tasks`);
});
