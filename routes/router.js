// Import necessary modules and libraries
const express = require('express');
const router = express.Router();
const multer = require('multer');
const { MongoClient } = require('mongodb');
const Category = require('../models/Post');
const path = require('path');

// Initialize multer with the configured storage options
const storage = multer.memoryStorage(); // Use memory storage to store files as buffers
const upload = multer({ storage: storage });

// Middleware function for authentication check
const authenticate = (req, res, next) => {
    const isAuthenticated = req.session.isAuthenticated;

    // Exclude the login route from redirection
    if (req.path === '/login') {
        return next();
    }

    if (isAuthenticated) {
        next();
    } else {
        res.redirect('/login');
    }
};


// Login route
router.get('/login', (req, res) => {
    res.render('login');
});

// Function to extract YouTube video ID from URL
function getYoutubeVideoId(url) {
    const match = url.match(/(?:embed\/|v=|vi?=|youtu.be\/|\/v\/|\/e\/|u\/\w+\/|playlist\/|youtu.be\/|user\/\w+\/|index(?:\.php)?)\??v?=?([^#\&\?]*).*/i);
    return match && match[1] ? match[1] : null;
};


// Create tutorial route
router.post('/create-tutorial', upload.single('pdf'), async (req, res) => {

    // Extract form data from the request body
    const { category, title, text, youtubeUrl } = req.body;

    try {
        // Find or create the specified category in the database
        let tutorialCategory = await Category.findOne({ name: category });
        if (!tutorialCategory) {
            tutorialCategory = new Category({ name: category });
        }

        // Extract YouTube video ID from the provided URL
        const youtubeVideoId = getYoutubeVideoId(youtubeUrl);

        // Add the new tutorial to the category with the PDF content
        tutorialCategory.tutorials.push({
            title,
            text,
            pdfUrl: req.file.buffer.toString('base64'), // Save the PDF content as a string
            youtubeIframe: `<iframe width="560" height="315" src="https://www.youtube.com/embed/${youtubeVideoId}" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`
        });

        // Save the updated category with the new tutorial
        await tutorialCategory.save();

        // Redirect to the category page
        res.redirect(`/${encodeURIComponent(category)}`);
    } catch (err) {
        // Handle errors by logging and sending a 500 Internal Server Error response with an error message
        console.error('Error creating tutorial:', err);
        res.status(500).json({ message: err.message });
    }
});



// Route to view the PDF
router.get('/view-pdf/:tutorialId', async (req, res) => {
    const { tutorialId } = req.params;

    try {
        const category = await Category.findOne({ 'tutorials._id': tutorialId });
        if (!category) {
            return res.status(404).render('error', { message: 'Tutorial not found' });
        }

        const tutorial = category.tutorials.find(t => t._id.toString() === tutorialId);
        if (!tutorial || !tutorial.pdfUrl) {
            return res.status(404).render('error', { message: 'PDF not found' });
        }

        // Convert Base64-encoded content back to buffer
        const pdfBuffer = Buffer.from(tutorial.pdfUrl, 'base64');

        // Set headers for inline display
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline');
        res.send(pdfBuffer);
    } catch (error) {
        console.error('Error viewing PDF:', error);
        res.status(500).json({ message: error.message });
    }
});

// Route to display the page for selecting and deleting tutorials
router.get('/delete-tutorial', async (req, res) => {
    try {
        // Fetch all tutorials (or specific ones as needed)
        const allTutorials = await Category.find({}, 'name tutorials');

        // Render the 'delete-tutorial' view with the fetched tutorials
        res.render('delete-tutorial', { tutorials: allTutorials });
    } catch (error) {
        console.error('Error fetching tutorials for deletion:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Handle the POST request to delete the selected tutorial
router.post('/delete-tutorial', async (req, res) => {
    try {
        // Get the selected tutorial ID from the request body
        const { selectedTutorial } = req.body;

        // Find and delete the tutorial by ID
        const updatedCategory = await Category.findOneAndUpdate(
            { 'tutorials._id': selectedTutorial },
            { $pull: { tutorials: { _id: selectedTutorial } } },
            { returnDocument: 'after' }
        );

        if (updatedCategory) {
            // Tutorial deleted successfully
            const tutorials = await Category.find({}, 'name tutorials');
            res.render('delete-tutorial', { successMessage: 'Tutorial deleted successfully.', tutorials });
        } else {
            // No tutorial found for deletion
            const tutorials = await Category.find({}, 'name tutorials');
            res.render('delete-tutorial', { errorMessage: 'Tutorial not found or already deleted.', tutorials });
        }
    } catch (error) {
        console.error('Error deleting tutorial:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// Route to render the edit tutorial form
router.get('/edit-tutorial/:tutorialId', async (req, res) => {
    const { tutorialId } = req.params;

    try {
        // Find the tutorial with the specified ID
        const category = await Category.findOne({ 'tutorials._id': tutorialId });
        if (!category) {
            // If the category is not found, render an error page
            return res.status(404).render('error', { message: 'Tutorial not found' });
        }

        const tutorial = category.tutorials.find(t => t._id.toString() === tutorialId);
        if (!tutorial) {
            // If the tutorial is not found, render an error page
            return res.status(404).render('error', { message: 'Tutorial not found' });
        }

        // Render the 'edit-tutorial' template with the tutorial data
        res.render('edit-tutorial', { category, tutorial });
    } catch (error) {
        // Handle errors by logging and sending a 500 Internal Server Error response with an error message
        console.error('Error rendering edit form:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to handle the submission of the edit tutorial form
router.post('/edit-tutorial/:tutorialId', async (req, res) => {
    const { tutorialId } = req.params;
    const { title, text, youtubeUrl } = req.body;

    try {
        // Find the tutorial with the specified ID
        const category = await Category.findOne({ 'tutorials._id': tutorialId });
        if (!category) {
            // If the category is not found, render an error page
            return res.status(404).render('error', { message: 'Tutorial not found' });
        }

        const tutorialIndex = category.tutorials.findIndex(t => t._id.toString() === tutorialId);
        if (tutorialIndex === -1) {
            // If the tutorial is not found, render an error page
            return res.status(404).render('error', { message: 'Tutorial not found' });
        }

        // Update the tutorial with the new data
        category.tutorials[tutorialIndex].title = title;
        category.tutorials[tutorialIndex].text = text;
        category.tutorials[tutorialIndex].youtubeUrl = youtubeUrl;

        // Save the updated category with the edited tutorial
        await category.save();

        // Redirect to the delete-tutorial page
        res.redirect('/delete-tutorial');
    } catch (error) {
        // Handle errors by logging and sending a 500 Internal Server Error response with an error message
        console.error('Error editing tutorial:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});



// Route to create a tutorial
router.get('/admin', authenticate, (req, res) => {
    // Render the form to create a tutorial
    res.render('admin');
});

// Route to display the gallery page
router.get('/gallery', (req, res) => {
    // Render the 'gallery' template
    res.render('gallery');
});

// Route to display the about page
router.get('/about', (req, res) => {
    // Render the 'gallery' template
    res.render('about');
});

// Route to display the contact page
router.get('/contact', (req, res) => {
    // Render the 'gallery' template
    res.render('contact');
});

// Route to display the tutorials page
router.get('/tutorials', (req, res) => {
    // Render the 'gallery' template
    res.render('tutorials');
});

// Route to display tutorials in the 'lighting' category
router.get('/lighting', async (req, res) => {
    try {
        console.log('Lighting route triggered');

        const category = await Category.findOne({ name: { $regex: new RegExp('lighting', 'i') } });

        if (!category) {
            // If the category is not found, render an error page
            console.error('Lighting category not found');
            return res.status(404).render('error', { message: 'There are no tutorials to display at this moment. Kindly check back later' });
        }

        // Render the 'lighting' template with category data and the first YouTube iframe
        res.render('lighting', { category, youtubeIframe: category.tutorials[0].youtubeIframe });
    } catch (error) {
        // Handle errors by logging and sending a 500 Internal Server Error response with an error message
        console.error('Error fetching category:', error);
        res.status(500).json({ message: error.message });
    }
});

// Route to display tutorials in the 'Unreal Engine' category
router.get('/unrealengine', async (req, res) => {
    try {
        console.log('Unreal Engine route triggered');

        const category = await Category.findOne({ name: { $regex: new RegExp('Unreal', 'i') } });

        if (!category) {
            // If the category is not found, render an error page
            console.error('Unreal Engine category not found');
            return res.status(404).render('error', { message: 'There are no tutorials to display at this moment. Kindly check back later' });
        }

        res.render('unrealengine', { category, youtubeIframe: category.tutorials[0].youtubeIframe });
    } catch (error) {
        // Handle errors by logging and sending a 500 Internal Server Error response with an error message
        console.error('Error fetching category:', error);
        res.status(500).json({ message: error.message });
    }
});

// Route to display tutorials in the 'Virtual Production' category
router.get('/virtual', async (req, res) => {
    try {
        console.log('Virtual Production route triggered');

        const category = await Category.findOne({ name: { $regex: new RegExp('Virtual', 'i') } });

        if (!category) {
            // If the category is not found, render an error page
            console.error('Virtual Production category not found');
            return res.status(404).render('error', { message: 'There are no tutorials to display at this moment. Kindly check back later' });
        }

        res.render('virtual', { category, youtubeIframe: category.tutorials[0].youtubeIframe });
    } catch (error) {
        // Handle errors by logging and sending a 500 Internal Server Error response with an error message
        console.error('Error fetching category:', error);
        res.status(500).json({ message: error.message });
    }
});


// Route to display tutorials in the 'Teleprompter' category
router.get('/teleprompter', async (req, res) => {
    try {
        console.log('Teleprompter route triggered');

        const category = await Category.findOne({ name: { $regex: new RegExp('Teleprompter', 'i') } });

        if (!category) {
            // If the category is not found, render an error page
            console.error('Teleprompter category not found');
            return res.status(404).render('error', { message: 'There are no tutorials to display at this moment. Kindly check back later' });
        }

        res.render('teleprompter', { category, youtubeIframe: category.tutorials[0].youtubeIframe });
    } catch (error) {
        // Handle errors by logging and sending a 500 Internal Server Error response with an error message
        console.error('Error fetching category:', error);
        res.status(500).json({ message: error.message });
    }
});


// Route to display tutorials in the 'Teleprompter' category
router.get('/greenscreen', async (req, res) => {
    try {
        console.log('Teleprompter route triggered');

        const category = await Category.findOne({ name: { $regex: new RegExp('Greenscreen', 'i') } });

        if (!category) {
            // If the category is not found, render an error page
            console.error('Greenscreen category not found');
            return res.status(404).render('error', { message: 'There are no tutorials to display at this moment. Kindly check back later' });
        }

        res.render('greenscreen', { category, youtubeIframe: category.tutorials[0].youtubeIframe });
    } catch (error) {
        // Handle errors by logging and sending a 500 Internal Server Error response with an error message
        console.error('Error fetching category:', error);
        res.status(500).json({ message: error.message });
    }
});


// Route to display tutorials in a specified category
router.get('/:category', async (req, res) => {
    const categoryName = req.params.category.toLowerCase(); // Convert to lowercase for case-insensitivity
    console.log('Category route triggered');
    try {
        if (categoryName === 'lighting' || categoryName === 'unreal' || categoryName === 'virtual' || categoryName === 'teleprompter' || categoryName === 'greenscreen') {
            // Find the category with the specified name
            const category = await Category.findOne({ name: { $regex: new RegExp(categoryName, 'i') } });
            if (!category) {
                // If the category is not found, render an error page
                return res.status(404).render('error', { message: 'Category not found' });
            }

            // Render the template based on the category
            res.render(categoryName, { category });
        } else {
            // Handle other categories or render a default template
            return res.status(404).render('error', { message: 'Invalid category' });
        }
    } catch (err) {
        // Handle errors by logging and sending a 500 Internal Server Error response with an error message
        console.error('Error fetching category:', err);
        res.status(500).json({ message: err.message });
    }
});

// Export the router for use in other parts of the application
module.exports = router;