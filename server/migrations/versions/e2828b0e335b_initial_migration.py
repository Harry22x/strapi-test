"""initial migration

Revision ID: e2828b0e335b
Revises: 
Create Date: 2025-03-08 15:24:31.517244

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'e2828b0e335b'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('events',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('name', sa.String(), nullable=False),
    sa.Column('description', sa.String(), nullable=True),
    sa.Column('date', sa.String(), nullable=False),
    sa.Column('time', sa.String(), nullable=True),
    sa.Column('image', sa.String(), nullable=True),
    sa.Column('location', sa.String(), nullable=False),
    sa.Column('status', sa.String(), nullable=True),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('username', sa.String(length=80), nullable=False),
    sa.Column('email', sa.String(length=120), nullable=False),
    sa.Column('role', sa.String(), nullable=True),
    sa.Column('_password_hash', sa.String(), nullable=False),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email'),
    sa.UniqueConstraint('username')
    )
    op.create_table('event_tickets',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('event_id', sa.Integer(), nullable=False),
    sa.Column('ticket_type', sa.String(), nullable=False),
    sa.Column('price', sa.Numeric(precision=10, scale=2), nullable=False),
    sa.Column('available_quantity', sa.Integer(), nullable=False),
    sa.Column('sale_end_date', sa.DateTime(), nullable=False),
    sa.ForeignKeyConstraint(['event_id'], ['events.id'], name=op.f('fk_event_tickets_event_id_events')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user_events',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('event_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['event_id'], ['events.id'], name=op.f('fk_user_events_event_id_events')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_user_events_user_id_users')),
    sa.PrimaryKeyConstraint('id')
    )
    op.create_table('user_tickets',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('event_ticket_id', sa.Integer(), nullable=False),
    sa.Column('purchase_date', sa.DateTime(), server_default=sa.text('(CURRENT_TIMESTAMP)'), nullable=True),
    sa.Column('ticket_quantity', sa.Integer(), nullable=False),
    sa.Column('ticket_code', sa.String(), nullable=False),
    sa.ForeignKeyConstraint(['event_ticket_id'], ['event_tickets.id'], name=op.f('fk_user_tickets_event_ticket_id_event_tickets')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_user_tickets_user_id_users')),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('ticket_code')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user_tickets')
    op.drop_table('user_events')
    op.drop_table('event_tickets')
    op.drop_table('users')
    op.drop_table('events')
    # ### end Alembic commands ###
