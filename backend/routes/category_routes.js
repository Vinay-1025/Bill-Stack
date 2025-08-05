const express=require('express');
const router=express.Router();

const categoryControllers=require('../controllers/category_controllers')

// Get all categories
router.get('/api/categories',categoryControllers.getAllCategories );

// Create new category
router.post('/api/categories',categoryControllers.addNewCategory );

module.exports=router;