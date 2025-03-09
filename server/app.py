#!/usr/bin/env python3

# Standard library imports

# Remote library imports
from flask import request,make_response,session,jsonify
from sqlalchemy.exc import IntegrityError
from flask_restful import Resource
import os
import requests
import base64
from datetime import datetime
from random import randint, choice as rc, choices
import cloudinary


import cloudinary.api

import cloudinary.uploader
from cloudinary.utils import cloudinary_url
from faker import Faker
from flask_jwt_extended import  create_access_token, jwt_required, get_jwt_identity
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from google.auth import _helpers
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from datetime import timedelta
from dotenv import load_dotenv
import google.auth.exceptions
import pytz


import string

# Local imports
from config import app, db, api
# Add your model imports
from models import User, UserTicket, Event, EventTicket,UserEvent

# Views go here!

load_dotenv()

CONSUMER_KEY = "wrRTjoU6QhClK1Lf8TIJ0sxqJfCvfEgU68jepcKNxi96NHhR"
CONSUMER_SECRET = "4acLqqC1SxAoT7ym3G5Y2903zg7fNG24MgSQhsX1cNWfFf4aWw8fpMbJKpwPo0Za"
BUSINESS_SHORTCODE = "174379"
PASSKEY = "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"
CALLBACK_URL = "https://yourdomain.com/callback"

cloudinary.config(
    cloud_name="dccwd3mth",
    api_key="729594172262329",
    api_secret="P_8-ezHpnjm0vTYbjvz04y5lSYY",
    secure=True,
)


SCOPES = ['https://www.googleapis.com/auth/gmail.send']


def authenticate_gmail():
    
    creds = Credentials(
        token=os.getenv('GOOGLE_ACCESS_TOKEN'),
        refresh_token=os.getenv('GOOGLE_REFRESH_TOKEN'),
        token_uri=os.getenv('GOOGLE_TOKEN_URI', 'https://oauth2.googleapis.com/token'),
        client_id=os.getenv('GOOGLE_CLIENT_ID'),
        client_secret=os.getenv('GOOGLE_CLIENT_SECRET'),
        scopes=SCOPES,
    )
    
   
    if creds and creds.expired and creds.refresh_token:
        creds.refresh(Request())
        
       
        os.environ['GOOGLE_ACCESS_TOKEN'] = creds.token
    
    return build('gmail', 'v1', credentials=creds)


def send_email(service, to, subject, body):
    try:
       
        message = MIMEMultipart()
        message['to'] = to
        message['from'] = 'ha.wakhule@gmail.com'  
        message['subject'] = subject
        message.attach(MIMEText(body, 'html'))

       
        raw_message = base64.urlsafe_b64encode(message.as_bytes()).decode('utf-8')
        message_body = {'raw': raw_message}

        
        service.users().messages().send(userId='me', body=message_body).execute()
        print("Email sent successfully!")
        return True
    except Exception as e:
        print(f"An error occurred: {e}")
        return False


class forgot_password(Resource):
   def post(self):
        try:
            email = request.json.get('email')
            user = User.query.filter_by(email=email).first()
            if user:
                # Ensure UTC-aware datetime for token expiration
                now = datetime.now(pytz.UTC)
                expires = timedelta(minutes=30)
                token = create_access_token(
                    identity=str(email),
                    expires_delta=expires
                )
                reset_link = f"http://localhost:3000/reset-password?token={token}"
                subject = "Tiketi Account Password Reset Request"
                body = f"""
                    <html>
                        <body>
                        
                             <p>For Tiketi account {user.username}, click this 
                                <a href="{reset_link}">link</a> 
                                to reset your password. This link expires in 30 minutes
                            </p>
                        </body>
                    </html>
                """

                service = authenticate_gmail()
                send_email(service, email, subject, body)
                return make_response({"message": "Password reset email sent"}, 200)
            else:
                return make_response({"error": "Email not found"}, 404)

        except Exception as e:
            return make_response({"error":f"Error in forgot_password: {e}"},500)
            raise  

class reset_password(Resource):
    @jwt_required()
    def post(self):
        new_password = request.json.get('new_password')
        try:
            email = get_jwt_identity()  
            user = User.query.filter_by(email=email).first()
            if user:
                user.password_hash =  new_password 
                db.session.commit()
                return make_response({"msg": "Password reset successful"}, 200)
            else:
                return make_response({"msg": "User not found"}, 404)
        except:
            return make_response({"msg": "Invalid or expired token"}, 400)

