import os
from config import app
# from models import Users, Recipes
from flask import render_template, redirect, url_for, request, flash, jsonify
# from flask_login import login_user, login_required, logout_user, current_user
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
from db import *


@app.route('/')
@app.route('/index')
def index():
    return render_template('index.html')


@app.route('/products')
def send_products():
    prod_state, products = db_get_products()
    if prod_state:
        st, products_childs = db_get_product_child()
        if st:
            return jsonify(
                products=products,
                products_childs=products_childs
            )

if __name__ == '__main__':
    app.run()