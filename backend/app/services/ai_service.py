
import httpx

from app.config import settings


async def generate_health_remarks(patient):
    """
    Generate preliminary health assessment remarks
    using the Gemini API.
    """

    if not settings.GEMINI_API_KEY:
        return "AI assessment unavailable: API key not configured."

    prompt = f"""
    You are an AI health information assistant.

    Review the following patient blood test values:

    Glucose: {patient.glucose}
    Haemoglobin: {patient.haemoglobin}
    Cholesterol: {patient.cholesterol}

    Provide:
    1. A brief observation of the supplied values.
    2. Any potential health concerns that may warrant
       further medical evaluation.
    3. A recommendation to consult a qualified healthcare
       professional for proper interpretation.

    Important:
    - Do not provide a confirmed medical diagnosis.
    - Do not invent reference ranges.
    - Units and clinical context have not been provided.
    - Keep the response professional and concise.
    """

    headers = {
        "x-goog-api-key": settings.GEMINI_API_KEY,
        "Content-Type": "application/json"
    }

    payload = {
        "contents": [
            {
                "parts": [
                    {"text": prompt}
                ]
            }
        ]
    }

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(
                settings.GEMINI_API_URL,
                headers=headers,
                json=payload
            )

            response.raise_for_status()

            result = response.json()

            remarks = (
                result["candidates"][0]
                ["content"]["parts"][0]["text"]
            )

            return remarks.strip()

    except httpx.HTTPStatusError as error:
        print("Gemini API HTTP error:", error.response.text)
        return "AI assessment temporarily unavailable."

    except (httpx.RequestError, KeyError, IndexError, ValueError) as error:
        print("AI service error:", error)
        return "AI assessment temporarily unavailable."
