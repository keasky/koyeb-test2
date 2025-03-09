
from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from google import genai
from fastapi.middleware.cors import CORSMiddleware
import os

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def gemini(message):
    response = client.models.generate_content(
        model="gemini-2.0-flash", contents=message,
    )
    return response.text
@app.get("/")
def read_root():
    # return {"message": "Hello, FastAPI!"}
    # リクエスト形式を指定してハローワールドと書いたHTMLを返す　
    return HTMLResponse(content="<h1>Hello, FastAPI!</h1>", status_code=200)

@app.get("/gemini/{message}")
def read_item(message: str):
    return gemini(message)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
