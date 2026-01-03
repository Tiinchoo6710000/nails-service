from sqlalchemy import Column, Integer, String, Boolean, DateTime
from sqlalchemy.orm import declarative_base
import datetime

Base = declarative_base()

class Booking(Base):
    __tablename__ = 'bookings'
    id = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String, nullable=False)
    telefono = Column(String, nullable=True)
    email = Column(String, nullable=True)
    servicio = Column(String, nullable=False)
    fecha = Column(String, nullable=False)  # YYYY-MM-DD
    hora = Column(String, nullable=False)   # HH:MM
    deposit_paid = Column(Boolean, default=False)
    deposit_amount = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'nombre': self.nombre,
            'telefono': self.telefono,
            'email': self.email,
            'servicio': self.servicio,
            'fecha': self.fecha,
            'hora': self.hora,
            'deposit_paid': self.deposit_paid,
            'deposit_amount': self.deposit_amount,
            'created_at': self.created_at.isoformat()
        }
