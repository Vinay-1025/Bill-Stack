const express=require('express');
const router=express.Router();

const { body,validationResult} = require('express-validator');

const webCamControllers=require('../controllers/webcam_entry_controllers');


// Validation middleware
// const validateWebcamEntry = [
//   body('date').notEmpty().withMessage('Date is required'),
//   body('time').notEmpty().withMessage('Time is required'),
//   body('category').notEmpty().withMessage('Category is required'),
//   body('reason').notEmpty().trim().isLength({ min: 3 }).withMessage('Reason must be at least 3 characters'),
//   body('image').notEmpty().withMessage('Image is required')
// ];

// const handleValidationErrors = (req, res, next) => {
//     console.log(req.body)
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({
//       success: false,
//       message: 'Validation errors',
//       errors: errors.array()
//     });
//   }
//   next();
// };



// Submit webcam entry
router.post('/api/webcam-entries', webCamControllers.addNewWebCamEntry);

// Get all webcam entries with pagination and filtering
router.get('/api/webcam-entries',webCamControllers.getAllWebCamEntries );

// Get single webcam entry by ID
router.get('/api/webcam-entries/:id',webCamControllers.getEntryById );

// Delete webcam entry
router.delete('/api/webcam-entries/:id',webCamControllers.deleteEntryById);




// Get statistics
// router.get('/api/stats', async (req, res) => {
//   try {
//     const [totalEntries, categoriesStats] = await Promise.all([
//       WebcamEntry.countDocuments(),
//       WebcamEntry.aggregate([
//         {
//           $group: {
//             _id: '$category',
//             count: { $sum: 1 },
//             latestEntry: { $last: '$createdAt' }
//           }
//         },
//         { $sort: { count: -1 } }
//       ])
//     ]);

//     res.json({
//       success: true,
//       data: {
//         totalEntries,
//         categoriesStats
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching stats:', error);
//     res.status(500).json({
//       success: false,
//       message: 'Error fetching statistics',
//       error: error.message
//     });
//   }
// });



module.exports=router