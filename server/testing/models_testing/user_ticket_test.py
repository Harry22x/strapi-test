from sqlalchemy.exc import IntegrityError
import pytest
import datetime

from models import db,User, UserTicket, Event, EventTicket,UserEvent
from app import app


class TestUserTicket:

    def test_has_attributes(self):
        pass