// const Event = require('../models/Event');
// const cloudinary = require('../utils/cloudinary');

// exports.createEvent = async (req, res) => {
//   try {
//     const { title, description, position, bgColor, textColor } = req.body;
//     const images = req.files;

//     if (!title || !description || !images || images.length === 0) {
//       return res.status(400).json({ error: 'Title, description, and at least one image are required' });
//     }

//     const uploadedImages = await Promise.all(
//       images.map(async (image) => {
//         const result = await cloudinary.uploader.upload(image.path, {
//           folder: 'events',
//         });
//         return {
//           url: result.secure_url,
//           publicId: result.public_id,
//         };
//       })
//     );

//     const event = new Event({
//       title,
//       description,
//       position,
//       bgColor,
//       textColor,
//       images: uploadedImages,
//     });

//     await event.save();
//     res.status(201).json(event);
//   } catch (error) {
//     console.error('Error creating event:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// exports.getEvents = async (req, res) => {
//   try {
//     const events = await Event.find();
//     res.json(events);
//   } catch (error) {
//     console.error('Error fetching events:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };

// exports.deleteEvent = async (req, res) => {
//   try {
//     const event = await Event.findById(req.params.id);
//     if (!event) {
//       return res.status(404).json({ error: 'Event not found' });
//     }

//     if (req.body.publicIds && req.body.publicIds.length > 0) {
//       await Promise.all(
//         req.body.publicIds.map((publicId) => cloudinary.uploader.destroy(publicId))
//       );
//     }

//     await event.deleteOne();
//     res.json({ message: 'Event deleted' });
//   } catch (error) {
//     console.error('Error deleting event:', error);
//     res.status(500).json({ error: 'Server error' });
//   }
// };




const Event = require('../models/Event');
const cloudinary = require('../utils/cloudinary');
const streamifier = require('streamifier');

exports.createEvent = async (req, res) => {
  try {
    const { title, description, position, bgColor, textColor } = req.body;
    const images = req.files;

    if (!title || !description || !images || images.length === 0) {
      return res.status(400).json({ error: 'Title, description, and at least one image are required' });
    }

    const uploadedImages = await Promise.all(
      images.map(async (image) => {
        return new Promise((resolve, reject) => {
          const uploadStream = cloudinary.uploader.upload_stream(
            {
              folder: 'events',
              resource_type: 'image',
            },
            (error, result) => {
              if (error) return reject(error);
              resolve({
                url: result.secure_url,
                publicId: result.public_id,
              });
            }
          );
          streamifier.createReadStream(image.buffer).pipe(uploadStream);
        });
      })
    );

    const event = new Event({
      title,
      description,
      position,
      bgColor,
      textColor,
      images: uploadedImages,
    });

    await event.save();
    res.status(201).json(event);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getEvents = async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    if (req.body.publicIds && req.body.publicIds.length > 0) {
      await Promise.all(
        req.body.publicIds.map((publicId) => cloudinary.uploader.destroy(publicId))
      );
    }

    await event.deleteOne();
    res.json({ message: 'Event deleted' });
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ error: 'Server error' });
  }
};