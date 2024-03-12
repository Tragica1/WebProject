import os
from printree import ptree
import json
from config import app, contract_folder
# from models import Users, Recipes
from flask import render_template, redirect, url_for, request, flash, jsonify, send_file
# from flask_login import login_user, login_required, logout_user, current_user
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
from db import *
from zipfile import ZipFile


def create_product(id, name, code, number, count, type, state, note):
    return {
        'id': id,
        'name': fix_quotes(str(name)),
        'code': code,
        'number': number,
        'count': count,
        'idType': type, 
        'idState': state,
        'isContract': 0,
        'idProvider': 0,
        'start': None,
        'end': None,
        'note': note,
        'files': [],
        'children': []
    }

def fix_quotes(string):
    counter = 1
    new_string = ""
    for i in range(len(string)):
        if string[i] == '"':
            if counter % 2 != 0:
                counter+=1
                new_string += "«"
            else:
                counter-=1
                new_string += "»"
        else:
            new_string += string[i]
    return new_string

def add_product_child(product, child):
    product['children'].append(child)
    if len(db_get_product_children(child['id'])) > 0:
        children = db_get_product_children(child['id'])
        for ch in children:
            add_product_child(child, create_product(ch[0], ch[1], ch[2], ch[3], ch[5], ch[6], ch[7], ch[11]))


def create_product_tree(input_id):
    prod_state, product = db_get_product(input_id)
    if prod_state:
        product_root = create_product(product[0], product[1], product[2], product[3], product[5], product[6], product[7], product[11])
        children = db_get_product_children(product[0])
        for child in children:
            add_product_child(product_root, create_product(child[0], child[1], child[2], child[3], child[5], child[6], child[7], child[11]))
    return product_root


def check_contract_file(contract_id):
    contract_file = 'contract' + contract_id + '.json'
    for file in os.listdir(os.path.join(contract_folder, 'contract_' + str(contract_id))):
        if file == contract_file:
            return [True, os.path.join(contract_folder, 'contract_' + str(contract_id), contract_file)]
    return [False, None]


@app.route('/products/<contract_id>')
def send_products(contract_id):
    print(f'\nSelected contract: {contract_id}\n')
    if not os.path.isdir(os.path.join(contract_folder, 'contract_' + str(contract_id))):
        os.mkdir(os.path.join(contract_folder, 'contract_' + str(contract_id)))
    file = check_contract_file(contract_id)
    if file[0]: 
        with open(file[1], 'r') as f:
            json_object = f.read()
        f.close()
        return json_object
    else:
        products_id = db_get_product_contract_list(contract_id)
        root_obj = create_product('root', '', '', '', '', '', '', '')
        json_data = {
            'data': []
        }
        for pr_id in products_id:
            product_tree = create_product_tree(pr_id)
            json_data['data'].append(product_tree)
            root_obj['children'].append(product_tree)
        json_object = json.dumps(json_data)
        with open(os.path.join(contract_folder,'contract_' + str(contract_id), 'contract' + str(contract_id) + '.json'), 'x') as f:
            f.write(json_object)
        f.close()
        return json_object


@app.route('/contacts/<company_id>')
def send_contacts(company_id):
    contacts = db_get_company_contacts(company_id)
    return json.dumps(contacts)


@app.route('/')
def index():
    state, contrs = db_get_government_contracts()
    contracts = []
    contractTypes = []
    types = []
    states = []
    companies = []
    tps = db_get_types()
    sts = db_get_states()
    comps = db_get_companies()
    contrs_types = db_get_contract_types()
    for t in tps:
        types.append(list(t))
    for s in sts:
        states.append(list(s))
    for c in comps:
        tmp = list(c)
        companies.append(tmp)
    for ct in contrs_types:
        contractTypes.append(list(ct))
    if state:
        for c in contrs:
            contracts.append(list(c))
        return render_template('index.html', contracts=contracts, types=types, states=states, companies=companies, contractTypes=contractTypes)
    else:
        return render_template('index.html', types=types, states=states, companies=companies, contractTypes=contractTypes)


@app.route('/getSelector')
def create_product_selector():
    state, prods = db_get_products()
    res = []
    products = []
    for p in prods:
        products.append(list(p))
    if state:
        for product in products:
            if product[4] == 1:
                res.append(dict({'id': product[0], 'name': product[1]}))
    return(json.dumps(res))


@app.route('/saveContract', methods=['POST'])
def save_contract():
    try:
        data = request.get_json()
        print(data)
        new_contract_id = int(db_add_government_contract(data)[0])
        os.mkdir(os.path.join(contract_folder, 'contract_' + str(new_contract_id)))
        products = data.get('products')
        for i in range(len(products)):
            products[i] = int(products[i])
        db_add_product_contract_list(new_contract_id, products)
        print('Contract added successfully')
        return jsonify({'status': 'success', 'message': 'Contract added successfully'})
    except Exception as e:
        print(e)
        return jsonify({'status': 'error', 'message': str(e)})


