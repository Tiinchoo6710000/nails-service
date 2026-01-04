from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from models import Base, Booking
import os
import datetime
from functools import wraps
import base64

DB_PATH = 'sqlite:///db.sqlite'
DEPOSIT_AMOUNT = 2000  # pesos — seña
OPEN_HOUR = 9
CLOSE_HOUR = 18  # exclusive
SLOT_MINUTES = 180

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

engine = create_engine(DB_PATH, echo=False, future=True)
Base.metadata.create_all(engine)

# Static images folder (optional)
IMAGES_DIR = os.path.join(os.path.dirname(__file__), 'static', 'images')
os.makedirs(IMAGES_DIR, exist_ok=True)

# --- Basic auth minimal
# Valores por defecto cambiados según solicitud (pueden seguirse sobreescribiendo con variables de entorno)
ADMIN_USER = os.environ.get('ADMIN_USER', 'oriana')
ADMIN_PASS = os.environ.get('ADMIN_PASS', 'oriana321')

def check_basic_auth(auth_header):
    if not auth_header:
        return False
    try:
        scheme, creds = auth_header.split(None, 1)
        if scheme.lower() != 'basic':
            return False
        decoded = base64.b64decode(creds).decode('utf-8')
        user, pwd = decoded.split(':', 1)
        return user == ADMIN_USER and pwd == ADMIN_PASS
    except Exception:
        return False

def admin_required(f):
    @wraps(f)
    def wrapper(*args, **kwargs):
        auth = request.headers.get('Authorization')
        if not check_basic_auth(auth):
            return jsonify({'error': 'Unauthorized'}), 401, {'WWW-Authenticate': 'Basic realm="Admin Area"'}
        return f(*args, **kwargs)
    return wrapper

@app.route('/')
def home():
    return jsonify({'message': ' service API'}), 200

@app.route('/availability', methods=['GET'])
def availability():
    """Return availability for next N days.
    Query params: start (YYYY-MM-DD), days (int)
    """
    start = request.args.get('start')
    days = int(request.args.get('days', 14))
    if start:
        try:
            start_date = datetime.date.fromisoformat(start)
        except Exception:
            return jsonify({'error': 'start must be YYYY-MM-DD'}), 400
    else:
        start_date = datetime.date.today()

    out = []
    with Session(engine) as session:
        for d in range(days):
            day = start_date + datetime.timedelta(days=d)
            day_str = day.isoformat()
            slots = []
            for h in range(OPEN_HOUR, CLOSE_HOUR):
                time_str = f"{h:02d}:00"
                exists = session.query(Booking).filter(Booking.fecha == day_str, Booking.hora == time_str).first()
                slots.append({'time': time_str, 'available': exists is None})
            out.append({'date': day_str, 'slots': slots})
    return jsonify(out), 200

@app.route('/bookings', methods=['POST'])
def create_booking():
    data = request.get_json() or {}
    nombre = data.get('nombre')
    servicio = data.get('servicio')
    fecha = data.get('fecha')
    hora = data.get('hora')
    telefono = data.get('telefono')
    email = data.get('email')
    deposit_paid = bool(data.get('deposit_paid', False))

    if not (nombre and servicio and fecha and hora):
        return jsonify({'success': False, 'error': 'Campos incompletos'}), 400

    if not deposit_paid:
        return jsonify({'success': False, 'error': 'Se requiere seña de $2000 (deposit_paid false)'}), 402

    with Session(engine) as session:
        exists = session.query(Booking).filter(Booking.fecha == fecha, Booking.hora == hora).first()
        if exists:
            return jsonify({'success': False, 'error': 'Slot ya reservado'}), 409

        b = Booking(
            nombre=nombre,
            telefono=telefono,
            email=email,
            servicio=servicio,
            fecha=fecha,
            hora=hora,
            deposit_paid=True,
            deposit_amount=DEPOSIT_AMOUNT
        )
        session.add(b)
        session.commit()
        return jsonify({'success': True, 'booking': b.to_dict()}), 201

@app.route('/bookings', methods=['GET'])
def list_bookings():
    with Session(engine) as session:
        bs = session.query(Booking).order_by(Booking.created_at.desc()).all()
        return jsonify([b.to_dict() for b in bs]), 200

@app.route('/works', methods=['GET'])
def works():
    items = [
        {'id': 1, 'title': 'Manicura Gel', 'description': 'Uñas con gel y diseño minimal.', 'image': None},
        {'id': 2, 'title': 'Esmaltado Permanente', 'description': 'Duración 3 semanas.', 'image': None},
    ]
    return jsonify(items), 200

@app.route('/images/<path:filename>')
def serve_image(filename):
    return send_from_directory(IMAGES_DIR, filename)

# --- Admin endpoints
@app.route('/admin/bookings', methods=['GET'])
@admin_required
def admin_list_bookings():
    with Session(engine) as session:
        bs = session.query(Booking).order_by(Booking.created_at.desc()).all()
        return jsonify([b.to_dict() for b in bs]), 200

@app.route('/admin/bookings/<int:booking_id>', methods=['DELETE'])
@admin_required
def admin_delete_booking(booking_id):
    with Session(engine) as session:
        b = session.get(Booking, booking_id)
        if not b:
            return jsonify({'success': False, 'error': 'Booking no encontrado'}), 404
        session.delete(b)
        session.commit()
        return jsonify({'success': True}), 200

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
