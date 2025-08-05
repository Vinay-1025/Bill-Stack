
const Category=require('../schemas/category_schema');
const WebcamEntry=require('../schemas/webcam_entry_schema')

const saveBase64Image=require('../helpers/utils').saveBase64Image

exports.addNewWebCamEntry=async (req, res) => {
  try {
    const { date, time, category, reason, image } = req.body;
    console.log(req.body)
    // Verify category exists
    const categoryExists = await Category.findOne({ name: category, isActive: true });
    if (!categoryExists) {
      return res.status(400).json({
        success: false,
        message: 'Invalid category selected'
      });
    }

    // Generate unique filename
    const timestamp = Date.now();
    const filename = `webcam_${timestamp}.png`;
    
    // Save image
    const imagePath = await saveBase64Image(image, filename);
    const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${filename}`;
    
    // Calculate file size
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Image, 'base64');
    
    console.log("hello");
    // Create webcam entry
    const webcamEntry = new WebcamEntry({
      date,
      time,
      category,
      reason,
      "imagePath":imagePath.filename,
      imageUrl,
      metadata: {
        fileSize: buffer.length,
        mimeType: 'image/png',
        originalName: filename
      }
    });

    await webcamEntry.save();
    
    res.status(201).json({
      success: true,
      message: 'Entry saved successfully',
      data: {
        id: webcamEntry._id,
        date: webcamEntry.date,
        time: webcamEntry.time,
        category: webcamEntry.category,
        reason: webcamEntry.reason,
        imageUrl: webcamEntry.imageUrl,
        createdAt: webcamEntry.createdAt
      }
    });
  } catch (error) {
    console.log(req.body)
    console.error('Error saving webcam entry:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving entry',
      error: error.message
    });
  }
}


exports.getAllWebCamEntries=async (req, res) => {
  try {
    const {
      page = 1,
      limit = 9,
      category,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      startDate,
      endDate,
      search
    } = req.query;

    // Build filter object
    const filter = {};
    if (category) filter.category = category;
    if(search) filter.reason={ $regex: search, $options: 'i' };
    
    // Date range filter (if provided)
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Calculate pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query
    const [entries, totalCount] = await Promise.all([
      WebcamEntry.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .select('-imagePath'), // Exclude file path for security
      WebcamEntry.countDocuments(filter)
    ]);

    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.json({
      success: true,
      data: {
        entries,
        pagination: {
          currentPage: parseInt(page),
          totalPages,
          totalCount,
          hasNext: parseInt(page) < totalPages,
          hasPrev: parseInt(page) > 1
        }
      }
    });
  } catch (error) {
    console.error('Error fetching webcam entries:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching entries',
      error: error.message
    });
  }
}

exports.getEntryById=async (req, res) => {
  try {
    const entry = await WebcamEntry.findById(req.params.id).select('-imagePath');
    
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Entry not found'
      });
    }

    res.json({
      success: true,
      data: entry
    });
  } catch (error) {
    console.error('Error fetching webcam entry:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching entry',
      error: error.message
    });
  }
}

exports.deleteEntryById= async (req, res) => {
  try {
    const entry = await WebcamEntry.findById(req.params.id);
    
    if (!entry) {
      return res.status(404).json({
        success: false,
        message: 'Entry not found'
      });
    }

    // Delete image file
    if (fs.existsSync(entry.imagePath)) {
      fs.unlinkSync(entry.imagePath);
    }

    // Delete database entry
    await WebcamEntry.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Entry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting webcam entry:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting entry',
      error: error.message
    });
  }
}