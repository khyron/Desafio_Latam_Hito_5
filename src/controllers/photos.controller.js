const Photo = require('../models/photo.model');
const { Op } = require('sequelize');

exports.getAllPhotos = async (req, res) => {
  try {
    const photos = await Photo.findAll();
    res.status(200).json({ status: "success", payload: photos });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.getPhoto = async (req, res) => {
  try {
    const photo = await Photo.findByPk(req.params.id);
    if (!photo) {
      return res.status(404).json({ status: "error", message: "Photo not found" });
    }
    res.status(200).json({ status: "success", payload: photo });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};

exports.createPhoto = async (req, res) => {
    try {
        // Add validation
        if (!req.body.title || !req.body.photographer) {
            return res.status(400).json({ 
                status: "error", 
                message: "Title and photographer are required" 
            });
        }

        const photo = await Photo.create(req.body);
        res.status(201).json({ status: "success", payload: photo });
    } catch (error) {
        res.status(400).json({ 
            status: "error", 
            message: error.message 
        });
    }
};

exports.updatePhoto = async (req, res) => {
  try {
    const [updated] = await Photo.update(req.body, {
      where: { id: req.params.id }
    });
    
    if (!updated) {
      return res.status(404).json({ status: "error", message: "Photo not found" });
    }
    
    const updatedPhoto = await Photo.findByPk(req.params.id);
    res.status(200).json({ status: "success", payload: updatedPhoto });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

exports.deletePhoto = async (req, res) => {
  try {
    const deleted = await Photo.destroy({
      where: { id: req.params.id }
    });
    
    if (!deleted) {
      return res.status(404).json({ status: "error", message: "Photo not found" });
    }
    
    res.status(200).json({ status: "success", message: "Photo deleted successfully" });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
};