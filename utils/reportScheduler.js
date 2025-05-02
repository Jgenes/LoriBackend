const cron = require('node-cron');
const ScheduledReport = require('../models/ScheduledReport');
const sendEmail = require('./emailSender'); // Email utility

// Schedule a cron job to run daily
cron.schedule('0 0 * * *', async () => {
  try {
    const today = new Date();

    // Fetch reports scheduled for today
    const reports = await ScheduledReport.find({ nextReportDate: { $lte: today } }).populate('vehicle user');

    reports.forEach(async (report) => {
      const emailText = `
        Scheduled Report for Vehicle ${report.vehicle._id} (${report.vehicle.name}):
        - Status: Active
        - Last Location: [Fetch latest location here]
        - Next Service Date: ${report.vehicle.nextServiceDate || 'N/A'}
      `;

      // Send the report via email
      await sendEmail(report.user.email, 'Scheduled Vehicle Report', emailText);

      // Update the next report date
      const nextDate = new Date();
      if (report.frequency === 'Daily') nextDate.setDate(nextDate.getDate() + 1);
      if (report.frequency === 'Weekly') nextDate.setDate(nextDate.getDate() + 7);
      if (report.frequency === 'Monthly') nextDate.setMonth(nextDate.getMonth() + 1);

      report.nextReportDate = nextDate;
      await report.save();
    });

    console.log('Scheduled reports sent successfully');
  } catch (error) {
    console.error('Error sending scheduled reports:', error.message);
  }
});