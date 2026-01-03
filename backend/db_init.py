from sqlalchemy import create_engine
from sqlalchemy.orm import Session
from models import Base, Booking

DB_PATH = 'sqlite:///db.sqlite'

def seed_db():
    engine = create_engine(DB_PATH, echo=False, future=True)
    Base.metadata.create_all(engine)
    with Session(engine) as session:
        first = session.query(Booking).first()
        if first:
            print('DB ya inicializada (bookings existe).')
            return
        print('DB creada (vacía).')

if __name__ == '__main__':
    seed_db()
