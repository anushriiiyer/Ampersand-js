
const runButton = document.getElementById('ocr-run');
let accessToken = null;
let extractedpan = "";
var fullname = "";
let type = "Personal";
console.log("script-api.js loaded");


async function fetchAccessToken() {
  const proxy = "https://cors-anywhere.herokuapp.com/"
  const url = "https://api.sandbox.co.in/authenticate"
  try {
    const response = await fetch(proxy + url, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "x-api-version": "1.0",
        "x-api-key": "key_live_aEvaKyycYit9iyUb1lJB4EYgOo5Cq38N",
        "x-api-secret": "secret_live_RJMAv5dNqTZ7SNIN4w5iRvdTGJYe0nTz"
      },
      //redirect: "follow"
    });

    const result = await response.json();
    return result.access_token;

  } catch (error) {
    console.error("Token fetch error:", error);
    throw error;
  }
}
;

document.getElementById("validate").addEventListener("click", async function () {
  accessToken = await fetchAccessToken();
  console.log("New Token fetched:", accessToken);

  const proxy = "https://cors-anywhere.herokuapp.com/";
  const url = `https://api.sandbox.co.in/pans/${extractedpan}/verify?consent=Y&reason=For%20KYC%20of%20User`;


  try {
    const response = await fetch(proxy + url, {
      method: "GET",
      headers: {
        "Authorization": `${accessToken}`,
        "accept": "application/json",
        "x-api-key": "key_live_aEvaKyycYit9iyUb1lJB4EYgOo5Cq38N",
        "x-api-version": "1.0",
      },
    });

    const result = await response.json();

    const tableArea = document.getElementById('table-result');
    tableArea.innerHTML = `<thead class="table-secondary">
            <tr>
                <th>PAN Number</th>
                <th>Vendor Name</th>
                <th>Type</th>
                <th>Verification Status</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>${extractedpan}</td>
                <td>${fullname}</td>
                <td>${type}</td>
                <td>${result.data.status}</td>
            </tr>
        </tbody> `

    console.log("PAN Verification Result:", result);
  } catch (error) {
    console.error("PAN Verification Error:", error);
  }
});


runButton.addEventListener('click', async function () {
  const iconArea = document.getElementById('iconreplace');
  document.getElementById('iconreplace').innerHTML = `
      <div class="d-flex justify-content-center">
        <div class="spinner-border" role="status">
          <span class="sr-only"></span>
        </div>
      </div>`;

  await analyzeDocument();
  iconArea.innerHTML = `
        <svg width="40" height="40" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.99967 7.00065L6.33301 8.33398L8.99967 5.66732M13.6663 7.00065C13.6663 10.6825 10.6816 13.6673 6.99967 13.6673C3.31778 13.6673 0.333008 10.6825 0.333008 7.00065C0.333008 3.31875 3.31778 0.333984 6.99967 0.333984C10.6816 0.333984 13.6663 3.31875 13.6663 7.00065Z" stroke="#16A34A" stroke-width="0.666667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
});

document.getElementById('pan-upload').addEventListener('change', function () {
  const iconArea = document.getElementById('iconreplace');
  const textArea = document.getElementById('textreplace');
  const DragArea = document.getElementById('drag-drop');

  DragArea.style.display = 'none';
  iconArea.innerHTML = `
        <svg width="40" height="40" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.99967 7.00065L6.33301 8.33398L8.99967 5.66732M13.6663 7.00065C13.6663 10.6825 10.6816 13.6673 6.99967 13.6673C3.31778 13.6673 0.333008 10.6825 0.333008 7.00065C0.333008 3.31875 3.31778 0.333984 6.99967 0.333984C10.6816 0.333984 13.6663 3.31875 13.6663 7.00065Z" stroke="#16A34A" stroke-width="0.666667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
  textArea.innerHTML = `
        <h5 class="text-success">File Selected</h5>
    `;

});