def get_mpesa_token():
    url = "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
    auth = f"{CONSUMER_KEY}:{CONSUMER_SECRET}"
    encoded_auth = base64.b64encode(auth.encode()).decode()
    headers = {"Authorization": f"Basic {encoded_auth}"}
    
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        return response.json()["access_token"]
    else:
        return None
def generate_password():
    timestamp = datetime.now().strftime("%Y%m%d%H%M%S")
    password_str = f"{BUSINESS_SHORTCODE}{PASSKEY}{timestamp}"
    encoded_password = base64.b64encode(password_str.encode()).decode()
    return encoded_password, timestamp

class get_token(Resource):
    def get(self):
        token = get_mpesa_token()
        if token:
            return jsonify({"access_token": token})
        else:
            return jsonify({"error": "Failed to get access token"}), 500
        

class stk_push(Resource):
    def post(self):
        token = get_mpesa_token()
        if not token:
            return jsonify({"error": "Failed to get access token"}), 500
        
        password, timestamp = generate_password()

        payload = {
            "BusinessShortCode": BUSINESS_SHORTCODE,
            "Password": password,
            "Timestamp": timestamp,
            "TransactionType": "CustomerPayBillOnline",
            "Amount": request.json.get("amount", 1), 
            "PartyA": request.json.get("phone"),  
            "PartyB": BUSINESS_SHORTCODE,
            "PhoneNumber": request.json.get("phone"),
            "CallBackURL": CALLBACK_URL,
            "AccountReference": "Tiketi",
            "TransactionDesc": "Payment"
        }

        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json"
        }

        mpesa_url = "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest"
        response = requests.post(mpesa_url, json=payload, headers=headers)

        return response.json()
@app.route('/')
def index():
    return '<h1>Project Server</h1>'

class Events(Resource):
    def get(self):
        events = [{
            "id":event.id,
            "name": event.name,
            "description": event.description,
            "date": event.date,
            "time": event.time,
            "image": event.image,
            "location":event.location
        } for event in Event.query.all()]
        return make_response(events,200)

    def post(self):
            if 'image' not in request.files:
                return {"error": "No image file provided"}, 400

            image_file = request.files['image'] 
            
           
            upload_result = cloudinary.uploader.upload(
                image_file,
                transformation=[
                    {"width": 500, "height": 500, "crop": "fill", "gravity": "auto"}
                ]
            )

            
            name = request.form.get("name")
            description = request.form.get("description")
            date = request.form.get("date")
            time = request.form.get("time")
            location = request.form.get("location")

            
            if not all([name, description, date, time, location]):
                return {"error": "Missing event details"}, 400

            
            new_event = Event(
                name=name,
                description=description,
                date=date,
                time=time,
                image=upload_result["secure_url"], 
                location=location,
            )
            db.session.add(new_event)
            db.session.commit()

            return make_response(new_event.to_dict(), 201)
class GetEventByID(Resource):
    def get(self, id):
        event = Event.query.get(id)
        if event:
            return make_response(event.to_dict(),200)
        else:
            return make_response({"error":"Event does not exist"},404)
    
    def patch(self, id):
        event = Event.query.filter_by(id=id).first()
        if not event:
            return {"error": "Event not found"}, 404

        
        name = request.form.get("name")
        description = request.form.get("description")
        date = request.form.get("date")
        time = request.form.get("time")
        location = request.form.get("location")

        
        if "image" in request.files:
            image_file = request.files["image"]
            upload_result = cloudinary.uploader.upload(
                image_file,
                transformation=[{"width": 500, "height": 500, "crop": "fill", "gravity": "auto"}]
            )
            event.image = upload_result["secure_url"]

       
        if name:
            event.name = name
        if description:
            event.description = description
        if date:
            event.date = date
        if time:
            event.time = time
        if location:
            event.location = location

        db.session.commit()
        return make_response(event.to_dict(), 200) 
    def delete(self,id):
        event = Event.query.filter_by(id=id).first()
        db.session.delete(event)
        db.session.commit()

        response = make_response("",204)
        return response



class EventTickets(Resource):
    def post(self):
        data = request.get_json()

        new_event_ticket = EventTicket(
            event_id=data['event_id'],
            ticket_type=data['ticket_type'],
            price=data['price'],
            available_quantity=data['available_quantity'],
            sale_end_date=Faker().date_between(start_date="today", end_date="+60d"),
        )
        db.session.add(new_event_ticket)
        db.session.commit()

        return make_response(new_event_ticket.to_dict(), 201)

