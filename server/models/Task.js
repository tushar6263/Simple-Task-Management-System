const mongoose = require('mongoose');


const TaskSchema = new mongoose.Schema({
title: { type: String, required: true },
description: { type: String },
dueDate: { type: Date },
status: { type: String, enum: ['pending', 'in-progress', 'completed'], default: 'pending' },
priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });


module.exports = mongoose.model('Task', TaskSchema);