def change_product_in_json(contract_data, product_data, file_pathes):
    for item in contract_data:
        if int(product_data['id']) == item['id']:
            item['number'] = product_data['number']
            item['count'] = product_data['count']
            item['idType'] = product_data['idType']
            item['idState'] = product_data['idState']
            item['isContract'] = int(product_data['isContract'])
            item['idProvider'] = product_data['idProvider']
            item['start'] = str(product_data['start'])
            item['end'] = str(product_data['end'])
            item['note'] = str(product_data['note'])
            if len(file_pathes) != 0:
                for path in file_pathes:
                    item['files'].append(path)
            return 0
        if len(item['children']) != 0:
            change_product_in_json(item['children'], product_data, file_pathes)


@app.route('/changeProduct', methods=['POST'])    
def change_product():
    try:
        data = json.loads(request.form['data'])
        dir_path = os.path.join(contract_folder,'contract_' + str(data['contractId']))
        file_pathes = []   
        if request.files:
            file_pathes = []
            files = request.files.getlist('files')
            print(files)
            for file in files:
                if file.filename != '':
                    filepath = os.path.join(dir_path, secure_filename(file.filename))
                    file.save(filepath)
                    file_pathes.append(filepath)
        with open(os.path.join(dir_path, 'contract' + data['contractId'] + '.json'), 'r') as f:
            contract_data = json.load(f)
            f.close()
        change_product_in_json(contract_data['data'], data, file_pathes)
        with open(os.path.join(dir_path, 'contract' + data['contractId'] + '.json'), 'w') as f:
            json_data = json.dumps(contract_data)
            f.write(json_data)
            f.close()

        print('Product changed successfully')
        return jsonify({'status': 'success', 'message': 'Product changed successfully'})
    except Exception as e:
        print(e)
        return jsonify({'status': 'error', 'message': str(e)})


def delete_product_in_json(contract_data, product_id, index):
    for item in contract_data:
        if int(item['id']) == product_id:
            # print(index)
            # print(contract_data[index])
            del contract_data[index]
        index+=1
        if len(item['children']) != 0:
            delete_product_in_json(item['children'], product_id, 0)


@app.route('/deleteProduct', methods=['POST'])
def delete_product():
    try:
        data = request.get_json()
        dir_path = os.path.join(contract_folder,'contract_' + str(data['contractId']))
        with open(os.path.join(dir_path, 'contract' + data['contractId'] + '.json'), 'r') as f:
            contract_data = json.load(f)
            f.close()
        index = 0
        delete_product_in_json(contract_data['data'], int(data['productId']), index)
        with open(os.path.join(dir_path, 'contract' + data['contractId'] + '.json'), 'w') as f:
            json_data = json.dumps(contract_data)
            f.write(json_data)
            f.close()
        print('Product deleted successfully')
        return jsonify({'status': 'success', 'message': 'Product deleted successfully'})
    except Exception as e:
        print(e)
        return jsonify({'status': 'error', 'message': str(e)})


def get_product_files_in_json(contract_data, product_id):
    for item in contract_data:
        if int(item['id']) == int(product_id):
            return item['files']
        if len(item['children']) != 0:
            get_product_files_in_json(item['children'], product_id)


@app.route('/downloadFiles', methods=['GET'])
def get_product_files():
    try:
        contract_id = request.args.get('contractId')
        product_id =  request.args.get('productId')

        dir_path = os.path.join(contract_folder,'contract_' + str(contract_id))
        with open(os.path.join(dir_path, 'contract' + str(contract_id) + '.json'), 'r') as f:
            contract_data = json.load(f)
            f.close()
        files = get_product_files_in_json(contract_data['data'], product_id)
        if files:
            with ZipFile(os.path.join(dir_path, 'product_files.zip'), 'w') as zip:
                for file in files:
                    zip.write(file)
                zip.close()
            return send_file(os.path.join(dir_path, 'product_files.zip'), as_attachment=True)
        else:
            return jsonify({'status': 'error', 'message': 'No files'})
    except Exception as e:
        print(e)
        return jsonify({'status': 'error', 'message': str(e)})


@app.route('/saveProvider', methods=['POST'])    
def save_provider():
    try:
        data = request.get_json()
        print(data)
        company_id = db_add_company(data['name'], data['address'])
        if(data['contacts']):
            for contact in data['contacts']:
                contact_id = db_add_contact(contact['name'], contact['number'])
                db_add_contact_company_list(contact_id, company_id)
        print('Provider added successfully')
        return jsonify({'status': 'success', 'message': 'Provider added successfully'})
    except Exception as e:
        print(e)
        return jsonify({'status': 'error', 'message': str(e)})
    

if __name__ == '__main__':
    app.run()