import os
from datetime import datetime
from flask import Blueprint, current_app, request, jsonify
from werkzeug.utils import secure_filename
from sqlalchemy import select, func, delete, text
from .models import Post, Comment, Reaction, RSVP
from openai import OpenAI



api_bp = Blueprint('api', __name__)
@api_bp.route('/db-check', methods=['GET'])

@api_bp.route('/db-check', methods=['GET'])
def db_check():
    session = get_session()
    try:
        # Run a simple query to check DB connection
        session.execute(text('SELECT 1'))
        return jsonify({"database": "connected"}), 200
    except Exception as e:
        return jsonify({"database": "error", "details": str(e)}), 500


def get_session():
    return current_app.session_factory()


@api_bp.route('/health', methods=['GET'])
def health():
    return jsonify({"status": "ok", "time": datetime.utcnow().isoformat()})


# Posts
@api_bp.route('/posts', methods=['GET'])
def list_posts():
    session = get_session()
    posts = session.execute(select(Post).order_by(Post.id.desc())).scalars().all()
    return jsonify([serialize_post(p) for p in posts])


@api_bp.route('/posts', methods=['POST'])
def create_post():
    session = get_session()
    data = request.json or {}
    post = Post(
        type=data.get('type', 'event'),
        title=data.get('title', 'New Post'),
        description=data.get('description', ''),
        author_session=data.get('authorSession'),
        timestamp=datetime.utcnow(),
        location=data.get('location'),
        date=data.get('date'),
        time=data.get('time'),
        department=data.get('department'),
        item_type=data.get('itemType'),
        item_name=data.get('itemName'),
        image_url=data.get('imageUrl'),
        attachment_url=data.get('attachmentUrl'),
    )
    session.add(post)
    session.commit()
    return jsonify(serialize_post(post)), 201


@api_bp.route('/posts/<int:post_id>', methods=['DELETE'])
def delete_post(post_id: int):
    session = get_session()
    session.execute(delete(Post).where(Post.id == post_id))
    session.commit()
    return '', 204


# Comments
@api_bp.route('/posts/<int:post_id>/comments', methods=['POST'])
def add_comment(post_id: int):
    session = get_session()
    data = request.json or {}
    c = Comment(
        post_id=post_id,
        parent_comment_id=data.get('parentCommentId'),
        content=data.get('content', ''),
        author_session=data.get('authorSession'),
    )
    session.add(c)
    session.commit()
    return jsonify(serialize_comment(c)), 201


@api_bp.route('/comments/<int:comment_id>', methods=['DELETE'])
def remove_comment(comment_id: int):
    session = get_session()
    session.execute(delete(Comment).where(Comment.id == comment_id))
    session.commit()
    return '', 204


# Reactions
@api_bp.route('/reactions', methods=['POST'])
def toggle_reaction():
    session = get_session()
    data = request.json or {}
    target_type = data.get('targetType')  # post | comment
    target_id = data.get('targetId')
    reaction_type = data.get('reactionType')
    user_session = data.get('userSession')

    # If exists, remove; else add
    existing = session.execute(
        select(Reaction).where(
            Reaction.target_type == target_type,
            Reaction.target_id == target_id,
            Reaction.reaction_type == reaction_type,
            Reaction.user_session == user_session,
        )
    ).scalars().first()

    if existing:
        session.delete(existing)
        session.commit()
        return jsonify({"toggled": False})
    else:
        r = Reaction(
            target_type=target_type,
            target_id=target_id,
            reaction_type=reaction_type,
            user_session=user_session,
        )
        session.add(r)
        session.commit()
        return jsonify({"toggled": True})


# RSVP
@api_bp.route('/events/<int:post_id>/rsvp', methods=['POST'])
def rsvp(post_id: int):
    session = get_session()
    data = request.json or {}
    user_session = data.get('userSession')
    response_type = data.get('responseType')  # going | interested | not_going

    # remove existing
    session.execute(
        delete(RSVP).where(RSVP.post_id == post_id, RSVP.user_session == user_session)
    )
    # add if not clearing
    if response_type:
        session.add(RSVP(post_id=post_id, user_session=user_session, response_type=response_type))
    session.commit()

    # return counts
    counts = session.execute(
        select(RSVP.response_type, func.count(RSVP.id)).where(RSVP.post_id == post_id).group_by(RSVP.response_type)
    ).all()
    return jsonify({r: c for r, c in counts})


# Uploads
ALLOWED_EXT = {"png", "jpg", "jpeg", "gif", "pdf"}


def allowed_file(filename: str) -> bool:
    return "." in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXT


@api_bp.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if not allowed_file(file.filename):
        return jsonify({"error": "Unsupported file type"}), 400

    os.makedirs(current_app.config['UPLOAD_FOLDER'], exist_ok=True)
    filename = secure_filename(file.filename)
    path = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
    file.save(path)
    return jsonify({"url": f"/uploads/{filename}"}), 201


# AI Classification
@api_bp.route('/classify-post', methods=['POST'])
def classify_post():
    data = request.json or {}
    text = data.get('text', '')
    if not current_app.config['OPENAI_API_KEY']:
        from ..app.utils import basic_classify  # type: ignore
        return jsonify(basic_classify(text))

    try:
        client = OpenAI(api_key=current_app.config['OPENAI_API_KEY'])
    except Exception:
        from ..app.utils import basic_classify  # type: ignore
        return jsonify(basic_classify(text))
    prompt = (
        "You are a campus feed assistant. Classify the user's text as one of: 'event', 'lost_found', 'announcement'. "
        "Extract structured fields (title, description, location, date, time, department, itemType, itemName). "
        "Return strict JSON with keys: type, confidence (0-1), extractedData (object)."
    )

    try:
        completion = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": text},
        ],
        temperature=0.2,
        )

        content = completion.choices[0].message.content or '{}'
        import json
        result = json.loads(content)
        return jsonify(result)
    except Exception:
        from ..app.utils import basic_classify  # type: ignore
        return jsonify(basic_classify(text))


# Serializers

def serialize_post(p: Post) -> dict:
    return {
        "id": p.id,
        "type": p.type,
        "title": p.title,
        "description": p.description,
        "authorSession": p.author_session,
        "timestamp": p.timestamp.isoformat(),
        "location": p.location,
        "date": p.date,
        "time": p.time,
        "department": p.department,
        "itemType": p.item_type,
        "itemName": p.item_name,
        "imageUrl": p.image_url,
        "attachmentUrl": p.attachment_url,
    }


def serialize_comment(c: Comment) -> dict:
    return {
        "id": c.id,
        "postId": c.post_id,
        "parentCommentId": c.parent_comment_id,
        "content": c.content,
        "authorSession": c.author_session,
        "timestamp": c.timestamp.isoformat(),
    }
