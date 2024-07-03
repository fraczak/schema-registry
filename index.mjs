import express from 'express';
import bodyParser from 'body-parser';
import json_file_object from 'json-file-object';
import k from 'k';
import { encodeCodeToString, fingerprint } from 'k/fingerprint.mjs'

const schemas = json_file_object({file:'schemas.json'});

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 3000;

// Endpoint to store a schema
app.post('/spec', (req, res) => {
  const script = req.body.script;
  const annotated = k.annotate(script);
  const result = {new: [], existing: []};
  for (const code in annotated.codes) {
    console.log(`// CODE ALIAS : ${code}`);
    const s = encodeCodeToString(code,annotated.codes);
    console.log(`// DEFINITION : ${s}`);
    const name = fingerprint(s);
    console.log(`// FINGERPRINT: ${name}`);
    if (schemas[name]) {
      if (s !== schemas[name]) {
        console.log(`// CONFLICT: ${s} != ${schemas[name]}`);
        return res.status(409).json({
          error: 'Two defs for the same code!', 
          code: name, 
          old: schemas[name],
          new: s
        });
      };
      result.existing.push({alias:code, name:name});
    } else {
      result.new.push({alias:code, name:name});
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

    res.status(200).json({ name: schemaName, spec: schema});
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
