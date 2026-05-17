from __future__ import annotations

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.deps import get_current_user
from app.models import Family, FamilyMember, User
from app.schemas import FamilyConnectRequest, FamilyCreateRequest, FamilyRead


router = APIRouter(prefix="/family", tags=["family"])


@router.post("", response_model=FamilyRead, status_code=status.HTTP_201_CREATED)
def create_family(
    payload: FamilyCreateRequest,
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
):
    family = Family(name=payload.name)
    db.add(family)
    db.flush()
    db.add(
        FamilyMember(
            family_id=family.id,
            user_id=user.id,
            relationship="보호자" if user.role.value == "guardian" else "부모님",
        )
    )
    db.commit()
    db.refresh(family)
    return family


@router.post("/connect", response_model=FamilyRead, status_code=status.HTTP_201_CREATED)
def connect_family(payload: FamilyConnectRequest, db: Annotated[Session, Depends(get_db)]):
    guardian = db.get(User, payload.guardian_id)
    parent = db.get(User, payload.parent_id)
    if not guardian or not parent:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Guardian or parent user not found.",
        )

    family = Family(name=payload.family_name)
    db.add(family)
    db.flush()
    db.add_all(
        [
            FamilyMember(
                family_id=family.id,
                user_id=guardian.id,
                relationship=payload.guardian_relationship,
            ),
            FamilyMember(
                family_id=family.id,
                user_id=parent.id,
                relationship=payload.parent_relationship,
            ),
        ]
    )
    db.commit()
    db.refresh(family)
    return family


@router.get("/me", response_model=list[FamilyRead])
def read_my_families(user: Annotated[User, Depends(get_current_user)]):
    return [membership.family for membership in user.family_memberships]
