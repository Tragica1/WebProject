import os
import json
from flask import render_template, redirect, url_for, request, flash, jsonify, send_file
from werkzeug.security import check_password_hash, generate_password_hash
from werkzeug.utils import secure_filename
from utils import *
from config import *
from printree import ptree
import copy



@app.route('/products/<contract_id>', methods=['GET'])
@jwt_required()
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
        json_data = {
            'data': []
        }
        for pr_id in products_id:
            product_tree = create_product_tree(pr_id)
            json_data['data'].append(product_tree)
        unique_id(json_data['data'], {'id': 0})
        json_object = json.dumps(json_data)
        with open(os.path.join(contract_folder,'contract_' + str(contract_id), 'contract' + str(contract_id) + '.json'), 'x') as f:
            f.write(json_object)
        f.close()
        return json_object


@app.route('/contacts/<company_id>', methods=['GET'])
@jwt_required()
def send_contacts(company_id):
    contacts = db_get_company_contacts(company_id)
    return json.dumps(contacts)

@jwt.unauthorized_loader
def custom_unauthorized_response(_err):
    return redirect(url_for('login'))

@app.route('/')
@jwt_required()
def index():
    cur_user = get_jwt_identity()
    state, contrs = db_get_government_contracts()
    contracts = []
    contractTypes = []
    contractStatus = []
    types = []
    states = []
    tps = db_get_types()
    sts = db_get_states()
    contrs_types = db_get_contract_types()
    contrs_status = db_get_contract_statuses()
    for t in tps:
        types.append(list(t))
    for s in sts:
        states.append(list(s))
    for ct in contrs_types:
        contractTypes.append(list(ct))
    for cs in contrs_status:
        contractStatus.append(list(cs))
    if state:
        for c in contrs:
            contracts.append(list(c))
        return render_template('index.html', contracts=contracts, types=types, states=states, contractTypes=contractTypes, contractStatus=contractStatus, cur_user=cur_user)
    else:
        return render_template('index.html', types=types, states=states, contractTypes=contractTypes, contractStatus=contractStatus, cur_user=cur_user)


@app.route('/statistic')
@jwt_required()
def statistic():
    cur_user = get_jwt_identity()
    state, contrs = db_get_government_contracts()
    contracts = []
    contractTypes = []
    contractStatus = []
    contrs_types = db_get_contract_types()
    contrs_status = db_get_contract_statuses()
    for ct in contrs_types:
        contractTypes.append(list(ct))
    for cs in contrs_status:
        contractStatus.append(list(cs))
    if state:
        for c in contrs:
            contracts.append(list(c))
        return render_template('statistic.html', contracts=contracts, contractTypes=contractTypes, contractStatus=contractStatus, cur_user=cur_user)
    else:
        return render_template('statistic.html', contractTypes=contractTypes, contractStatus=contractStatus, cur_user=cur_user)


@app.route('/getChartData')
@jwt_required()
def data_for_chart():
    try:
        contractId = request.args.get('contractId')
        contracts = get_contracts()
        dir_path = os.path.join(contract_folder, 'contract_' + str(contractId))
        with open(os.path.join(dir_path, 'contract' + str(contractId) + '.json'), 'r') as f:
            contract_data = json.load(f)
            f.close()
        products = []
        get_products_for_statistic(contract_data['data'], products)
        # print(products)
        return jsonify({'status': 'success', 'contracts': contracts, 'products': products})
    except Exception as e:
        print(e)
        return jsonify({'status': 'error', 'message': str(e)})


@app.route('/getProdivers', methods=['GET'])
@jwt_required()
def get_providers():
    try:
        companies = []
        comps = db_get_companies()
        for c in comps:
            tmp = list(c)
            companies.append(tmp)
        # print(companies)
        return jsonify({'status': 'success', 'data': companies})
    except Exception as e:
        print(e)
        return jsonify({'status': 'error', 'message': str(e)})


@app.route('/getSelector')
@jwt_required()
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
@jwt_required()
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
        new_contract = list(db_get_government_contract(new_contract_id)[1])
        print(new_contract)
        new_contract[3] = str(new_contract[3])
        new_contract[4] = str(new_contract[4])
        contracts = get_contracts()
        if new_contract[0]:
            return jsonify({'status': 'success', 'message': 'Contract added successfully', 'contractId': new_contract_id, 'data': new_contract, 'contracts': contracts})
    except Exception as e:
        print(e)
        return jsonify({'status': 'error', 'message': str(e)})


