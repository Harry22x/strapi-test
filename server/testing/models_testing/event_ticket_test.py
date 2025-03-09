from sqlalchemy.exc import IntegrityError
import pytest
import datetime

from models import db,Event, EventTicket
from app import app


class TestEventTicket:

    def test_has_attributes(self):
        '''has attributes usticket_typeername, price, available_quantity,sale_end_date and event_id.'''
        
        with app.app_context():
            EventTicket.query.delete()
            Event.query.delete()
            db.session.commit()

            event = Event(name="Event 1", description="Description 1",date="2025-03-12",time="10:00 AM"
                          ,image="https://github.com/Harry22x/Tiketi-Tamasha/blob/stacy-branch/client/src/images/image3.jpeg?raw=true",
                          location="kilimani")
            event_ticket= EventTicket(ticket_type="vip",price=10,available_quantity=60,sale_end_date=datetime.datetime.now(), event = event)

            db.session.add_all([event,event_ticket])
            db.session.commit()

            created_event = EventTicket.query.filter(EventTicket.ticket_type=="vip").first()

            assert(created_event.ticket_type=="vip")
            assert(created_event.price==10)
            assert(created_event.available_quantity==60)
            assert(created_event.sale_end_date)
            assert(created_event.event_id == event.id)

    
    def test_price_positive_integer(self):
        '''price must be a positive integer.'''

        with app.app_context():
            EventTicket.query.delete()
            Event.query.delete()
            db.session.commit()

            event = Event(
                name="Event 1",
                description="Description 1",
                date="2025-03-12",
                time="10:00 AM",
                image="https://github.com/Harry22x/Tiketi-Tamasha/blob/stacy-branch/client/src/images/image3.jpeg?raw=true",
                location="kilimani"
            )

            db.session.add(event)
            db.session.commit() 

            with pytest.raises(ValueError):
                event_ticket = EventTicket(
                    ticket_type="vip",
                    price=-10,  
                    available_quantity=60,
                    sale_end_date=datetime.datetime.now(),
                    event=event
                )
    
    def test_quantity_positive_integer(self):
        '''quantity must be a positive integer.'''

        with app.app_context():
            EventTicket.query.delete()
            Event.query.delete()
            db.session.commit()

            event = Event(
                name="Event 1",
                description="Description 1",
                date="2025-03-12",
                time="10:00 AM",
                image="https://github.com/Harry22x/Tiketi-Tamasha/blob/stacy-branch/client/src/images/image3.jpeg?raw=true",
                location="kilimani"
            )

            db.session.add(event)
            db.session.commit() 

            with pytest.raises(ValueError):
                event_ticket = EventTicket(
                    ticket_type="vip",
                    price=1500,  
                    available_quantity=-7,
                    sale_end_date=datetime.datetime.now(),
                    event=event
                )

        



