import pytest

from app.services.body_type import validate_body_type


def test_valid_body_type():
    assert validate_body_type("ectomorph") == "ectomorph"
    assert validate_body_type("MESOMORPH") == "mesomorph"
    assert validate_body_type(" Endomorph ") == "endomorph"


def test_invalid_body_type():
    with pytest.raises(ValueError):
        validate_body_type("unknown")


def test_missing_body_type():
    with pytest.raises(ValueError):
        validate_body_type("")