@app.route('/changeContractStatus', methods=['POST'])
@jwt_required()
def change_contract_status():
    try:
        contractId = request.form['contractId']
        newStatus = request.form['status']
        print(contractId, newStatus)
        db_update_contract(int(contractId), int(newStatus))
        contracts = get_contracts()
        return jsonify({'status': 'success', 'message': 'Contract changed successfully', 'contracts': contracts})
    except Exception as e:
        print(e)
        return jsonify({'status': 'error', 'message': str(e)})


@app.route('/getProductParents', methods=['GET'])
@jwt_required()
def get_product_parents():
    try:
        contractId = request.args.get('contractId')
        productCode = request.args.get('productCode')
        print(contractId, productCode)
        dir_path = os.path.join(contract_folder,'contract_' + str(contractId))
        with open(os.path.join(dir_path, 'contract' + str(contractId) + '.json'), 'r') as f:
            contract_data = json.load(f)
            f.close()
        parents = []
        if (productCode != 'н/ш'):
            get_parents(contract_data['data'], productCode, parents, False)
        return jsonify({'status': 'success', 'parents': parents})
    except Exception as e:
        print(e)
        return jsonify({'status': 'error', 'message': str(e)})


@app.route('/changeProduct', methods=['POST'])
@jwt_required()  
def change_product():
    try:
        data = json.loads(request.form['data'])
        print(data)
        dir_path = os.path.join(contract_folder,'contract_' + str(data['contractId']))
        file_pathes = []   
        if request.files:
            files = request.files.getlist('files')
            print(files)
            for file in files:
                if file.filename != '':
                    filepath = os.path.join(dir_path, file.filename.replace(' ', '_'))
                    file.save(filepath)
                    file_pathes.append(filepath)
        with open(os.path.join(dir_path, 'contract' + str(data['contractId']) + '.json'), 'r') as f:
            contract_data = json.load(f)
            f.close()
        change_product_in_json(contract_data['data'], data, file_pathes)
        with open(os.path.join(dir_path, 'contract' + str(data['contractId']) + '.json'), 'w') as f:
            json_data = json.dumps(contract_data)
            f.write(json_data)
            f.close()
        product = {'product': {}}
        get_product_from_json(contract_data['data'], int(data['id']), product)
        # print(product['product'])
        print('Product changed successfully')
        # print(files)
        return jsonify({'status': 'success', 'message': 'Product changed successfully', 'product': product['product']})
    except Exception as e:
        print(e)
        return jsonify({'status': 'error', 'message': str(e)})


@app.route('/deleteProduct', methods=['POST'])
@jwt_required()
def delete_product():
    try:
        data = request.get_json()
        print(data)
        dir_path = os.path.join(contract_folder,'contract_' + str(data['contractId']))
        with open(os.path.join(dir_path, 'contract' + str(data['contractId']) + '.json'), 'r') as f:
            contract_data = json.load(f)
            f.close()
        index = 0
        files = {'files': []}
        delete_product_in_json(contract_data['data'], int(data['productId']), index, files)
        if files['files']:
            for file in files['files']:
                os.remove(file)
        with open(os.path.join(dir_path, 'contract' + str(data['contractId']) + '.json'), 'w') as f:
            json_data = json.dumps(contract_data)
            f.write(json_data)
            f.close()
        print('Product deleted successfully')
        return jsonify({'status': 'success', 'message': 'Product deleted successfully'})
    except Exception as e:
        print(e)
        return jsonify({'status': 'error', 'message': str(e)})


