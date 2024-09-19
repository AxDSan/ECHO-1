import os
from dotenv import load_dotenv
from openai import OpenAI
from run_ECHO import create_demo_text, answer_cleansing
from utils import decoder_for_gpt3
import random

# Load environment variables
load_dotenv()

# Initialize the client with OpenRouter
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
    default_headers={
        "HTTP-Referer": "https://your-site.com",  # Optional, replace with your site
        "X-Title": "Your App Name"  # Optional, replace with your app name
    }
)

def chat_with_model(messages, args):
    try:
        # Create demo text
        demo = create_demo_text(args, cot_flag=True)
        
        # Prepare the input
        input_text = demo + messages[-1]['content'] + " " + args.cot_trigger
        
        # Get the response
        response = decoder_for_gpt3(args, input_text, args.max_length_cot)
        # print(f"Raw response: {response}")
        
        # Clean the answer
        cleaned_response = answer_cleansing(args, response)
        print(f"Cleaned response: {cleaned_response}")
        
        if cleaned_response:
            return cleaned_response
        else:
            return "I apologize, but I couldn't generate a clear response. Could you please rephrase your question?"
    except Exception as e:
        print(f"An error occurred: {e}")
        return None

def main():
    # Set up ECHO arguments
    class Args:
        pass
    args = Args()
    args.model = "nousresearch/hermes-3-llama-3.1-405b"
    args.dataset = "commonsensqa"  # You can change this based on your needs
    args.demo_path = "demos/commonsensqa_gpt-3.5-turbo-0301_8"  # Update this path
    args.cot_trigger = "Let's approach this step-by-step:"
    args.direct_answer_trigger_for_fewshot = "Therefore, the answer is"
    args.max_length_cot = 4096
    args.temperature = 0.7
    args.api_time_interval = 0.1
    args.method = "auto_cot"  # Add this line
    args.random_seed = 42  # Add this line
    args.max_gpt_token = 4096  # Add this line

    messages = [
        {"role": "system", "content": "You are a helpful assistant."},
    ]
    
    print("Chat with the AI. Type 'quit' to exit.")
    
    while True:
        user_input = input("You: ")
        if user_input.lower() == 'quit':
            break
        
        messages.append({"role": "user", "content": user_input})
        
        response = chat_with_model(messages, args)
        if response:
            print(f"AI: {response}")
            messages.append({"role": "assistant", "content": response})
        else:
            print("An error occurred. Please try again.")

if __name__ == "__main__":
    main()