document.getElementById('cheque-upload').addEventListener('change', function () {
  const iconArea = document.getElementById('cheque-icon');
  const textArea = document.getElementById('cheque-text');
  iconArea.innerHTML = `<svg width="30" height="30" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.99967 7.00065L6.33301 8.33398L8.99967 5.66732M13.6663 7.00065C13.6663 10.6825 10.6816 13.6673 6.99967 13.6673C3.31778 13.6673 0.333008 10.6825 0.333008 7.00065C0.333008 3.31875 3.31778 0.333984 6.99967 0.333984C10.6816 0.333984 13.6663 3.31875 13.6663 7.00065Z" stroke="#16A34A" stroke-width="0.666667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        
    `;
  textArea.innerHTML = `
        <p class="text-success">File Selected</p>
    `;

});

document.addEventListener('DOMContentLoaded', () => {
  // Ensure the element exists
  const chequeRunButton = document.getElementById('cheque-run');
  if (!chequeRunButton) {
    console.error("Element with id 'cheque-run' not found.");
    return;
  } else {
    console.log("'cheque-run' button found.");
  }

  // Attach the click event listener
  chequeRunButton.addEventListener('click', () => {
    console.log("Cheque run button clicked.");
    analyzeDocumentCheque(); // Confirm function is being called
  });
});


document.getElementById('pan-upload').addEventListener('click', function () {
  this.value = null; // Reset the file input's value
});

async function nameExtract(text) {
  const endpoint = 'https://jss-azure-open-ai.openai.azure.com/openai/deployments/jss-gpt-35-turbo/chat/completions?api-version=2025-01-01-preview';
  const apiKey = '4eafeaa3a6fc42268aac27bb229b8091';

  const requestBody = {
    messages: [
      { role: "user", content: text }
    ],
    max_tokens: 800,
    temperature: 0.7,
    top_p: 0.95,
    frequency_penalty: 0,
    presence_penalty: 0
  };

  const request = {
    messages: [
      { role: "user", content: 'Extract and return only the PAN holder name from the text. This could be a person or company name.' + text }
    ],

  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Request failed:", errorText);
      return;
    }

    const result = await response.json();
    return result.choices[0].message.content.trim();

  } catch (error) {
    console.error("Error calling API:", error);
  }

}

async function analyzeDocumentCheque() {
  console.log("Analyzing document...")
  const endpoint = "https://rg-docintelligence-centralindia-ai-service.cognitiveservices.azure.com";
  const modelId = "prebuilt-idDocument";
  const apiKey = "2K5gcndv2bf2c6JIISGALlhKpWBnWj1dlUCeHC7RfhrvWrMLYcvFJQQJ99BAACGhslBXJ3w3AAAEACOGjtlD";
  const url = `${endpoint}/documentintelligence/documentModels/${modelId}:analyze?api-version=2024-11-30`;
  const fileInput = document.querySelector('#cheque-upload');
  const file = fileInput.files[0];
  if (!file) {
    console.error("No file selected.");
    return;
  }

  const arrayBuffer = await file.arrayBuffer();

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": file.type || "application/pdf",
      "Ocp-Apim-Subscription-Key": apiKey
    },
    body: arrayBuffer
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Initial request failed:", errorText);
    return;
  }

  const operationLocation = response.headers.get("operation-location");
  let result;
  while (true) {
    const pollResponse = await fetch(operationLocation, {
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey
      }
    });

    result = await pollResponse.json();
    if (result.status === "succeeded" || result.status === "failed") {
      break;
    }
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log("Result:", result);

  
}