@app.route('/addNewProduct', methods=['POST'])
@jwt_required()
def add_new_product():
    try:
        data = json.loads(request.form['data'])
        print(data)
        to_db = request.form['to_db']       
        files = request.files.getlist('files')
        dir_path = os.path.join(contract_folder,'contract_' + str(data['contractId']))
        json_file_pathes = []
        db_file_pathes = []
        static_files = json.loads(request.form['static_files'])
        if request.files:
            files = request.files.getlist('files')
            for file in files:
                if file.filename != '':
                    if (int(to_db) == 1):
                        filepath = os.path.join(secret_folder, file.filename.replace(' ', '_'))
                        file.save(filepath)
                        db_file_pathes.append(filepath)
                    filepath = os.path.join(dir_path, file.filename.replace(' ', '_'))
                    file.save(filepath)
                    json_file_pathes.append(filepath)
        if static_files:
            for f in static_files:
                json_file_pathes.append(f)
        if (int(to_db) == 1):
            new_prod_id = db_add_product(data)
            if int(data['mainProductId']) != -1:
                db_add_child(int(data['mainProductId']), new_prod_id)
            if db_file_pathes:
                for filepath in db_file_pathes:
                    file_id = db_add_files(filepath)
                    db_add_product_file_list(file_id, new_prod_id)
        else:
            with open(os.path.join(dir_path, 'contract' + str(data['contractId']) + '.json'), 'r') as f:
                contract_data = json.load(f)
                lol = copy.deepcopy(contract_data)
                f.close()
            new_id = {'id': -1}
            condition = request.form['add_children']
            condition_type = request.form['add_children_type']
            chl = []
            if int(condition) != -1:
                if condition_type == 'json':
                    chl = get_product_children_from_json(lol['data'], condition)
                elif condition_type == 'db':
                    chl = create_product_tree(db_get_product_id(data['code']))['children']
                change_children(chl, lol['data'], new_id)
            # if len(chl) != 0:
            #     get_new_product_id(contract_data['data'], new_id)
            #     new_id['id'] += 2
            # else:
            #     get_new_product_id(contract_data['data'], new_id)
            #     new_id['id'] += 1
            else:
                get_new_product_id(contract_data['data'], new_id)
            add_product_in_json(contract_data['data'], data, json_file_pathes, chl, new_id)
            with open(os.path.join(dir_path, 'contract' + str(data['contractId']) + '.json'), 'w') as f:
                json_data = json.dumps(contract_data)
                f.write(json_data)
                f.close()
        return jsonify({'status': 'success', 'message': 'Product added successfully'})
    except Exception as e:
        print(e)
        return jsonify({'status': 'error', 'message': str(e)})
    

@app.route('/downloadFile', methods=['GET'])
@jwt_required()
def send_product_file():
    try:
        file_name = request.args.get('filePath')
        name = file_name.split('\\')[-1]
        return send_file(file_name, as_attachment=True, download_name=name)
    except Exception as e:
        print(e)
        return jsonify({'status': 'error', 'message': str(e)})


@app.route('/deleteFile', methods=['GET'])
@jwt_required()
def delete_product_file():
    try:
        file_name = request.args.get('filePath')
        product_id = request.args.get('productId')
        contract_id = request.args.get('contractId')
        print(file_name, product_id, contract_id)
        dir_path = os.path.join(contract_folder, 'contract_' + str(contract_id))
        with open(os.path.join(dir_path, 'contract' + str(contract_id) + '.json'), 'r') as f:
            contract_data = json.load(f)
            f.close()
        file_list = delete_file_in_json(contract_data['data'], product_id, file_name)
        print(file_list)
        with open(os.path.join(dir_path, 'contract' + str(contract_id) + '.json'), 'w') as f:
            json_data = json.dumps(contract_data)
            f.write(json_data)
            f.close()
        os.remove(file_name)
        return jsonify({'status': 'success', 'message': 'File deleted successfully', 'files': file_list})
    except Exception as e:
        print(e)
        return jsonify({'status': 'error', 'message': str(e)})
    

@app.route('/saveProvider', methods=['POST'])
@jwt_required()    
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
    

@app.route('/deleteContract', methods=['GET'])
@jwt_required()
def delete_contract():
    try:
        id = request.args.get('contractId')
        db_delete_contract(id)
        dir_path = os.path.join(contract_folder, 'contract_' + str(id))
        files = os.listdir(dir_path)
        for file in files:
            os.remove(os.path.join(dir_path, file))
        os.rmdir(dir_path)
        contracts = get_contracts()
        return jsonify({'status': 'success', 'message': 'Contract deleted successfully', 'contracts': contracts})
    except Exception as e:
        print(e)
        return jsonify({'status': 'error', 'message': str(e)})
    

@app.route('/getProductList', methods=['GET'])
@jwt_required()
def get_product_list():
    try:
        id = request.args.get('contractId')
        dir_path = os.path.join(contract_folder, 'contract_' + str(id))
        with open(os.path.join(dir_path, 'contract' + str(id) + '.json'), 'r') as f:
            contract_data = json.load(f)
            f.close()
        products_from_json = []
        products_from_db = db_get_products_for_autocomplete()
        get_products_from_json(contract_data['data'], products_from_json)
        for p_json in products_from_json:
                products_from_db.append(p_json)
        return jsonify({'status': 'success', 'message': 'Product list got successfully', 'products': products_from_db})
    except Exception as e:
        print(e)
        return jsonify({'status': 'error', 'message': str(e)}) 


