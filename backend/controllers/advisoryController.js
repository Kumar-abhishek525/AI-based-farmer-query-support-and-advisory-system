// backend/controllers/advisoryController.js
import CropAdvisory from "../models/CropAdvisory.js";

// @route GET /api/advisory/:cropName
export const getAdvisoryByCrop = async (req, res) => {
  try {
    const { cropName } = req.params;
    const { region } = req.query;

    const filter = { cropName: new RegExp(`^${cropName}$`, "i") };
    if (region) filter.region = new RegExp(region, "i");

    const advisory = await CropAdvisory.findOne(filter);

    if (!advisory) {
      return res.status(404).json({ message: `No advisory found for ${cropName}.` });
    }

    res.status(200).json(advisory);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch advisory.", error: error.message });
  }
};

// @route GET /api/advisory  (list/search, e.g. by season)
export const listAdvisories = async (req, res) => {
  try {
    const { season, region } = req.query;
    const filter = {};
    if (season) filter.season = season;
    if (region) filter.region = new RegExp(region, "i");

    const advisories = await CropAdvisory.find(filter).sort({ cropName: 1 });
    res.status(200).json(advisories);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch advisories.", error: error.message });
  }
};

// @route POST /api/advisory  (admin-only — seed/manage the knowledge base)
export const createAdvisory = async (req, res) => {
  try {
    const advisory = await CropAdvisory.create(req.body);
    res.status(201).json(advisory);
  } catch (error) {
    res.status(400).json({ message: "Failed to create advisory.", error: error.message });
  }
};

// @route PUT /api/advisory/:id  (admin-only)
export const updateAdvisory = async (req, res) => {
  try {
    const advisory = await CropAdvisory.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!advisory) return res.status(404).json({ message: "Advisory not found." });
    res.status(200).json(advisory);
  } catch (error) {
    res.status(400).json({ message: "Failed to update advisory.", error: error.message });
  }
};