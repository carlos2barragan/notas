const Tag = require('../models/Tag');

exports.getTags = async (req, res) => {
  const tags = await Tag.find().sort({ name: 1 });
  res.json(tags);
};

exports.createTag = async (req, res) => {
  const tag = await Tag.create(req.body);
  res.status(201).json(tag);
};

exports.updateTag = async (req, res) => {
  const tag = await Tag.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!tag) return res.status(404).json({ message: 'Etiqueta no encontrada' });
  res.json(tag);
};

exports.deleteTag = async (req, res) => {
  const tag = await Tag.findByIdAndDelete(req.params.id);
  if (!tag) return res.status(404).json({ message: 'Etiqueta no encontrada' });
  res.json({ message: 'Etiqueta eliminada' });
};
