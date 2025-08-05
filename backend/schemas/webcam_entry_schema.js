const mongoose=require('mongoose')

// Webcam Entry Schema
const webcamEntrySchema = new mongoose.Schema({
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  reason: {
    type: String,
    required: true,
    trim: true
  },
  imagePath: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  metadata: {
    fileSize: Number,
    mimeType: String,
    originalName: String
  }
}, {
  timestamps: true
});


const WebcamEntry = mongoose.model('WebcamEntry', webcamEntrySchema);


module.exports=WebcamEntry