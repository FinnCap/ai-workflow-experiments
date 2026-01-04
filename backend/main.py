from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from agent.web.agent_router import agent_router
from api.web.api_router import api_router
from chat.web.chat_router import chat_router
from chat.web.message_router import message_router
from flow.web.flow_router import flow_router
from llm_logging.web.log_router import log_router


def create_app():
    load_dotenv()

    app = FastAPI(title="Your API", version="1.0.0")

    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Database setup - now returns DatabaseManager instead of Session

    # Include routers - pass db_manager instead of session
    app.include_router(api_router)
    app.include_router(chat_router)
    app.include_router(log_router)
    app.include_router(message_router)
    app.include_router(agent_router)
    app.include_router(flow_router)

    return app


app = create_app()

if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=7777, reload=True)
