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

def chat_with_model(messages, args):
    try:
        # Convert args dictionary to an object with attributes
        args_obj = SimpleNamespace(**args)
        
        # Create demo text
        demo = create_demo_text(args_obj, cot_flag=True)
        
        # Get the last user message
        last_user_message = next((msg.content for msg in reversed(messages) if msg.role == "user"), "")
        
        # Prepare the input
        input_text = demo + last_user_message + " " + args.get("cot_trigger", "")
        
        # Get the response
        response = decoder_for_gpt3(args_obj, input_text, args.get("max_length_cot", 4096))
        # print(f"Raw response: {response}")
        
        # Clean the answer
        cleaned_response = answer_cleansing(args_obj, response)
        # print(f"Cleaned response: {cleaned_response}")
        
        # Return both the full response and the cleaned response
        return {
            "full_response": response,
            "cleaned_response": cleaned_response
        }
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(chat_request: ChatRequest):
    loop = asyncio.get_event_loop()
    response = await loop.run_in_executor(None, chat_with_model, chat_request.messages, chat_request.args)
    if response:
        return ChatResponse(
            full_response=response["full_response"],
            cleaned_response=response["cleaned_response"]
        )
    else:
        raise HTTPException(status_code=500, detail="An error occurred while processing the request.")

@app.get("/")
def read_root():
    return {"message": "Welcome to the AI Chat Interface API. Use the /chat endpoint to interact."}