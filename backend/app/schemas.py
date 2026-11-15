
from datetime import date
from pydantic import BaseModel, EmailStr, Field, ConfigDict, field_validator


class PatientCreate(BaseModel):
    full_name: str = Field(min_length=2, max_length=100)
    date_of_birth: date
    email: EmailStr

    glucose: float = Field(gt=0)
    haemoglobin: float = Field(gt=0)
    cholesterol: float = Field(gt=0)

    @field_validator("full_name")
    @classmethod
    def validate_name(cls, value):
        value = value.strip()

        if not value:
            raise ValueError("Full name cannot be empty")

        return value

    @field_validator("date_of_birth")
    @classmethod
    def validate_dob(cls, value):
        if value > date.today():
            raise ValueError("Date of birth cannot be in the future")

        return value


class PatientUpdate(PatientCreate):
    pass


class PatientResponse(PatientCreate):
    id: int
    remarks: str | None = None

    model_config = ConfigDict(from_attributes=True)
