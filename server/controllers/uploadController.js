const { Configuration, OpenAI } = require('openai');
const pdfParse = require('pdf-parse');
const mammoth = require('mammoth');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ensure this is correctly set up
});

exports.handleFileUpload = async (req, res) => {
  const file = req.file;
  let extractedText = "";

  if (file?.mimetype === 'application/pdf') {
    const dataBuffer = file.buffer;
    const pdfData = await pdfParse(dataBuffer);
    extractedText = pdfData.text;
  } else if (file?.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const docData = await mammoth.extractRawText({ buffer: file.buffer });
    extractedText = docData.value;
  }

  req.session.documentText = extractedText;
  res.json({ message: "Document uploaded and analyzed successfully." });
};

exports.handleQuery = async (req, res) => {
  const query = req.body.query;
  const documentText = req.session.documentText;

  if (!documentText) {
    return res.status(400).json({ message: "No document uploaded or analyzed." });
  }

  const prompt = `Based on the following document, answer the query: "${query}". Document: "${documentText}"`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an AI assistant." },
        { role: "user", content: prompt },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const answer = response.choices[0].message.content.trim();
    res.json({ answer });
  } catch (error) {
    console.error('Error processing document and query:', error.message);
    res.status(500).json({ error: 'Failed to process the document and query.' });
  }
};

exports.handleUploadAndQuery = async (req, res) => {
  const file = req.file;
  const query = req.body.query;
  let extractedText = "";

  if (file?.mimetype === 'application/pdf') {
    const dataBuffer = file.buffer;
    const pdfData = await pdfParse(dataBuffer);
    extractedText = pdfData.text;
  } else if (file?.mimetype === "application/vnd.openxmlformats-officedocument.wordprocessingml.document") {
    const docData = await mammoth.extractRawText({ buffer: file.buffer });
    extractedText = docData.value;
  }

  if (!extractedText) {
    return res.status(400).json({ error: 'Failed to extract text from the document.' });
  }

  const prompt = `Based on the following document, answer the query: "${query}". Document: "${extractedText}"`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are an AI assistant." },
        { role: "user", content: prompt },
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const answer = response.choices[0].message.content.trim();
    res.json({ answer });
  } catch (error) {
    console.error('Error processing document and query:', error.message);
    res.status(500).json({ error: 'Failed to process the document and query.' });
  }
};
