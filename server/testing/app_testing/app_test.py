from faker import Faker
import flask
import pytest
from random import randint, choice as rc
import io
from unittest.mock import patch

from app import app
from models import db,User, UserTicket, Event, EventTicket,UserEvent

app.secret_key = b'a\xdb\xd2\x13\x93\xc1\xe9\x97\xef2\xe3\x004U\xd1Z'

class TestSignup:
    '''Signup resource in app.py'''

    def test_creates_users_at_signup(self):
        '''creates user records with usernames and passwords at /signup.'''
        
        with app.app_context():
            
            User.query.delete()
            db.session.commit()
        
        with app.test_client() as client:
            
            response = client.post('/signup', json={
                'username': 'ashketchum',
                'password': 'pikachu',
                'email':'ashketchum@gmail.com',
                'role':'Organizer'
            })

            assert(response.status_code == 201)

            new_user = User.query.filter(User.username == 'ashketchum').first()

            assert(new_user)
            assert(new_user.authenticate('pikachu'))
            assert(new_user.email == 'ashketchum@gmail.com')
            assert(new_user.role =='Organizer' )

    def test_422s_invalid_users_at_signup(self):
        '''Return 422 to invalid usernames at /signup.'''
        
        with app.app_context():
            
            User.query.delete()
            db.session.commit()
        
        with app.test_client() as client:
            
            response = client.post('/signup', json={
                'password': 'pikachu',
                'email':'ashketchum@gmail.com',
                'role':'Organizer'
            })

            assert(response.status_code == 422)


class TestCheckSession:
    '''CheckSession resource in app.py'''

    def test_returns_user_json_for_active_session(self):
        '''returns JSON for the user's data if there is an active session.'''
        
        with app.app_context():
            
            User.query.delete()
            db.session.commit()
        
        with app.test_client() as client:

           
            token = client.post('/signup', json={
               'username': 'ashketchum',
                'password': 'pikachu',
                'email':'ashketchum@gmail.com',
                'role':'Organizer'
            })

            
            auth = token.json         

            response = client.get('/check_session',headers={'Authorization':f'Bearer {auth['access_token']}'})
            response_json = response.json
            
            assert response_json['id'] == 1
            assert response_json['username']
 

class TestEvents:
    '''Events resource in app.py'''

    def test_get_all_events(self):
        '''retrieves all events at /events.'''
        
        with app.app_context():
            
            Event.query.delete()
            db.session.commit()

            
            event1 = Event(name="Event 1", description="Description 1", date="2023-10-01", time="10:00", image="image1.jpg", location="Location 1")
            event2 = Event(name="Event 2", description="Description 2", date="2023-10-02", time="11:00", image="image2.jpg", location="Location 2")
            db.session.add_all([event1, event2])
            db.session.commit()
        
        with app.test_client() as client:
            
            response = client.get('/events')

            assert(response.status_code == 200)

            events = response.get_json()
            assert(len(events) == 2)
            assert(events[0]['name'] == "Event 1")
            assert(events[1]['name'] == "Event 2")

    @patch('cloudinary.uploader.upload')
    def test_create_event(self, mock_upload):
        '''creates a new event at /events.'''
        
        
        mock_upload.return_value = {"secure_url": "http://fake-image-url.com/image.jpg"}
        
        with app.app_context():
            Event.query.delete()
            db.session.commit()
        
        with app.test_client() as client:
            response = client.post('/events', data={
                'name': 'New Event',
                'description': 'New Description',
                'date': '2023-10-03',
                'time': '12:00',
                'location': 'New Location',
                'image': (io.BytesIO(b"fake image data"), 'test.jpg')
            }, content_type='multipart/form-data')
            
            assert response.status_code == 201

            new_event = Event.query.filter(Event.name == 'New Event').first()
            assert new_event
            assert new_event.image == "http://fake-image-url.com/image.jpg"


class TestGetEventByID:
    '''GetEventByID resource in app.py'''

    def test_get_event_by_id(self):
        '''retrieves a single event by id at /events/<int:id>.'''
        
        with app.app_context():
            
            Event.query.delete()
            db.session.commit()

            
            event = Event(name="Event 1", description="Description 1", date="2023-10-01", time="10:00", image="image1.jpg", location="Location 1")
            db.session.add(event)
            db.session.commit()
            event_id = event.id
        
        with app.test_client() as client:
            
            response = client.get(f'/events/{event_id}')

            assert(response.status_code == 200)

            event_data = response.get_json()
            assert(event_data['name'] == "Event 1")
            assert(event_data['description'] == "Description 1")

    def test_get_nonexistent_event(self):
        '''returns 404 when trying to retrieve a nonexistent event.'''
        
        with app.app_context():
            
            Event.query.delete()
            db.session.commit()
        
        with app.test_client() as client:
            
            response = client.get('/events/999')

            assert(response.status_code == 404)
            assert(response.get_json()['error'] == "Event does not exist")

    @patch('cloudinary.uploader.upload')
    def test_update_event(self, mock_upload):
        '''updates an existing event at /events/<int:id>.'''
        
        
        mock_upload.return_value = {"secure_url": "http://fake-image-url.com/updated-image.jpg"}
        
        with app.app_context():
            Event.query.delete()
            db.session.commit()

            event = Event(name="Event 1", description="Description 1", date="2023-10-01", time="10:00", image="image1.jpg", location="Location 1")
            db.session.add(event)
            db.session.commit()
            event_id = event.id
        
        with app.test_client() as client:
            response = client.patch(f'/events/{event_id}', data={
                'name': 'Updated Event',
                'description': 'Updated Description',
                'date': '2023-10-02',
                'time': '11:00',
                'location': 'Updated Location',
                'image': (io.BytesIO(b"fake image data"), 'test.jpg')
            }, content_type='multipart/form-data')
            
            assert response.status_code == 200

            updated_event = Event.query.get(event_id)
            assert updated_event.image == "http://fake-image-url.com/updated-image.jpg"


    def test_delete_event(self):
        '''deletes an event at /events/<int:id>.'''
        
        with app.app_context():
            
            Event.query.delete()
            db.session.commit()

            
            event = Event(name="Event 1", description="Description 1", date="2023-10-01", time="10:00", image="image1.jpg", location="Location 1")
            db.session.add(event)
            db.session.commit()
            event_id = event.id
        
        with app.test_client() as client:
            
            response = client.delete(f'/events/{event_id}')

            assert(response.status_code == 204)

            deleted_event = Event.query.get(event_id)
            assert(deleted_event is None)