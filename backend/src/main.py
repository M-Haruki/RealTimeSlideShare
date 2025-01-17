from fastapi import FastAPI

app = FastAPI()


@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/{presentation_id}/title")
@app.get("/{presentation_id}/page")
@app.get("/{presentation_id}/go?{num}")
@app.get("/{presentation_id}/slide")