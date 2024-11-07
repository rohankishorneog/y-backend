const setPreferences = (req, res, next) => {
  const { age, gender, startDate, endDate } = req.body;
  res.cookie(
    "preferences",
    { age, gender, startDate, endDate },
    { httpOnly: true, maxAge: 86400000 }
  );
  res.json({ message: "Preferences saved" });
};

const clearPreferences = (req, res) => {
  res.clearCookie("preferences");
  res.json({ message: "Preferences cleared" });
};

module.exports = { setPreferences, clearPreferences };
