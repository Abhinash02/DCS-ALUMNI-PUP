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

exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, position, bgColor, textColor, removedPublicIds } = req.body;
    const images = req.files;

    if (!title || !description) {
      return res.status(400).json({ error: 'Title and description are required' });
    }

    const event = await Event.findById(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    let currentImages = event.images || [];

    // Remove any selected images from Cloudinary and current list
    if (removedPublicIds) {
      try {
        const parsedRemoved = typeof removedPublicIds === 'string'
          ? JSON.parse(removedPublicIds)
          : removedPublicIds;
        if (Array.isArray(parsedRemoved) && parsedRemoved.length > 0) {
          await Promise.all(
            parsedRemoved.map((publicId) => cloudinary.uploader.destroy(publicId).catch(() => {}))
          );
          currentImages = currentImages.filter((img) => !parsedRemoved.includes(img.publicId));
        }
      } catch (parseErr) {
        console.error('Error parsing removedPublicIds:', parseErr);
      }
    }

    // Upload and APPEND newly added images
    if (images && images.length > 0) {
      const newlyUploaded = await Promise.all(
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
      currentImages = [...currentImages, ...newlyUploaded];
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      id,
      {
        title,
        description,
        position: position || event.position || 'right',
        bgColor: bgColor || event.bgColor || 'bg-white',
        textColor: textColor || event.textColor || '#374151',
        images: currentImages,
      },
      { new: true }
    );

    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
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