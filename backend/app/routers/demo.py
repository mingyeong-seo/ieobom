from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.db.session import get_db
from app.schemas import DemoBootstrapResponse
from app.seed import get_demo_bootstrap, seed_demo_data


router = APIRouter(prefix="/demo", tags=["demo"])


@router.get("/bootstrap", response_model=DemoBootstrapResponse)
def bootstrap(db: Annotated[Session, Depends(get_db)]):
    if get_settings().seed_demo_data:
        seed_demo_data(db)
    return get_demo_bootstrap(db)
