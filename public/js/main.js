function submitText() {
  const text = document.getElementById('textInput').value;
  fetch('/k', {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain'
    },
    body: text
  })
  .then(response => response.text()) // Convert the response to text
  .then(result => {
      document.getElementById('responseOutput').innerText = result;
  })
  .catch(error => console.error('Error:', error)); // Handle any errors
}

function getSchema() {
  const schema = document.getElementById('schemaInput').value;
  fetch(`/q?schema=${encodeURIComponent(schema)}`)
  .then(response => response.text()) // Convert the response to text
  .then(result => {
      document.getElementById('responseOutput2').innerText = result;
  })
  .catch(error => console.error('Error:', error)); // Handle any errors
}

function evaluateText() {
  const code = document.getElementById('code-input').value;
  const data = {};
  const output = local_k.run(code,data);  
  document.getElementById('output').textContent = JSON.stringify(output, null, 2);
}
