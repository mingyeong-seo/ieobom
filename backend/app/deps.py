from __future__ import annotations

from typing import Annotated

from fastapi import Depends, Header, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from app.core.config import get_settings
from app.core.security import decode_access_token
from app.db.session import get_db
from app.models import User, UserRole


bearer_scheme = HTTPBearer(auto_error=False)


def get_current_user(
    db: Annotated[Session, Depends(get_db)],
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
    x_demo_role: Annotated[str | None, Header(alias="X-Demo-Role")] = None,
) -> User:
    settings = get_settings()

    if credentials:
        payload = decode_access_token(credentials.credentials)
        if not payload or not payload.get("sub"):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid authentication token.",
            )
        user = db.get(User, int(payload["sub"]))
        if user and user.is_active:
            return user

    if settings.demo_mode:
        role = UserRole.parent if x_demo_role == UserRole.parent else UserRole.guardian
        user = db.query(User).filter(User.role == role).order_by(User.id.asc()).first()
        if user:
            return user

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Authentication required.",
    )


def require_role(*roles: UserRole):
    def dependency(user: Annotated[User, Depends(get_current_user)]) -> User:
        if user.role not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="This role cannot access the requested resource.",
            )
        return user

    return dependency
