const Job = require('../models/Job');

// Create a new job
const createJob = async (req, res) => {
  try {
    const { title, company, location, type, description, applyLink } = req.body;

    // We assume the user ID is in req.user.userId from authMiddleware
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: 'Unauthorized. Only logged-in alumni can post jobs.' });
    }

    const job = new Job({
      title,
      company,
      location,
      type,
      description,
      applyLink,
      postedBy: req.user.userId
    });

    await job.save();
    res.status(201).json(job);
  } catch (error) {
    console.error('Error creating job:', error);
    res.status(500).json({ error: 'Failed to create job post.' });
  }
};

// Get all jobs
const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find({ isActive: true })
      .populate('postedBy', 'name email course batch profession')
      .sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    res.status(500).json({ error: 'Failed to fetch jobs.' });
  }
};

// Get jobs posted by a specific user
const getMyJobs = async (req, res) => {
  try {
    if (!req.user || !req.user.userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const jobs = await Job.find({ postedBy: req.user.userId }).sort({ createdAt: -1 });
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Error fetching my jobs:', error);
    res.status(500).json({ error: 'Failed to fetch your jobs.' });
  }
};

// Delete a job
const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Only allow deletion if the user is the poster or an admin
    if (job.postedBy.toString() !== req.user.userId) {
       return res.status(403).json({ error: 'Unauthorized to delete this job' });
    }

    await Job.findByIdAndDelete(id);
    res.status(200).json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({ error: 'Failed to delete job.' });
  }
};

// Update a job
const updateJob = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, company, location, type, description, applyLink } = req.body;
    
    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Ensure only the original poster can update
    if (job.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Unauthorized to update this job' });
    }

    job.title = title || job.title;
    job.company = company || job.company;
    job.location = location || job.location;
    job.type = type || job.type;
    job.description = description || job.description;
    job.applyLink = applyLink || job.applyLink;

    await job.save();
    res.status(200).json(job);
  } catch (error) {
    console.error('Error updating job:', error);
    res.status(500).json({ error: 'Failed to update job.' });
  }
};

// Get jobs from external APIs simultaneously
const getExternalJobs = async (req, res) => {
  try {
    // Fetch from TWO free public APIs simultaneously (no API keys or rate limits)
    const [remotiveRes, arbeitnowRes] = await Promise.allSettled([
      fetch('https://remotive.com/api/remote-jobs?category=software-dev'),
      fetch('https://www.arbeitnow.com/api/job-board-api')
    ]);

    let externalJobs = [];

    // 1. Process Remotive API
    if (remotiveRes.status === 'fulfilled') {
      const remotiveData = await remotiveRes.value.json();
      if (remotiveData && remotiveData.jobs) {
        const mappedRemotive = remotiveData.jobs
          .filter(job => 
            job.candidate_required_location.toLowerCase().includes('india') || 
            job.candidate_required_location.toLowerCase().includes('worldwide') ||
            job.candidate_required_location.toLowerCase().includes('anywhere')
          )
          .map(job => ({
            _id: `ext_rem_${job.id}`,
            title: job.title,
            company: job.company_name,
            location: job.candidate_required_location || 'Remote',
            type: job.job_type ? job.job_type.replace('_', ' ') : 'Full-Time',
            description: job.description.replace(/<[^>]*>?/gm, ''), // Strip HTML
            applyLink: job.url,
            createdAt: new Date(job.publication_date),
            isExternal: true,
          }));
        externalJobs = [...externalJobs, ...mappedRemotive];
      }
    }

    // 2. Process Arbeitnow API
    if (arbeitnowRes.status === 'fulfilled') {
      const arbeitnowData = await arbeitnowRes.value.json();
      if (arbeitnowData && arbeitnowData.data) {
        const mappedArbeitnow = arbeitnowData.data
          .filter(job => job.location.toLowerCase().includes('india') || job.title.toLowerCase().includes('india') || job.remote)
          .map(job => ({
            _id: `ext_arb_${job.slug}`,
            title: job.title,
            company: job.company_name,
            location: job.location || 'Remote',
            type: job.job_types && job.job_types.length > 0 ? job.job_types[0] : 'Full-Time',
            description: job.description.replace(/<[^>]*>?/gm, ''), // Strip HTML
            applyLink: job.url,
            createdAt: new Date(job.created_at * 1000), // Arbeitnow uses unix timestamp
            isExternal: true,
          }));
        externalJobs = [...externalJobs, ...mappedArbeitnow];
      }
    }

    res.status(200).json(externalJobs);
  } catch (error) {
    console.error('Error fetching external jobs:', error);
    res.status(500).json({ error: 'Failed to fetch external jobs' });
  }
};

module.exports = {
  createJob,
  getJobs,
  getMyJobs,
  deleteJob,
  updateJob,
  getExternalJobs
};

