const countryService = require("../services/countryService");
const mongoose = require("mongoose");

module.exports.getCountries = async (req, res) => {
  try {
    const countries = await countryService.getCountries({});
    res.status(200).json(countries);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports.getCountryById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const country = await countryService.getCountryById(id);
    if (!country) return res.status(404).json({ message: "Country not found" });

    res.status(200).json(country);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports.createCountry = async (req, res) => {
  try {
    const newCountry = await countryService.createCountry(req.body);
    res.status(201).json(newCountry);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports.updateCountry = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const updated = await countryService.updateCountry(id, req.body);
    if (!updated) return res.status(404).json({ message: "Country not found" });

    res.status(200).json(updated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

module.exports.deleteCountry = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid ID format" });
  }

  try {
    const deleted = await countryService.deleteCountry(id);
    if (!deleted) return res.status(404).json({ message: "Country not found" });

    res.status(200).json({ message: "Country deleted successfully" });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};