class UserEvents(Resource):
    def post(self):
        data = request.get_json()

        new_user_event = UserEvent(
            user_id = data['user_id'],
            event_id = data['event_id'],
        )
        db.session.add(new_user_event)
        db.session.commit()

        return make_response(new_user_event.to_dict(),201)


class Signup(Resource):
    def post(self):
        data = request.get_json()
            
        errors = {}
        for field in ['username', 'email', 'password', 'role']:
            if not data.get(field):
                errors[field] = f'{field.capitalize()} is required'
                
        if errors:
            print(f"Validation errors: {errors}")
            return {'errors': errors}, 422
            
        try:
                    
            new_user = User(
                username=data['username'],
                email=data['email'],
                role=data['role'],
            )
            
            new_user.password_hash = data['password']
                     
            db.session.add(new_user)
            db.session.commit()
                   
            access_token = create_access_token(identity=str(new_user.id), expires_delta=timedelta(days=30)) 
            return {'access_token': access_token}, 201

            
        except ValueError as e:
          
            error_message = str(e)
            print(f"ValueError during signup: {error_message}")
            

            if "username" in error_message.lower():
                errors['username'] = error_message
            elif "email" in error_message.lower():
                errors['email'] = error_message
            else:
                errors['validation'] = error_message
                
            return make_response({'errors': error_message}, 422)
            
        except Exception as e:
            db.session.rollback()
            error_detail = str(e)
            print(f"Exception during signup: {error_detail}")
            return {'errors': {'database': f'Error saving user: {error_detail}'}}, 422


    
class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username=data.get('username')).first()

        if user and user.authenticate(data.get('password', '')):
            access_token = create_access_token(identity=str(user.id), expires_delta=timedelta(days=30))  
            return {'access_token': access_token}, 200

        return {'error': 'Invalid username or password'}, 401
    


class CheckSession(Resource):
    @jwt_required()  
    def get(self):
        user_id = get_jwt_identity()  
        user = User.query.filter_by(id=user_id).first()

        if user_id:
            return user.to_dict(), 200
        return {'error': 'Unauthorized'}, 401


class Logout(Resource):
    def delete(self):
   
        user_id = session.get('user_id')
 
        try:
            session.pop('user_id', None)
            session.modified = True
     
            return '', 204
        except Exception as e:
            return {'error': str(e)}, 500
        

class HandleUserTickets(Resource):
    def post(self):
        data = request.get_json()

        new_user_ticket = UserTicket(
            user_id = data['user_id'],
            event_ticket_id = data['event_ticket_id'],
            ticket_quantity = data['ticket_quantity'],
            ticket_code = ''.join(  choices(string.ascii_letters + string.digits, k=10))
        )
        db.session.add(new_user_ticket)
        db.session.commit()


class EventTicketByID(Resource):
        def patch(self,id):
            event_ticket = EventTicket.query.filter_by(id=id).first()
            if event_ticket:
                content = request.get_json()
                
                event_ticket.available_quantity = content['available_quantity']
                db.session.commit()
                return make_response(event_ticket.to_dict(),201)
                
            else:
                return make_response({"error":"Event ticket does not exist"},404)
        def get(self,id):
            event_ticket = EventTicket.query.filter_by(id=id).first()
            if event_ticket:
                return make_response(event_ticket.to_dict(),200)
            else:
                return make_response({"error":"Event ticket does not exist"},404)

class UserTicketByID(Resource):
    def delete(self,id):
        user_ticket = UserTicket.query.filter_by(id=id).first()
        if user_ticket:
            db.session.delete(user_ticket)
            db.session.commit()
            return '', 204
        else:
            return make_response({"error":"User ticket does not exist"},404)



api.add_resource(Events,'/events')
api.add_resource(GetEventByID,'/events/<int:id>')
api.add_resource(Signup,'/signup')
api.add_resource(Login, '/login')
api.add_resource(CheckSession, '/check_session')
api.add_resource(Logout, '/logout')
api.add_resource(get_token, '/get-token')
api.add_resource(stk_push,'/stk-push')
api.add_resource(HandleUserTickets, '/user-tickets')
api.add_resource(EventTickets,'/event-tickets')
api.add_resource(UserEvents, '/user-events')
api.add_resource(forgot_password, '/forgot-password')
api.add_resource(reset_password,'/reset-password')
api.add_resource(EventTicketByID,'/event-tickets/<int:id>')
api.add_resource(UserTicketByID,'/user-tickets/<int:id>')











if __name__ == '__main__':
    app.run(port=5555, debug=True)

