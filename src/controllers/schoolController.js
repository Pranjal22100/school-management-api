const pool = require("../config/db");

// Haversine formula to calculate distance in km between two coordinates
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// POST /addSchool
async function addSchool(req, res) {
  try {
    const { name, address, latitude, longitude } = req.body;

    // --- Validation ---
    const errors = [];

    if (!name || typeof name !== "string" || name.trim() === "") {
      errors.push("'name' is required and must be a non-empty string.");
    }

    if (!address || typeof address !== "string" || address.trim() === "") {
      errors.push("'address' is required and must be a non-empty string.");
    }

    if (latitude === undefined || latitude === null) {
      errors.push("'latitude' is required.");
    } else if (isNaN(Number(latitude)) || Number(latitude) < -90 || Number(latitude) > 90) {
      errors.push("'latitude' must be a valid number between -90 and 90.");
    }

    if (longitude === undefined || longitude === null) {
      errors.push("'longitude' is required.");
    } else if (isNaN(Number(longitude)) || Number(longitude) < -180 || Number(longitude) > 180) {
      errors.push("'longitude' must be a valid number between -180 and 180.");
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    // --- Insert into DB ---
    const [result] = await pool.execute(
      "INSERT INTO schools (name, address, latitude, longitude) VALUES (?, ?, ?, ?)",
      [name.trim(), address.trim(), Number(latitude), Number(longitude)]
    );

    return res.status(201).json({
      success: true,
      message: "School added successfully.",
      data: {
        id: result.insertId,
        name: name.trim(),
        address: address.trim(),
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
    });
  } catch (error) {
    console.error("Error in addSchool:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
}

// GET /listSchools?latitude=xx&longitude=yy
async function listSchools(req, res) {
  try {
    const { latitude, longitude } = req.query;

    // --- Validation ---
    const errors = [];

    if (latitude === undefined || latitude === null) {
      errors.push("Query param 'latitude' is required.");
    } else if (isNaN(Number(latitude)) || Number(latitude) < -90 || Number(latitude) > 90) {
      errors.push("'latitude' must be a valid number between -90 and 90.");
    }

    if (longitude === undefined || longitude === null) {
      errors.push("Query param 'longitude' is required.");
    } else if (isNaN(Number(longitude)) || Number(longitude) < -180 || Number(longitude) > 180) {
      errors.push("'longitude' must be a valid number between -180 and 180.");
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, errors });
    }

    const userLat = Number(latitude);
    const userLon = Number(longitude);

    // --- Fetch all schools ---
    const [schools] = await pool.execute("SELECT * FROM schools");

    if (schools.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No schools found.",
        data: [],
      });
    }

    // --- Calculate distance and sort ---
    const schoolsWithDistance = schools.map((school) => ({
      ...school,
      distance_km: parseFloat(
        calculateDistance(userLat, userLon, school.latitude, school.longitude).toFixed(2)
      ),
    }));

    schoolsWithDistance.sort((a, b) => a.distance_km - b.distance_km);

    return res.status(200).json({
      success: true,
      count: schoolsWithDistance.length,
      user_location: { latitude: userLat, longitude: userLon },
      data: schoolsWithDistance,
    });
  } catch (error) {
    console.error("Error in listSchools:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error." });
  }
}

module.exports = { addSchool, listSchools };
