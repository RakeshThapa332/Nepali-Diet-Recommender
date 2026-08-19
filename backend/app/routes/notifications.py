from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity

from app.models import Notification

from app.extensions import db

notifications_bp = Blueprint(
    "notifications",
    __name__,
    url_prefix="/api/notifications"
)


@notifications_bp.route("/", methods=["GET"])
@jwt_required()
def get_notifications():

    user_id = int(get_jwt_identity())
    page = max(request.args.get("page", 1, type=int), 1)
    per_page = min(max(request.args.get("per_page", 20, type=int), 1), 100)

    pagination = (
        Notification.query
        .filter_by(user_id=user_id)
        .order_by(Notification.created_at.desc())
        .paginate(page=page, per_page=per_page, error_out=False)
    )

    return jsonify({
        "success": True,
        "notifications": [
            {
                "id": notification.id,
                "title": notification.title,
                "message": notification.message,
                "notification_type": notification.notification_type,
                "is_read": notification.is_read,
                "created_at": (
                    notification.created_at.isoformat()
                    if notification.created_at
                    else None
                ),
            }
            for notification in pagination.items
        ],
        "pagination": {
            "page": pagination.page,
            "per_page": pagination.per_page,
            "total": pagination.total,
            "pages": pagination.pages,
        },
    }), 200

#add mark as read
@notifications_bp.route("/<int:notification_id>/read", methods=["PUT"])
@jwt_required()
def mark_notification_as_read(notification_id):

    user_id = int(get_jwt_identity())

    notification = Notification.query.filter_by(
        id=notification_id,
        user_id=user_id
    ).first()

    if not notification:
        return jsonify({
            "success": False,
            "message": "Notification not found."
        }), 404

    notification.is_read = True

    db.session.commit()

    return jsonify({
        "success": True,
        "message": "Notification marked as read."
    }), 200