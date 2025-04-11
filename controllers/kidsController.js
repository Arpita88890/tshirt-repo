const KidsTshirt = require('../models/KidsTshirt');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

exports.dashboard = async (req, res) => {
  const tshirts = await KidsTshirt.find();
  res.render('kids', { tshirts });
};

exports.add = async (req, res) => {
  await new KidsTshirt(req.body).save();
  res.redirect('/kids');
};

exports.update = async (req, res) => {
  await KidsTshirt.findByIdAndUpdate(req.params.id, req.body);
  res.redirect('/kids');
};

exports.delete = async (req, res) => {
  await KidsTshirt.findByIdAndDelete(req.params.id);
  res.redirect('/kids');
};



exports.exportPDF = async (req, res) => {
  const tshirts = await KidsTshirt.find().lean();
  const doc = new PDFDocument({ margin: 30, size: 'A4' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=kids_tshirts.pdf');
  doc.pipe(res);

  // Title
  doc.fontSize(18).text('Kids T‑Shirt Inventory Report (Size 28)', { align: 'center' });
  doc.moveDown();

  // Table Headers
  const headers = ['Type', 'Fabric', 'Color', 'Size', 'Sold To', 'Total', 'Sold', 'Stock'];
  const columnWidths = [70, 70, 60, 40, 90, 50, 50, 50];
  let x = doc.page.margins.left;
  let y = doc.y;

  doc.fontSize(12).fillColor('black').font('Helvetica-Bold');
  headers.forEach((header, i) => {
    doc.text(header, x, y, { width: columnWidths[i], align: 'left' });
    x += columnWidths[i];
  });
  doc.moveDown().moveDown();

  // Reset font for data rows
  doc.font('Helvetica').fontSize(10);

  tshirts.forEach(t => {
    x = doc.page.margins.left;
    y = doc.y;

    const row = [
      t.type || '',
      t.fabric || '',
      t.color || '',
      t.size || '',
      t.soldTo || '',
      (t.total ?? 0).toString(),
      (t.sold ?? 0).toString(),
      ((t.total ?? 0) - (t.sold ?? 0)).toString()
    ];

    row.forEach((item, i) => {
      doc.text(item, x, y, { width: columnWidths[i], align: 'left' });
      x += columnWidths[i];
    });

    doc.moveDown();
  });

  doc.end();
};