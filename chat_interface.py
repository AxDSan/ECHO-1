import os
from dotenv import load_dotenv
from openai import OpenAI
from run_ECHO import create_demo_text, answer_cleansing
from utils import decoder_for_gpt3
import random
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
import asyncio
from types import SimpleNamespace
from fastapi.responses import StreamingResponse
import json

# Load environment variables
load_dotenv()

# Initialize the client with OpenRouter
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    default_headers={
        "X-Title": "SelfHarmonizingCoT"
    }
)

app = FastAPI(title="AI Chat Interface")

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    args: Dict[str, Any]

class ChatResponse(BaseModel):
    full_response: str
    cleaned_response: str

async def chat_with_model(messages, args):
    try:
        args_obj = SimpleNamespace(**args)
        demo = create_demo_text(args_obj, cot_flag=True)
        
        print("All messages received:")
        for msg in messages:
            print(f"Role: {msg.role}, Content: {msg.content}")
        
        last_user_message = next((msg.content for msg in reversed(messages) if msg.role == "user"), "")
        print(f"Last user message: {last_user_message}")
        
        input_text = demo + last_user_message
        print(f"Demo text: {demo}")
        print(f"Full input text: {input_text}")

        yield json.dumps({"progress": "Analyzing the question..."})
        await asyncio.sleep(1)
        yield json.dumps({"progress": "Retrieving relevant information..."})
        await asyncio.sleep(1)
        yield json.dumps({"progress": "Formulating step-by-step reasoning..."})
        await asyncio.sleep(1)

        response = decoder_for_gpt3(args_obj, input_text, args.get("max_length_cot", 4096))
        print(f"Raw response: {response}")
        
        cleaned_response = answer_cleansing(args_obj, response)
        print(f"Cleaned response: {cleaned_response}")

        yield json.dumps({"full_response": response, "cleaned_response": cleaned_response})
    except Exception as e:
        print(f"An error occurred: {e}")
        yield json.dumps({"error": str(e)})

@app.post("/chat")
async def chat_endpoint(chat_request: ChatRequest):
    print("Received chat request:")
    print(f"Messages: {chat_request.messages}")
    print(f"Args: {chat_request.args}")
    return StreamingResponse(chat_with_model(chat_request.messages, chat_request.args), media_type="application/json")

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Chat Interface API. Use the /chat endpoint to interact."}