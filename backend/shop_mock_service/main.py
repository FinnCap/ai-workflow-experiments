from datetime import datetime
from typing import List

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

app = FastAPI(title="Simple Shop Service", version="1.0.0")


# Data models
class Article(BaseModel):
    id: int
    name: str
    price: float


class Order(BaseModel):
    id: int
    person_id: int
    article_id: int
    quantity: int
    total_price: float
    order_date: datetime


class OrderCreate(BaseModel):
    person_id: int
    article_id: int
    quantity: int


# Mock data
articles_db = [
    Article(id=1, name="Laptop", price=999.99),
    Article(id=2, name="Mouse", price=29.99),
    Article(id=3, name="Keyboard", price=79.99),
    Article(id=4, name="Monitor", price=299.99),
    Article(id=5, name="Headphones", price=149.99),
]

orders_db = [
    Order(
        id=1,
        person_id=1,
        article_id=1,
        quantity=1,
        total_price=999.99,
        order_date=datetime.now(),
    ),
    Order(
        id=2,
        person_id=1,
        article_id=2,
        quantity=2,
        total_price=59.98,
        order_date=datetime.now(),
    ),
    Order(
        id=3,
        person_id=2,
        article_id=3,
        quantity=1,
        total_price=79.99,
        order_date=datetime.now(),
    ),
]


# Routes
@app.get("/")
def read_root():
    return {"message": "Welcome to the Simple Shop Service"}


@app.get("/articles", response_model=List[Article])
def get_articles():
    """Get all available articles"""
    return articles_db


@app.get("/articles/{article_id}", response_model=Article)
def get_article(article_id: int):
    """Get a specific article by ID"""
    for article in articles_db:
        if article.id == article_id:
            return article
    raise HTTPException(status_code=404, detail="Article not found")


@app.get("/orders/{person_id}", response_model=List[Order])
def get_orders_for_person(person_id: int):
    """Get all orders for a specific person"""
    person_orders = [order for order in orders_db if order.person_id == person_id]
    if not person_orders:
        raise HTTPException(status_code=404, detail="No orders found for this person")
    return person_orders


@app.get("/orders", response_model=List[Order])
def get_all_orders():
    """Get all orders"""
    return orders_db


@app.post("/orders", response_model=Order)
def create_order(order: OrderCreate):
    """Create a new order"""
    # Find the article to get its price
    article = None
    for a in articles_db:
        if a.id == order.article_id:
            article = a
            break

    if not article:
        raise HTTPException(status_code=404, detail="Article not found")

    # Create new order
    new_order = Order(
        id=len(orders_db) + 1,
        person_id=order.person_id,
        article_id=order.article_id,
        quantity=order.quantity,
        total_price=article.price * order.quantity,
        order_date=datetime.now(),
    )

    orders_db.append(new_order)
    return new_order


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
