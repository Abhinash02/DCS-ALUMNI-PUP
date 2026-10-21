const SiteSettings = require('../models/SiteSettings');

// GET /api/theme - Fetch currently active global theme
exports.getTheme = async (req, res) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({ activePaletteId: 'maroon' });
    }
    return res.status(200).json({
      success: true,
      activePaletteId: settings.activePaletteId || 'maroon',
      updatedAt: settings.updatedAt,
    });
  } catch (error) {
    console.error('Error fetching global site theme:', error);
    // Graceful fallback to default maroon
    return res.status(200).json({
      success: true,
      activePaletteId: 'maroon',
    });
  }
};

// PUT /api/theme - Update global site theme for all domains and visitors
exports.updateTheme = async (req, res) => {
  try {
    const { paletteId } = req.body;
    if (!paletteId) {
      return res.status(400).json({ success: false, error: 'paletteId is required' });
    }

    const validPalettes = ['maroon', 'blue', 'default', 'emerald', 'purple', 'ocean', 'amber'];
    const chosenPalette = validPalettes.includes(paletteId) ? paletteId : 'maroon';

    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings({ activePaletteId: chosenPalette });
    } else {
      settings.activePaletteId = chosenPalette;
    }

    await settings.save();

    return res.status(200).json({
      success: true,
      activePaletteId: settings.activePaletteId,
      message: 'Global theme updated successfully across all domains',
    });
  } catch (error) {
    console.error('Error updating global site theme:', error);
    return res.status(500).json({ success: false, error: 'Failed to update theme' });
  }
};
