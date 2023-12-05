import os
from printree import ptree
import json
from config import app
# from models import Users, Recipes
from flask import render_template, redirect, url_for, request, flash, jsonify
# from flask_login import login_user, login_required, logout_user, current_user
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
from db import *


def create_product(product_id, product_name):
    return {
        'id': product_id,
        'name': product_name,
        'children': []
        }

def add_product_child(product, child1):
    product['children'].append(child1)
    if len(db_get_product_children(child1['id'])) > 0:
        children = db_get_product_children(child1['id'])
        for child in children:
            add_product_child(child1, create_product(child[0], child[1]))

def create_product_tree(input_id):
    prod_state, product = db_get_product(input_id)
    # giga_products = []
    # main_root = create_product('Root', 'Root')
    if prod_state:
        # for p in products:
            # if not db_is_child(p[0]):
                # giga_products.append(p)
        # Проходимся по каждому продукту
        # for product in giga_products:
            # Создаем корневой продукт
        product_root = create_product(product[0], product[1])
        children = db_get_product_children(product[0])
        # Добавляем дочерние продукты
        for child in children:
            add_product_child(product_root, create_product(child[0], child[1]))
            # main_root['children'].append(product_root)
    return product_root


@app.route('/')
@app.route('/index')
def index():
    
    return render_template('index.html')


@app.route('/products')
def send_products():
    input_id = 6
    products_tree = create_product_tree(input_id)
    # ptree(products_tree)
    return products_tree

if __name__ == '__main__':
    app.run()