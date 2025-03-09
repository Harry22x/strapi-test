from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from config import db, bcrypt
from sqlalchemy.orm import validates




class User(db.Model, SerializerMixin):
    __tablename__ = 'users'
    
    serialize_rules = ('-user_tickets.user','-user_events,user')

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    role = db.Column(db.String)
    _password_hash = db.Column(db.String, nullable=False)

    user_tickets = db.relationship(
        'UserTicket', back_populates='user', cascade='all, delete-orphan'
    )
    user_events = db.relationship(
        'UserEvent', back_populates = 'user', cascade = 'all, delete-orphan'
    )

    @hybrid_property
    def password_hash(self):
        raise AttributeError("Password hash cannot be accessed")

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(password.encode('utf-8'))
        self._password_hash = password_hash.decode("utf-8")

    def authenticate(self, password):
        return bcrypt.check_password_hash(self._password_hash, password.encode('utf-8'))

    @validates('username')
    def validate_username(self, key, username):
        if not username:
            raise ValueError("Username cannot be empty.")
        if User.query.filter(User.username == username).first():
            raise ValueError(f" Account with Username '{username}' already exists .")
        return username

    @validates('email')
    def validate_email(self, key, email):
        if not email :
            raise ValueError("Invalid email address.")
        if User.query.filter(User.email == email).first():
            raise ValueError(f"Account with Email '{email}' already exists.")
        return email

class UserTicket(db.Model, SerializerMixin):
    __tablename__ = 'user_tickets'
    
    serialize_rules = ('-user.user_tickets', '-event_ticket.user_tickets',)

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    event_ticket_id = db.Column(db.Integer, db.ForeignKey('event_tickets.id'), nullable=False)
    purchase_date = db.Column(db.DateTime, server_default=db.func.now())
    ticket_quantity = db.Column(db.Integer, nullable=False)
    ticket_code = db.Column(db.String, unique=True, nullable=False)

    user = db.relationship('User', back_populates='user_tickets')
    event_ticket = db.relationship('EventTicket', back_populates='user_tickets')

    @validates('ticket_quantity')
    def validate_quantity(self, key, quantity):
        if not isinstance(quantity, int) or quantity <= 0:
            raise ValueError("Ticket quantity must be a positive integer")
        return quantity

class EventTicket(db.Model, SerializerMixin):
    __tablename__ = 'event_tickets'
    
    serialize_rules = ('-user_tickets.event_ticket', '-event.event_tickets',)

    id = db.Column(db.Integer, primary_key=True)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    ticket_type = db.Column(db.String, nullable=False)
    price = db.Column(db.Numeric(10, 2), nullable=False) 
    available_quantity = db.Column(db.Integer, nullable=False)
    sale_end_date = db.Column(db.DateTime, nullable=False)

    user_tickets = db.relationship(
        'UserTicket', back_populates='event_ticket', cascade='all, delete-orphan'
    )
    event = db.relationship('Event', back_populates='event_tickets')

    @validates('price')
    def validate_price(self, key, price):
        if not isinstance(price, int) or price < 0:
            raise ValueError("Price must be a positive integer.")
        return price

    @validates('available_quantity')
    def validate_quantities(self, key, quantity):
        if not isinstance(quantity, int) or quantity < 0:
            raise ValueError(f"{key} must be a non-negative integer")
        return quantity

class Event(db.Model, SerializerMixin):
    __tablename__ = 'events'
    
    serialize_rules = ('-event_tickets.event','-user_events.event')

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    description = db.Column(db.String)
    date = db.Column(db.String, nullable=False)  
    time = db.Column(db.String)
    image = db.Column(db.String)
    location = db.Column(db.String, nullable=False)  
    status = db.Column(db.String, default='active')

    event_tickets = db.relationship(
        'EventTicket', back_populates='event', cascade='all, delete-orphan'
    )
    user_events = db.relationship(
        'UserEvent', back_populates = 'event', cascade = 'all, delete-orphan'
    )

class UserEvent(db.Model,SerializerMixin):
    __tablename__ = 'user_events'
   
    serialize_rules = ('-user.user_events','-event.user_events')

    id  = db.Column(db.Integer, primary_key = True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)

    user = db.relationship(
        'User', back_populates='user_events'
    )

    event = db.relationship(
        'Event', back_populates='user_events'
    )