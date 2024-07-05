import express from 'express';
import json_file_object from 'json-file-object';
import k from 'k';
import { encodeCodeToString, fingerprint } from 'k/fingerprint.mjs'

const schemas = json_file_object({file:'schemas.json'});
const rels_by_dom = json_file_object({file:'rels-by-dom.json'});
const rels_by_img = json_file_object({file:'rels-by-img.json'});

const app = express();

const PORT = process.env.PORT || 3000;

const body_as_string = express.text();

// Endpoint to store a schema
app.post('/script', body_as_string, (req, res) => {
  const script = req.body;
  const annotated = k.annotate(script);

  console.log(JSON.stringify(annotated,null,2));
  const aliases = Object.keys(annotated.representatives).reduce((acc, x) => {
    const rep = annotated.representatives[x];
    acc[rep] ? acc[rep].push(x) : acc[rep] = [x];
    return acc;
  }, {});

  const result = {new: {}, existing: {}};
  for (const code in annotated.codes) {
    const s = encodeCodeToString(code,annotated.codes);
    const name = fingerprint(s);
    if (schemas[name]) {
      if (s !== schemas[name]) {
        console.error(`CONFLICT: ${s} != ${schemas[name]}`);
        return res.status(409).json({
          error: 'Two defs for the same code!', 
          code: name, 
          old: schemas[name],
          new: s
        });
      };
      result.existing[name] = aliases[code];
    } else {
      result.new[name] = aliases[code];
      schemas[name] = s;
    }
  }
  return res.status(200).json(result);
});

// Endpoint to retrieve a schema
app.get('/schema/:name', (req, res) => {
    const schemaName = req.params.name;
    const schema = schemas[schemaName];

    if (!schema) {
        return res.status(404).json({ error: 'Schema not found' });
    }

    res.status(200).json({ id: schemaName, spec: schema});
});

app.get('/all', (req, res) => {
    res.status(200).json(schemas);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
