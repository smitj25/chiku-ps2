import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()

api_key = os.getenv("GROQ_API_KEY")
print(f"Key loaded: {'Yes' if api_key else 'No'} (starts with: {api_key[:5] if api_key else 'N/A'})")

try:
    client = Groq(api_key=api_key)
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": "Say 'hello world'",
            }
        ],
        model="llama-3.3-70b-versatile",
    )
    print("Success:", chat_completion.choices[0].message.content)
except Exception as e:
    print("Error:", e)
