from fastapi import FastAPI, Form, Request
from fastapi.responses import  FileResponse
from fastapi.staticfiles import StaticFiles
import uvicorn
import serpapi


# -------------------------------------------------------------------------
# How to setup
"""
- To setup environment type:
python -m venv .venv
.venv\scripts\activate

- To install requirements type:
pip install -r requirements.txt

- To start server type:
uvicorn main:app --reload

goto:
http://localhost:8000/


- To stop server
CRTL + C
"""
# -------------------------------------------------------------------------

app = FastAPI()
app.mount("/img", StaticFiles(directory="img"), name="img")

# SETUP HTML FILES
@app.get("/")
async def read_index():
    return FileResponse('index.html')
@app.get("/index.html")
async def read_index():
    return FileResponse('index.html')
@app.get("/item.html")
async def read_index():
    return FileResponse('item.html')
@app.get("/gui.css")
async def read_index():
    return FileResponse('gui.css')
@app.get("/shopping.js")
async def read_index():
    return FileResponse('shopping.js')

# temporary search results
@app.get("/testSearch.js")
async def read_index():
    return FileResponse('testSearch.js')

# -------------------------------------------------------------------------
# sample endpoint
@app.get("/api/search/{search}")
def apisearch(search: str):
    client = serpapi.Client(api_key="bb2f5d955df05dabbf7e142e6cb7cd716b36450aa4ed3c5c73014bb23a84f1ca")
    results = client.search({
        "engine": "google_shopping_light",
        "q": search
    })
    shopping_results = results["shopping_results"]

    return shopping_results

if __name__ == '__main__':
    uvicorn.run('main:app', host='0.0.0.0', port=8000)