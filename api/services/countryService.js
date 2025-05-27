const Country = require("../models/Country");

module.exports.getCountries = async (query) => {
  try {
    return await Country.find(query);
  } catch (e) {
    throw Error("Error while querying all Countries");
  }
};

module.exports.getCountryById = async (id) => {
  try {
    return await Country.findById(id);
  } catch (e) {
    throw Error("Error while retrieving the Country by ID");
  }
};

module.exports.createCountry = async (countryData) => {
  try {
    const country = new Country(countryData);
    return await country.save();
  } catch (e) {
    throw Error("Error while creating a new Country");
  }
};

module.exports.updateCountry = async (id, countryData) => {
  try {
    return await Country.findByIdAndUpdate(id, countryData, { new: true });
  } catch (e) {
    throw Error("Error while updating the Country");
  }
};

module.exports.deleteCountry = async (id) => {
  try {
    return await Country.findByIdAndDelete(id);
  } catch (e) {
    throw Error("Error while deleting the Country");
  }
};