@app.route('/getProductInfo', methods=['GET'])
@jwt_required()
def get_product_info():
    try:
        contract_id = request.args.get('contractId')
        product_id = request.args.get('productId')
        product_type = request.args.get('productType')
        dir_path = os.path.join(contract_folder, 'contract_' + str(contract_id))
        print(contract_id, product_id, product_type, dir_path)
        with open(os.path.join(dir_path, 'contract' + str(contract_id) + '.json'), 'r') as f:
            contract_data = json.load(f)
            f.close()
        product = {'product': {}}
        if (product_type == 'json'):
            get_product_from_json(contract_data['data'], int(product_id), product)
        else:
            product['product'] = db_get_product_for_autocomplete(int(product_id))
            print(product['product'])
            product['product']['files'] = check_files(contract_id,  product['product']['files'])
            print(product['product'])
        return jsonify({'status': 'success', 'message': 'Product got successfully', 'product': product['product']})
    except Exception as e:
        print(e)
        return jsonify({'status': 'error', 'message': str(e)}) 



@app.route('/login', methods=['POST', 'GET'])
def login():
    return render_template('login.html')


@app.route('/loginUser', methods=['POST', 'GET'])
def login_user():
    try:
        username = request.form['username']
        password = request.form['password']
        checker = db_check_users(username)
        if checker[0]:
            if str(db_get_user_password(checker[1])[0]) == password:
                roles = db_get_user_role(checker[1])
                response = jsonify({'status': 'success', 'message': 'User logged successfully', 'url': '/'})
                access_token = create_access_token(identity={'username': username, 'roles': roles})
                set_access_cookies(response, access_token)
            else:
                response = jsonify({'status': 'fail', 'message': 'Ошибка! Неверный пароль.'})
        else:
            response = jsonify({'status': 'fail', 'message': 'Ошибка! Такого пользователя не существует.'})
        return response
    except Exception as e:
        print(e)
        return jsonify({'status': 'error', 'message': str(e)})  


@app.route('/checkProduct', methods=['GET'])
@jwt_required()
def check_product():
    try:
        id = request.args.get('contractId')
        my_prod = request.args.get('product')
        user_roles = get_jwt_identity()
        role_names = [item[1] for item in user_roles['roles']]
        if 'Администратор' not in role_names:
            dir_path = os.path.join(contract_folder, 'contract_' + str(id))
            with open(os.path.join(dir_path, 'contract' + str(id) + '.json'), 'r') as f:
                contract_data = json.load(f)
                f.close()
            main_products = db_get_role_allowed_products(user_roles['roles']) 
            condition = {'flag': False}
            allowed_prods = {'prods': []}
            for main_prod in main_products:
                get_allowed_prods_from_json(contract_data['data'], main_prod, allowed_prods)
                check_product_in_json(allowed_prods['prods'], my_prod, condition)
                if condition['flag'] == True or main_prod == my_prod:
                    return jsonify({'status': 'success', 'message': 'Product is allowed'})
            return jsonify({'status': 'fail', 'message': 'Product is not allowed'})
        else:
            return jsonify({'status': 'success', 'message': 'Product is allowed'})
    except Exception as e:
        print(e)
        return jsonify({'status': 'error', 'message': str(e)}) 

@app.route("/logout", methods=["GET"])
@jwt_required()
def logout():
    response = jsonify({'status': 'success', "message": "User logouted successfully", 'url': '/login'})
    unset_jwt_cookies(response)
    return response


@app.after_request
def refresh_expiring_jwts(response):
    try:
        exp_timestamp = get_jwt()["exp"]
        now = datetime.now()
        target_timestamp = datetime.timestamp(now + timedelta(hours=1))
        if target_timestamp > exp_timestamp:
            access_token = create_access_token(identity=get_jwt_identity())
            set_access_cookies(response, access_token)
        return response
    except (RuntimeError, KeyError):
        return response


@jwt.expired_token_loader
def my_expired_token_callback():
    return redirect(url_for('login'))


if __name__ == '__main__':
    app.run('192.168.0.78', 80)
    # app.run(debug=True)