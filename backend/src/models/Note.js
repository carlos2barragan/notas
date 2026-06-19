const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: { type: String, enum: ['image', 'video', 'audio'], required: true },
  name: { type: String, default: '' },
}, { _id: false });

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  content: { type: String, default: '' },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
  media: { type: [mediaSchema], default: [] },
  isPinned: { type: Boolean, default: false },
}, { timestamps: true });

noteSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Note', noteSchema);
