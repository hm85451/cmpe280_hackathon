from flask import Flask, request, jsonify
from dotenv import load_dotenv
from flask_cors import CORS
import logging
import asyncio
import sys
import google.generativeai as genai

from langchain_pinecone import PineconeVectorStore
from langchain_pinecone import PineconeEmbeddings

load_dotenv()

app = Flask(__name__)
CORS(app)



# Initialize Google Generative AI with your API key
genai.configure(api_key="AIzaSyApWdxQQBWBh_dX93oCz5mg_KuwrlT8fh8")

@app.route('/api/chat', methods=['POST'])
async def chat():
    data = request.get_json()
    query = data.get("message")
    
    # retrieve relavent knowledge from vector database using user question
    index_name = "cmpe280"
    pinecone_api_key="9cb7db86-a723-40e2-ad3b-5a3ef1e4b74a"
    embeddings = PineconeEmbeddings(model='multilingual-e5-large', pinecone_api_key=pinecone_api_key)
    vectorstore = PineconeVectorStore(index_name=index_name, embedding=embeddings)
    res = vectorstore.similarity_search(query, namespace="soft-2023")

     # transform vector database output into a context string
    retrieved_data = "\n".join([result.page_content for result in res])
    
    # Generate response using Google Generative AI with question and context string
    genai.configure(api_key="AIzaSyApWdxQQBWBh_dX93oCz5mg_KuwrlT8fh8")
    model = genai.GenerativeModel(model_name="gemini-1.5-flash")
    prompt = f"Based on the following knowledge context:\n{retrieved_data}\n\nProvide a response to answer this question: {query}"
    
    print(prompt, file=sys.stderr)
    response = model.generate_content(prompt)
    
    return jsonify({"reply": response.text})

if __name__ == "__main__":
    app.run(port=5050)
