const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');

router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'Archivo no válido o no recibido' });

  const url = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  const type = req.file.mimetype.startsWith('video') ? 'video' : 'image';

  res.status(201).json({ url, type, name: req.file.originalname });
});

module.exports = router;
