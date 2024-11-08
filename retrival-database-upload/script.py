from dotenv import load_dotenv
import fitz  # PyMuPDF
import tiktoken
import os
from pinecone import Pinecone
import time


load_dotenv()

import PyPDF2

def extract_text_pypdf2(pdf_path):
    with open(pdf_path, "rb") as file:
        reader = PyPDF2.PdfReader(file)
        #text = ""
        textList = []
        for page in reader.pages:
            #text += page.extract_text()
            textList.append(page.extract_text())
    return textList


text = extract_text_pypdf2("SOFI-2023.pdf")


    



from langchain_text_splitters import RecursiveCharacterTextSplitter
text_splitter = RecursiveCharacterTextSplitter(separators = ["\n",","," "], chunk_size=1000, chunk_overlap=0)
docs = text_splitter.create_documents(texts = text)

    
index_name = "cmpe280"
# pc = Pinecone(api_key="9cb7db86-a723-40e2-ad3b-5a3ef1e4b74a")

from langchain_pinecone import PineconeEmbeddings
import os
model_name = 'multilingual-e5-large'
embeddings = PineconeEmbeddings(
    model=model_name,
    pinecone_api_key="9cb7db86-a723-40e2-ad3b-5a3ef1e4b74a"
)

from langchain_pinecone import PineconeVectorStore

namespace = "soft-2023"
docsearch = PineconeVectorStore.from_documents(
    documents=docs,
    index_name=index_name,
    embedding=embeddings,
    namespace=namespace
)
time.sleep(5)

# See how many vectors have been upserted
print("Index after upsert:")
print(pc.Index(index_name).describe_index_stats())
print("\n")
time.sleep(2)

from langchain_pinecone import PineconeVectorStore
vectorstore = PineconeVectorStore(index_name=index_name, embedding=embeddings)

query = "What is dietary diversity?"
res = vectorstore.similarity_search(query, namespace="soft-2023")
retrieved_data = "\n".join([result.page_content for result in res])
# print(retrieved_data)


