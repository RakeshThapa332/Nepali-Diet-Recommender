SUPPORTED_BODY_TYPES = {
    "ectomorph",
    "mesomorph",
    "endomorph",
}


def validate_body_type(body_type: str) -> str:
    """
    Validate and normalize the user's body type.

    Supported body types:
        - ectomorph
        - mesomorph
        - endomorph

    Returns:
        Normalized body type.
    """

    if not body_type:
        raise ValueError("Body type is required.")

    body_type = body_type.strip().lower()

    if body_type not in SUPPORTED_BODY_TYPES:
        raise ValueError(
            f"Body type must be one of: "
            f"{', '.join(sorted(SUPPORTED_BODY_TYPES))}."
        )

    return body_type