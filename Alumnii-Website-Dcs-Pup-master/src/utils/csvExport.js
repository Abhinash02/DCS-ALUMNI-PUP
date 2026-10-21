/**
 * DCS Alumni Portal - CSV Exporter Utility
 * Generates RFC-4180 compliant CSV files with UTF-8 BOM for Microsoft Excel & Google Sheets compatibility.
 */

const formatCSVField = (val) => {
  if (val === null || val === undefined) return '""';
  let str = String(val).trim();
  // Escape double quotes by doubling them
  str = str.replace(/"/g, '""');
  return `"${str}"`;
};

export const exportAlumniToCSV = (alumniList = [], filename = `DCS_PUP_Alumni_${new Date().toISOString().slice(0, 10)}.csv`) => {
  if (!alumniList || alumniList.length === 0) {
    alert('No alumni records available to export.');
    return false;
  }

  const headers = [
    'Full Name',
    'Course / Degree',
    'Batch',
    'Email Address',
    'Phone Number',
    'Current Profession / Role',
    'Organization / Company',
    'Key Skills',
    'LinkedIn URL',
    'Portfolio / Website',
    'Father Name',
    'Address',
    'Record Type'
  ];

  const rows = alumniList.map((a) => {
    const name = a.name || a.Name || '';
    const course = a.course || a.Course || '';
    const batch = a.batch || a.Batch || '';
    const email = a.email || a.Email || '';
    const phone = a.phone || a.PhoneNo || a.phoneNo || '';
    const profession = a.profession || a.Profession || a.Occupation || '';
    const organization = a.organization || a.InstituteName || a.Occupation || '';
    const skills = Array.isArray(a.skills) 
      ? a.skills.join(', ') 
      : (a.skills || a.Skill || a.skill || '');
    const linkedin = a.linkedin || a.LinkedIn || '';
    const website = a.website || a.WebsiteLink || a.websiteLink || '';
    const fatherName = a.fathername || a.FatherName || '';
    const address = a.address || a.Address || '';
    const recordType = a._id ? 'Registered & Approved' : 'Archival Directory';

    return [
      formatCSVField(name),
      formatCSVField(course),
      formatCSVField(batch),
      formatCSVField(email),
      formatCSVField(phone),
      formatCSVField(profession),
      formatCSVField(organization),
      formatCSVField(skills),
      formatCSVField(linkedin),
      formatCSVField(website),
      formatCSVField(fatherName),
      formatCSVField(address),
      formatCSVField(recordType),
    ].join(',');
  });

  // UTF-8 BOM ensures Excel displays UTF-8 characters cleanly
  const csvContent = '\uFEFF' + [headers.map(formatCSVField).join(','), ...rows].join('\r\n');

  try {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.href = url;
    downloadLink.setAttribute('download', filename);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    setTimeout(() => URL.revokeObjectURL(url), 2000);
    return true;
  } catch (error) {
    console.error('Failed to export CSV:', error);
    alert('An error occurred while generating the CSV file.');
    return false;
  }
};
