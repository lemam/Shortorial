from .app import create_app, init_db
import numpy as np

app = create_app()
db_app, db = init_db()