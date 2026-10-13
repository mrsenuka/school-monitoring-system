const PDFDocument = require("pdfkit");

const generateLessonReport = (lessonRecord, res) => {
  const doc = new PDFDocument({ margin: 40, size: "A4" });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=LessonReport.pdf");

  doc.pipe(res);

  const cls = lessonRecord.classId;
  const className = cls.className || `Grade ${cls.grade}${cls.section}`;
  const dateStr = new Date(lessonRecord.date).toISOString().split("T")[0];

  // Title
  doc.fontSize(22).font("Helvetica-Bold").text("School Monitoring System", { align: "center" });
  doc.moveDown(0.3);
  doc.fontSize(16).font("Helvetica").text("Daily Lesson Report", { align: "center" });
  doc.moveDown(0.8);

  // Info section
  doc.fontSize(11).font("Helvetica-Bold");
  doc.text(`Class: `, { continued: true }).font("Helvetica").text(className);
  doc.font("Helvetica-Bold").text(`Date: `, { continued: true }).font("Helvetica").text(dateStr);
  doc.font("Helvetica-Bold").text(`Day: `, { continued: true }).font("Helvetica").text(lessonRecord.day);
  doc.moveDown(1);

  // Table config
  const tableLeft = 40;
  const colWidths = [50, 100, 180, 70, 70];
  const tableWidth = colWidths.reduce((a, b) => a + b, 0);
  const rowHeight = 28;
  const headerHeight = 32;

  const headers = ["Period", "Category", "Subject", "Lesson", "Relief"];

  // Draw header
  let y = doc.y;
  doc.rect(tableLeft, y, tableWidth, headerHeight).fill("#1565C0");

  doc.fontSize(10).font("Helvetica-Bold").fillColor("#fff");
  let x = tableLeft;
  headers.forEach((header, i) => {
    doc.text(header, x + 5, y + 9, { width: colWidths[i] - 10, align: "center" });
    x += colWidths[i];
  });

  y += headerHeight;

  // Draw rows
  doc.font("Helvetica").fontSize(9).fillColor("#000");

  let rowIndex = 0;

  lessonRecord.periods.forEach((period) => {
    if (period.subjects && period.subjects.length > 0) {
      period.subjects.forEach((sub, subIdx) => {
        if (y > 750) {
          doc.addPage();
          y = 40;
        }

        const bgColor = rowIndex % 2 === 0 ? "#f8f9fa" : "#ffffff";
        doc.rect(tableLeft, y, tableWidth, rowHeight).fill(bgColor);

        // Draw cell borders
        x = tableLeft;
        colWidths.forEach((w) => {
          doc.rect(x, y, w, rowHeight).stroke("#ddd");
          x += w;
        });

        doc.fillColor("#333");
        x = tableLeft;
        const vals = [
          subIdx === 0 ? String(period.period) : "",
          subIdx === 0 ? period.category : "",
          sub.subject,
          sub.lessonDone ? "Yes" : "No",
          sub.reliefDone ? "Yes" : "No",
        ];

        vals.forEach((val, i) => {
          const color = (i === 3 || i === 4) ? (val === "Yes" ? "#2e7d32" : "#c62828") : "#333";
          doc.fillColor(color).text(val, x + 5, y + 8, { width: colWidths[i] - 10, align: "center" });
          x += colWidths[i];
        });

        y += rowHeight;
        rowIndex++;
      });
    } else {
      if (y > 750) {
        doc.addPage();
        y = 40;
      }

      const bgColor = rowIndex % 2 === 0 ? "#f8f9fa" : "#ffffff";
      doc.rect(tableLeft, y, tableWidth, rowHeight).fill(bgColor);

      x = tableLeft;
      colWidths.forEach((w) => {
        doc.rect(x, y, w, rowHeight).stroke("#ddd");
        x += w;
      });

      doc.fillColor("#333");
      x = tableLeft;
      const vals = [
        String(period.period),
        period.category || "-",
        period.subject || "-",
        period.lessonDone ? "Yes" : "No",
        period.reliefDone ? "Yes" : "No",
      ];

      vals.forEach((val, i) => {
        const color = (i === 3 || i === 4) ? (val === "Yes" ? "#2e7d32" : "#c62828") : "#333";
        doc.fillColor(color).text(val, x + 5, y + 8, { width: colWidths[i] - 10, align: "center" });
        x += colWidths[i];
      });

      y += rowHeight;
      rowIndex++;
    }
  });

  // Footer
  doc.moveDown(2);
  doc.fillColor("#999").fontSize(8).text(
    `Generated on ${new Date().toISOString().split("T")[0]} | School Monitoring System`,
    tableLeft,
    y + 20,
    { align: "center", width: tableWidth }
  );

  doc.end();
};

module.exports = {
  generateLessonReport,
};
