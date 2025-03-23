from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline, AutoModelForCausalLM, AutoTokenizer
import torch

app = FastAPI()

# Load BERT emotion analysis model
emotion_model = pipeline("text-classification", model="bhadresh-savani/bert-base-uncased-emotion")

# Load GPT-2 for response generation
model_name = "gpt2"
response_model = AutoModelForCausalLM.from_pretrained(model_name)
tokenizer = AutoTokenizer.from_pretrained(model_name)

class ChatInput(BaseModel):
    message: str

@app.post("/chat")
async def chat_response(input_data: ChatInput):
    user_input = input_data.message

    # Perform emotion analysis
    emotion = emotion_model(user_input)[0]
    emotion_label = emotion["label"]

    # Generate chatbot response
    input_ids = tokenizer.encode(user_input, return_tensors="pt")
    output = response_model.generate(input_ids, max_length=100, pad_token_id=tokenizer.eos_token_id)
    bot_reply = tokenizer.decode(output[:, input_ids.shape[-1]:][0], skip_special_tokens=True)

    return {
        "emotion": emotion_label,
        "response": bot_reply
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
