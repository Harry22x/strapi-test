from sqlalchemy.exc import IntegrityError
import pytest
import datetime

from models import db,Event, EventTicket
from app import app


class TestEvent:
    '''Event in models.py'''

    def test_has_attributes(self):
        '''has attributes name, description,date,time,image and location.'''
        
        with app.app_context():

            Event.query.delete()
            db.session.commit()

            event = Event(name="Event 1", description="Description 1",date="2025-03-12",time="10:00 AM"
                          ,image="https://github.com/Harry22x/Tiketi-Tamasha/blob/stacy-branch/client/src/images/image3.jpeg?raw=true",
                          location="kilimani")

           
            
            db.session.add(event)
            db.session.commit()

            created_event = Event.query.filter(Event.name == "Event 1").first()

            assert(created_event.name == "Event 1")
            assert(created_event.description == "Description 1")
            assert(created_event.date == "2025-03-12")
            assert(created_event.time == "10:00 AM")
            assert(created_event.image == "https://github.com/Harry22x/Tiketi-Tamasha/blob/stacy-branch/client/src/images/image3.jpeg?raw=true")
            assert(created_event.location == "kilimani")
    
    def test_has_event_tickets(self):
        '''has event_tickets.'''

        with app.app_context():
            Event.query.delete()
            db.session.commit()

            event = Event(name="Event 1", description="Description 1", date="2025-03-12", time="10:00 AM"
                          , image="https://github.com/Harry22x/Tiketi-Tamasha/blob/stacy-branch/client/src/images/image3.jpeg?raw=true",
                          location="kilimani")

            event_ticket_1 =  EventTicket(ticket_type="vip",price=1500,available_quantity=60,sale_end_date=datetime.datetime.now(), event = event ) 
            event_ticket_2 =EventTicket(ticket_type="advanced",price=2500,available_quantity=30,sale_end_date=datetime.datetime.now(), event =event)  

            # event.event_tickets.append(event_ticket_1)
            # event.event_tickets.append(event_ticket_2)

            db.session.add_all([event, event_ticket_1, event_ticket_2])
            db.session.commit()


            assert(event.id)
            assert(event_ticket_1.id)
            assert(event_ticket_2.id)

            assert(event_ticket_1 in event.event_tickets)
            assert(event_ticket_2 in event.event_tickets)
            
            
           