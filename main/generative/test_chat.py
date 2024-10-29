from services.document_handler import DocumentService  
from services.text_handler import SummaryService
from services.text_handler import ChatService 
from services.config import ChatConfig  
import os
import google.generativeai as genai

genai.configure(api_key=os.environ.get('GEMINI_API_KEY'))


generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 64,
  "max_output_tokens": 8192,
  "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
  model_name="gemini-1.5-flash",
  generation_config=generation_config
)

document_service = DocumentService(model=model)
chat_service = ChatService(model=model)

with open("test.pdf", "rb") as f:
    pdf_bytes = f.read()

pdf_text = document_service.execute(pdf_bytes, file_path="test.pdf")

context = pdf_text  
while True:
    question = input("Ask a question based on the PDF content (type 'exit' to quit): ")
    if question.lower() == 'exit':
        break

    answer = chat_service.chat(context, question)
    print("Answer:", answer)