async function analyzeDocument() {
  console.log("Analyzing document...");

  const endpoint = "https://rg-docintelligence-centralindia-ai-service.cognitiveservices.azure.com";
  const modelId = "prebuilt-idDocument";
  const apiKey = "2K5gcndv2bf2c6JIISGALlhKpWBnWj1dlUCeHC7RfhrvWrMLYcvFJQQJ99BAACGhslBXJ3w3AAAEACOGjtlD";
  const url = `${endpoint}/documentintelligence/documentModels/${modelId}:analyze?api-version=2024-11-30`;

  const fileInput = document.querySelector('#pan-upload');
  const file = fileInput.files[0];
  if (!file) {
    console.error("No file selected.");
    return;
  }

  const arrayBuffer = await file.arrayBuffer();

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": file.type || "application/pdf",
      "Ocp-Apim-Subscription-Key": apiKey
    },
    body: arrayBuffer
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Initial request failed:", errorText);
    return;
  }

  const operationLocation = response.headers.get("operation-location");

  // Poll for result
  let result;
  while (true) {
    const pollResponse = await fetch(operationLocation, {
      headers: {
        "Ocp-Apim-Subscription-Key": apiKey
      }
    });

    result = await pollResponse.json();
    if (result.status === "succeeded" || result.status === "failed") {
      break;
    }
    await new Promise(r => setTimeout(r, 2000));
  }

  console.log("Result:", result);
  const fullText = result.analyzeResult.content;
  //console.log("Full Text:", fullText);
  const docresult = result.analyzeResult.documents && result.analyzeResult.documents[0];
  const fields = docresult.fields
  extractedpan = fields.DocumentNumber?.valueString;
  const pan = extractedpan
  //console.log('PAN Number',pan);
  const gptresponse = await nameExtract(fullText);
  fullname = gptresponse

  switch (pan[3]) {
    case 'P':
    case 'p': type = "Individual";
      break;
    case 'f':
    case 'F': type = "Firm/LLP";
      break;
    case 'C':
    case 'c': type = "Company";
      break;
    case 'H':
    case 'h': type = "Hindu Undivided Family";
      break;
    case 't':
    case 'T': type = "Trust";
      break;
    case 'A':
    case 'a': type = "Association of Persons";
      break;
    case 'B':
    case 'b': type = "Body of Individuals";
      break;
    case 'L':
    case 'l': type = "Local Authority";
      break;
    case 'J':
    case 'j': type = "Artificial Juridical Person";
      break;
    case 'G':
    case 'g': type = "Government Agency";
      break;
    default: type = "Unknown";
  }

  const tableDiv = document.getElementById('extracted-details');
  const tableBody = tableDiv.querySelector('tbody');
  tableBody.innerHTML = `
    <tr>
        <td style = "font-size:14px;">${pan}</td>
        <td style = "font-size:14px;">${gptresponse || 'N/A'}</td>
        <td style = "font-size:14px;">${type}</td>
    </tr> `;

  const validateButton = document.getElementById('validate');
  validateButton.style.display = 'block';
}

uploadArea.addEventListener('dragover', function (e) {
  e.preventDefault();
  uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', function (e) {
  e.preventDefault();
  uploadArea.classList.remove('dragover');
});

const fileInput = document.getElementById('pan-upload');

uploadArea.addEventListener('drop', function (e) {
  e.preventDefault();
  uploadArea.classList.remove('dragover');

  if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
    fileInput.files = e.dataTransfer.files;
  }

  const iconArea = document.getElementById('iconreplace');
  const textArea = document.getElementById('textreplace');
  const DragArea = document.getElementById('drag-drop');

  DragArea.style.display = 'none';
  iconArea.innerHTML = `
        <svg width="40" height="40" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4.99967 7.00065L6.33301 8.33398L8.99967 5.66732M13.6663 7.00065C13.6663 10.6825 10.6816 13.6673 6.99967 13.6673C3.31778 13.6673 0.333008 10.6825 0.333008 7.00065C0.333008 3.31875 3.31778 0.333984 6.99967 0.333984C10.6816 0.333984 13.6663 3.31875 13.6663 7.00065Z" stroke="#16A34A" stroke-width="0.666667" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    `;
  textArea.innerHTML = `
        <h5 class="text-success">File Selected</h5>
    `;
});

