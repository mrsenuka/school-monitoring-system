const PDFDocument = require("pdfkit");

const generateLessonReport = (lessonRecord, res) => {
  const doc = new PDFDocument();

  res.setHeader(
    "Content-Type",
    "application/pdf"
  );

  res.setHeader(
    "Content-Disposition",
    "attachment; filename=LessonReport.pdf"
  );

  doc.pipe(res);

  doc.fontSize(20).text("School Monitoring System", {
    align: "center",
  });

  doc.moveDown();

  doc.fontSize(14).text(
    `Class : ${lessonRecord.classId.className}`
  );

  doc.text(`Date : ${lessonRecord.date}`);

  doc.text(`Day : ${lessonRecord.day}`);

  doc.moveDown();

  lessonRecord.periods.forEach((period) => {
    doc.text(
      `Period ${period.period} | ${period.subject} | Lesson: ${
        period.lessonDone ? "✓" : "✗"
      } | Relief: ${
        period.reliefDone ? "✓" : "✗"
      }`
    );
  });

  doc.end();
};

module.exports = {
  generateLessonReport,
};