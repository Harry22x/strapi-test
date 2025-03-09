from sqlalchemy.exc import IntegrityError
import pytest
import datetime

from models import db,User, UserTicket, Event, EventTicket,UserEvent
from app import app


class TestUser:
    '''User in models.py'''

    def test_has_attributes(self):
        '''has attributes username, emaiil and role.'''
        
        with app.app_context():

            User.query.delete()
            db.session.commit()

            user = User(
                username="Liz",
                email = "Liz@gmail.com",
                role="Attendee"
            )

            user.password_hash = "whosafraidofvirginiawoolf"
            
            db.session.add(user)
            db.session.commit()

            created_user = User.query.filter(User.username == "Liz").first()

            assert(created_user.username == "Liz")
            assert(created_user.email == "Liz@gmail.com")
            assert(created_user.role == "Attendee")
            
            with pytest.raises(AttributeError):
                created_user.password_hash

    def test_requires_username(self):
        '''requires each record to have a username.'''

        with app.app_context():

            User.query.delete()
            db.session.commit()

            user = User()
            with pytest.raises(IntegrityError):
                db.session.add(user)
                db.session.commit()

    def test_requires_unique_username(self):
        '''requires each record to have a username.'''

        with app.app_context():

            User.query.delete()
            db.session.commit()

            user_1 = User(username="Ben")
            user_2 = User(username="Ben")

            with pytest.raises(IntegrityError):
                db.session.add_all([user_1, user_2])
                db.session.commit()
    
    def test_requires_unique_email(self):
        '''requires each record to have a unique email.'''

        with app.app_context():

            User.query.delete()
            db.session.commit()

            user_1 = User(username="Ben", email="ben@gmail.com")
            user_2 = User(username="Benson", email="ben@gmail.com")

            with pytest.raises(IntegrityError):
                db.session.add_all([user_1, user_2])
                db.session.commit()
    

    def test_has_a_list_of_events(self):
        '''user has a list of user_events.'''

        with app.app_context():

            User.query.delete()
            UserEvent.query.delete()
            db.session.commit()

            user = User(username="Ben", email="ben@gmail.com",role = "Organizer")
            user.password_hash = "whosafraidofvirginiawoolf"

            event_1 = Event(name="Event 1", description="Description 1",date="2025-03-12",location="kilimani")
            event_2 = Event(name="Event 2", description="Description 2",date="2025-05-23",location="Langata")

            user_event_1 = UserEvent(user = user, event= event_1)
            user_event_2 = UserEvent(user = user, event= event_2)
            
            user.user_events.append(user_event_1)
            user.user_events.append(user_event_2)

            db.session.add_all([user, event_1, event_2])
            db.session.commit()

            assert(user.id)
            assert(event_1.id)
            assert(event_2.id)
            assert(user_event_1.id)
            assert(user_event_2.id)

            
            assert(user_event_1 in user.user_events)
            assert(user_event_2 in user.user_events)

    def test_has_a_list_of_user_tickets(self):
        '''user has a list of user tickets.'''

        with app.app_context():

            User.query.delete()
            Event.query.delete()
            EventTicket.query.delete()
            UserTicket.query.delete()
            
            db.session.commit()

            user_1 = User(username="Ben", email="ben@gmail.com",role = "Organizer")
            user_1.password_hash = "whosafraidofvirginiawoolf"

            user_2 = User(username="Alex", email="alex@gmail.com",role = "Attendee")
            user_2.password_hash = "whosafraidofvirginiawoolf"

            event_1 = Event(name="Event 1", description="Description 1",date="2025-03-12",location="kilimani")
            event_2 = Event(name="Event 2", description="Description 2",date="2025-05-23",location="Langata")

            event_ticket_1 = EventTicket(ticket_type="vip",price=1500,available_quantity=60,sale_end_date=datetime.datetime.now(), event = event_1 )  
            event_ticket_2 = EventTicket(ticket_type="advanced",price=2500,available_quantity=30,sale_end_date=datetime.datetime.now(), event =event_2)       
        

            user_ticket_1 = UserTicket(purchase_date =datetime.datetime.now(),ticket_quantity= 5,ticket_code="5xYb8N", event_ticket = event_ticket_1, user=user_2)
            user_ticket_2 = UserTicket(purchase_date =datetime.datetime.now(),ticket_quantity= 8,ticket_code="1WI0Zz", event_ticket =event_ticket_2,user=user_2)
            
            
            db.session.add_all([user_2, event_1, event_2,event_ticket_1,event_ticket_2,user_ticket_2,user_ticket_1,])
            db.session.commit()

            assert(user_2.id)
            assert(event_1.id)
            assert(event_2.id)
            assert(event_ticket_1.id)
            assert(event_ticket_2.id)
            assert(user_ticket_1.id)
            assert(user_ticket_2.id)

            assert(user_ticket_1 in user_2.user_tickets)
            assert(user_ticket_2 in user_2.user_tickets)