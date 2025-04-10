const Tshirt = require('../models/Tshirt');
const { Parser } = require('json2csv');
const PDFDocument = require('pdfkit');

exports.dashboard = async (req, res) => {
    if (!req.session.user) return res.redirect('/login');
    const tshirts = await Tshirt.find();
    res.render('index', { tshirts });
};

exports.add = async (req, res) => {
    const { type, fabric, color, size, soldTo, total, sold } = req.body;
    const newShirt = new Tshirt({ type, fabric, color, size, soldTo, total, sold });
    await newShirt.save();
    res.redirect('/');
};

exports.update = async (req, res) => {
    await Tshirt.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/');
};

exports.delete = async (req, res) => {
    await Tshirt.findByIdAndDelete(req.params.id);
    res.redirect('/');
};

exports.exportCSV = async (req, res) => {
    const tshirts = await Tshirt.find().lean();
    const parser = new Parser();
    const csv = parser.parse(tshirts);
    res.attachment('tshirts.csv');
    res.send(csv);
};

// exports.exportPDF = async (req, res) => {
//     const tshirts = await Tshirt.find().lean();
//     const doc = new PDFDocument();
//     res.setHeader('Content-Type', 'application/pdf');
//     res.setHeader('Content-Disposition', 'attachment; filename=tshirts.pdf');
//     doc.pipe(res);
//     tshirts.forEach(t => {
//         doc.text(`Type: ${t.type}`);
//         doc.text(`Fabric: ${t.fabric}`);
//         doc.text(`Color: ${t.color}`);
//         doc.text(`Size: ${t.size}`);
//         doc.text(`soldTo: ${t.soldTo}`);
//         doc.text(`Total: ${t.total}`);
//         doc.text(`Sold: ${t.sold}`);
//         doc.text(`In Stock: ${t.total - t.sold}`);

//         doc.moveDown();
//     });
//     doc.end();
// };
// const PDFDocument = require('pdfkit');

exports.exportPDF = async (req, res) => {
  const tshirts = await Tshirt.find().lean();
  const doc = new PDFDocument({ margin: 30, size: 'A4' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', 'attachment; filename=tshirts.pdf');
  doc.pipe(res);

  // Title
  doc.fontSize(18).text('T-Shirt Inventory Report', { align: 'center' });
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

  // Reset X for data
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
      t.total?.toString() || '0',
      t.sold?.toString() || '0',
      ((t.total || 0) - (t.sold || 0)).toString()
    ];

    row.forEach((item, i) => {
      doc.text(item, x, y, { width: columnWidths[i], align: 'left' });
      x += columnWidths[i];
    });

    doc.moveDown();
  });

  doc.end();
};