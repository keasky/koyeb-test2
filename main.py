
from fastapi import FastAPI, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from google import genai
from fastapi.middleware.cors import CORSMiddleware
import dotenv 
import os

from fastapi.templating import Jinja2Templates

dotenv.load_dotenv()
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# テンプレートのディレクトリを指定
app.mount(path="/static", app=StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")


def gemini(message):
    response = client.models.generate_content(
        model="gemini-2.0-flash", contents=message,
    )
    return response.text

@app.get("/gemini/{message}")
def read_item(message: str):
    return gemini(message)

@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})
