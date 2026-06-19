const Note = require('../models/Note');

exports.getNotes = async (req, res) => {
  const { search, tag } = req.query;
  const filter = {};

  if (search) filter.$text = { $search: search };
  if (tag) filter.tags = tag;

  const notes = await Note.find(filter).populate('tags').sort({ isPinned: -1, updatedAt: -1 });
  res.json(notes);
};

exports.getNote = async (req, res) => {
  const note = await Note.findById(req.params.id).populate('tags');
  if (!note) return res.status(404).json({ message: 'Nota no encontrada' });
  res.json(note);
};

exports.createNote = async (req, res) => {
  const note = await Note.create(req.body);
  const populated = await note.populate('tags');
  res.status(201).json(populated);
};

exports.updateNote = async (req, res) => {
  const note = await Note.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }).populate('tags');
  if (!note) return res.status(404).json({ message: 'Nota no encontrada' });
  res.json(note);
};

exports.deleteNote = async (req, res) => {
  const note = await Note.findByIdAndDelete(req.params.id);
  if (!note) return res.status(404).json({ message: 'Nota no encontrada' });
  res.json({ message: 'Nota eliminada' });
};
