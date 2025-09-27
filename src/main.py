from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",  # frontend dev server
    "http://127.0.0.1:5173", # sometimes vite runs on 127.0.0.1
]

# Allow frontend (React) to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/hello")
def hello_world():
    print("Hello from FastAPI")
    return {"message": "Hello from FastAPI 🚀"}
