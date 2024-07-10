import express from 'express';
import json_file_object from 'json-file-object';
import k from 'k';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemas = json_file_object({file:'schemas.json'});
const rels_by_dom = json_file_object({file:'rels-by-dom.json'});
const rels_by_img = json_file_object({file:'rels-by-img.json'});

const app = express();
app.use(express.static(path.join(__dirname, 'public')));

const PORT = process.env.PORT || 3000;
const bodyText = express.text();

// Endpoint to store a schema
app.post('/k', bodyText, (req, res) => {
  const script = req.body;
  const annotated = k.annotate(script);

  console.log(JSON.stringify(annotated,null,2));

  for (const [key, value] of Object.entries(annotated.codes)) {
    schemas[key] = value;
  }

  return res.status(200).json(annotated);
});

// Endpoint to retrieve a schema
app.get('/q', (req, res) => {
  const schemaName = req.query.schema;
  const schema = schemas[schemaName];

  if (!schema) {
      return res.status(404).json({ error: 'Schema not found' });
  }

  res.status(200).json({ id: schemaName, spec: schema});
});

app.get('/all', (req, res) => {
  res.status(200).json(schemas);
});

// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname,'public/index.html'));
// });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
