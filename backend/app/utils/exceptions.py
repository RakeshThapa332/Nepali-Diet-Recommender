"""
Custom exception class with file/line context for easier debugging.

Usage:
    from app.utils.exceptions import DietRecommendationException
    import sys

    try:
        ...
    except Exception as e:
        raise DietRecommendationException(e, sys) from e
"""

import sys


def error_message_detail(error, error_detail: sys):
    _, _, exc_tb = error_detail.exc_info()
    file_name = exc_tb.tb_frame.f_code.co_filename
    line_number = exc_tb.tb_lineno
    return (
        f"Error occurred in python script [{file_name}] "
        f"at line number [{line_number}]: {str(error)}"
    )


class DietRecommendationException(Exception):
    def __init__(self, error_message, error_detail: sys):
        super().__init__(error_message)
        self.error_message = error_message_detail(error_message, error_detail)

    def __str__(self):
        return self.error_message
