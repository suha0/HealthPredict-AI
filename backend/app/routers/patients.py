from app.services.ai_service import generate_health_remarks
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Patient
from app.schemas import (
    PatientCreate,
    PatientUpdate,
    PatientResponse
)

router = APIRouter(
    prefix="/api/patients",
    tags=["Patients"]
)


# CREATE PATIENT

# CREATE PATIENT
@router.post("/", response_model=PatientResponse, status_code=201)
async def create_patient(
    patient: PatientCreate,
    db: Session = Depends(get_db)
):
    existing_patient = db.query(Patient).filter(
        Patient.email == patient.email
    ).first()

    if existing_patient:
        raise HTTPException(
            status_code=409,
            detail="A patient with this email already exists"
        )

    new_patient = Patient(
        **patient.model_dump(),
        remarks="AI assessment pending"
    )

    # Generate AI health assessment
    remarks = await generate_health_remarks(new_patient)

    # Save AI-generated remarks
    new_patient.remarks = remarks

    db.add(new_patient)
    db.commit()
    db.refresh(new_patient)

    return new_patient


# READ ALL PATIENTS
@router.get("/", response_model=list[PatientResponse])
def get_patients(db: Session = Depends(get_db)):
    return db.query(Patient).order_by(Patient.id).all()


# READ SINGLE PATIENT
@router.get("/{patient_id}", response_model=PatientResponse)
def get_patient(
    patient_id: int,
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(
        Patient.id == patient_id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    return patient


# UPDATE PATIENT
@router.put("/{patient_id}", response_model=PatientResponse)
def update_patient(
    patient_id: int,
    updated_data: PatientUpdate,
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(
        Patient.id == patient_id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    duplicate = db.query(Patient).filter(
        Patient.email == updated_data.email,
        Patient.id != patient_id
    ).first()

    if duplicate:
        raise HTTPException(
            status_code=409,
            detail="Another patient already uses this email"
        )

    for key, value in updated_data.model_dump().items():
        setattr(patient, key, value)

    db.commit()
    db.refresh(patient)

    return patient


# DELETE PATIENT
@router.delete("/{patient_id}")
def delete_patient(
    patient_id: int,
    db: Session = Depends(get_db)
):
    patient = db.query(Patient).filter(
        Patient.id == patient_id
    ).first()

    if not patient:
        raise HTTPException(
            status_code=404,
            detail="Patient not found"
        )

    db.delete(patient)
    db.commit()

    return {
        "message": "Patient deleted successfully"
    }
