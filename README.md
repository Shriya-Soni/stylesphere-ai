# stylesphere-ai
Personal Shopping assistant tool that uses colour theory to help you come up with the perfect look for any occassion!


**Layer 1 : DATA INTEGRATION AND USER PROFILING**

This is the part where the app gets to know the user! Think of this as an API server that accepts images + user data, sends them to an AI model, and stores structured results in a SQL database. Used to send text and images to Gemini and get AI responses for Color Analysis.
Converts image bytes → base64 strings since Gemini requires images to be base64-encoded.
