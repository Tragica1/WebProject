import pymysql as ps

con = ps.connect(
    database="mydb",
    user="root",
    password="1234",
    host="localhost",
    port=3306
)

def db_add_localcontract(startDate, endDate):
    cur = con.cursor()
    sql = '''INSERT INTO localcontract (startDate, endDate) VALUES (%s, %s)'''
    cur.execute(sql, (startDate, endDate))
    cur.execute('''SELECT LAST_INSERT_ID()''')
    contract_id = cur.fetchone()
    con.commit()
    cur.close()
    return(contract_id)
    


def db_get_localcontract(contract_id):
    cur = con.cursor()
    sql = '''SELECT localcontract.startDate, localcontract.endDate, companycontractlist.idCompany FROM localcontract JOIN companycontractlist ON localContract.id=%s AND companycontractlist.idContract=%s'''
    cur.execute(sql, (contract_id, contract_id))
    localcontract = cur.fetchone()
    cur.close()
    return localcontract


def db_get_companies():
    cur = con.cursor()
    sql = '''SELECT * FROM company'''
    cur.execute(sql)
    companies = cur.fetchall()
    cur.close()
    return companies


def db_get_company_contacts(company_id):
    cur = con.cursor()
    sql = '''SELECT idContact FROM contactcompanylist WHERE idCompany=%s'''
    cur.execute(sql, (company_id,))
    contacts_id = cur.fetchall()
    contacts = []
    for id in contacts_id:
        sql = '''SELECT * FROM contact WHERE id=%s'''
        cur.execute(sql, (id,))
        tmp = cur.fetchone()
        contacts.append(tmp)
    cur.close()
    return contacts


def db_get_states():
    cur = con.cursor()
    sql = '''SELECT * FROM state'''
    cur.execute(sql)
    states = cur.fetchall()
    cur.close()
    return states


def db_get_state(state_id):
    cur = con.cursor()
    sql = '''SELECT name FROM state WHERE id=%s'''
    cur.execute(sql, (state_id,))
    state = cur.fetchone()
    cur.close()
    return state
    

def db_get_types():
    cur = con.cursor()
    sql = '''SELECT * FROM type'''
    cur.execute(sql)
    types = cur.fetchall()
    cur.close()
    return types


def db_get_type(type_id):
    cur = con.cursor()
    sql = '''SELECT name FROM type WHERE id=%s'''
    cur.execute(sql, (type_id,))
    type = cur.fetchone()
    cur.close()
    return type


def db_get_contract_types():
    cur = con.cursor()
    sql = '''SELECT * FROM contracttype'''
    cur.execute(sql)
    types = cur.fetchall()
    cur.close()
    return types


def db_get_contract_type(type_id):
    cur = con.cursor()
    sql = '''SELECT name FROM contracttype WHERE id=%s'''
    cur.execute(sql, (type_id,))
    type = cur.fetchall()
    cur.close()
    return type


def db_add_contact(data):
    cur = con.cursor()
    sql = '''INSERT INTO contact (name, phone) VALUES (%s, %s)'''
    cur.execute(sql, (data[0], data[1]))
    cur.close()
    con.commit()


def db_add_government_contract(data):
    cur = con.cursor()
    sql = '''INSERT INTO governmentcontract (number, innerNumber, city, startDate, endDate, isActive, idType, idStatus) VALUES (%s, %s, %s, %s, %s, %s, %s, %s)'''
    cur.execute(sql, (data['number'], data['innerNumber'], data['city'], data['startDate'], data['endDate'], 1, int(data['contractType']), int(data['contractStatus'])))
    cur.execute('''SELECT LAST_INSERT_ID()''')
    contract_id = cur.fetchone()
    con.commit()
    cur.close()
    return contract_id


def db_add_product_contract_list(contract_id, product_id_list):
    for prod_id in product_id_list:
        cur = con.cursor()
        sql = '''INSERT INTO productcontractlist (idGovernmentContract, idProduct) VALUES (%s, %s)'''
        cur.execute(sql, (contract_id, prod_id))
        cur.close()
        con.commit()


def db_get_product_contract_list(contract_id):
    cur = con.cursor()
    sql = '''SELECT idProduct FROM productcontractlist WHERE idGovernmentContract=%s'''
    cur.execute(sql, (contract_id,))
    result = cur.fetchall()
    cur.close()
    return result


def db_get_government_contract(id):
    cur = con.cursor()
    sql = '''SELECT governmentcontract.number, governmentcontract.innerNumber, governmentcontract.city, governmentcontract.startDate, governmentcontract.endDate, contracttype.name, contractstatus.name FROM governmentcontract JOIN contracttype ON contracttype.id=governmentcontract.idType JOIN contractstatus ON contractstatus.id=governmentcontract.idStatus WHERE governmentcontract.id=%s'''
    cur.execute(sql, (id,))
    contract = cur.fetchone()
    cur.close()
    if contract:
        return [True, contract]
    else:
        return [False, None]


def db_get_government_contracts():
    cur = con.cursor()
    sql = '''SELECT governmentcontract.id, governmentcontract.number, governmentcontract.innerNumber, governmentcontract.city, governmentcontract.startDate, governmentcontract.endDate, governmentcontract.isActive, contracttype.name, contractstatus.name FROM governmentcontract JOIN contracttype ON contracttype.id=governmentcontract.idType JOIN contractstatus ON contractstatus.id=governmentcontract.idStatus'''
    cur.execute(sql)
    contracts = cur.fetchall()
    cur.close()
    if contracts:
        return [True, contracts]
    else:
        return [False, None]


def db_get_contract(id):
    cur = con.cursor()
    sql = '''SELECT * FROM contract WHERE idContract=%s'''
    cur.execute(sql, (id,))
    contract = cur.fetchone()
    cur.close()
    if contract[0]:
        return [True, contract]
    else:
        return [False, None]


def db_get_products():
    cur = con.cursor()
    sql = '''SELECT * FROM product'''
    cur.execute(sql)
    product = cur.fetchall()
    cur.close()
    if product[0]:
        return [True, product]
    else:
        return [False, None]
    

def db_get_products_for_autocomplete():
    cur = con.cursor()
    sql = '''SELECT id, name FROM product'''
    cur.execute(sql)
    products = cur.fetchall()
    result = []
    for p in products:
        result.append({'id': int(p[0]), 'name': p[1], 'type': 'db'})
    cur.close()
    return result


def db_get_product_for_autocomplete(id):
    cur = con.cursor()
    sql = '''SELECT * FROM product WHERE id=%s'''
    cur.execute(sql, (id,))
    product = cur.fetchone()
    cur.close()
    return {
        'name': product[1],
        'code': product[2],
        'number': product[3],
        'count': product[5],
        'idType': product[6],
        'idState': product[7],
        'isContract': product[8],
        'idProvider': None,
        'start': product[9],
        'end': product[10],
        'note': product[11],
        'files': [],
        'children': []
    }


def db_get_product(id):
    cur = con.cursor()
    sql = '''SELECT * FROM product WHERE id=%s'''
    cur.execute(sql, (id,))
    product = cur.fetchone()
    cur.close()
    if product[0]:
        return [True, product]
    else:
        return [False, None]


def db_get_product_children(id):
    cur = con.cursor()
    sql = '''SELECT idChild FROM parentchildlist WHERE idParent=%s'''
    cur.execute(sql, (id,))
    children = cur.fetchall()
    childrenData = list()
    for child in children:
        tmp = db_get_product(child)
        if tmp[0]:
            childrenData.append(tmp[1])
    cur.close()
    return childrenData


def db_has_children(id):
    cur = con.cursor()
    sql = '''SELECT idChild FROM parentchildlist WHERE idParent=%s'''
    cur.execute(sql, (id,))
    childs = cur.fetchall()
    if childs:
        return True
    else:
        return False


def db_is_child(id):
    cur = con.cursor()
    sql = '''SELECT idChild FROM parentchildlist'''
    cur.execute(sql)
    tmp = cur.fetchall()
    lst = []
    for i in tmp:
        lst.append(i[0])
    if id in lst:
        return True
    else:
        return False


def db_get_product_child():
    cur = con.cursor()
    sql = '''SELECT * FROM parentchildlist'''
    cur.execute(sql)
    data = cur.fetchall()
    if data:
        return [True, data]
    else:
        return [False, None]


def db_add_company_contract_list(company_id, contract_id):
    cur = con.cursor()
    sql = '''INSERT INTO companycontractlist (idCompany, idContract) VALUES (%s, %s)'''
    cur.execute(sql, (company_id, contract_id))
    cur.close()
    con.commit()


def db_add_product(data):
    cur = con.cursor()
    if  data['start'] == '':
        data['start'] = None
    if  data['end'] == '':
        data['end'] = None
    if data['idProvider'] == 0:
        data['idProvider'] = None
    sql = '''INSERT INTO product (name, code, number, isMain, count, idType, idState, idCompany, startDate, endDate, note)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)'''
    cur.execute(sql, (str(data['name']), str(data['code']), str(data['number']), int(data['isMain']),
                int(data['count']), int(data['idType']), int(data['idState']), data['idProvider'],
                data['start'], data['end'], data['note']))
    cur.execute('''SELECT LAST_INSERT_ID()''')
    product_id = cur.fetchone()
    cur.close()
    con.commit()
    return product_id


def db_update_product(data, contract_id=None):
    cur = con.cursor()
    sql = '''UPDATE product SET number=%s, idType=%s, count=%s, idLocalContract=%s, idState=%s WHERE id=%s'''
    cur.execute(sql, (int(data['number']), int(data['type']), int(data['count']), contract_id, int(data['state']), int(data['id'])))
    cur.close()
    con.commit()


def db_add_child(parentId, childId):
    cur = con.cursor()
    sql = '''INSERT INTO parentchildlist (idParent, idChild) VALUES (%s, %s)'''
    cur.execute(sql, (parentId, childId))
    cur.close()
    con.commit()


def db_add_company(name, address):
    cur = con.cursor()
    sql = '''INSERT INTO company (name, address) VALUES (%s, %s)'''
    cur.execute(sql, (name, address))
    cur.execute('''SELECT LAST_INSERT_ID()''')
    company_id = cur.fetchone()
    cur.close()
    con.commit()
    return company_id


def db_add_contact(name, number):
    cur = con.cursor()
    sql = '''INSERT INTO contact (name, number) VALUES (%s, %s)'''
    cur.execute(sql, (name, number))
    cur.execute('''SELECT LAST_INSERT_ID()''')
    contact_id = cur.fetchone()
    cur.close()
    con.commit()
    return contact_id


def db_add_contact_company_list(contact_id, company_id):
    cur = con.cursor()
    sql = '''INSERT INTO contactcompanylist (idContact, idCompany) VALUES (%s, %s)'''
    cur.execute(sql, (contact_id, company_id))
    cur.close()
    con.commit()


def db_delete_contract(contract_id):
    cur = con.cursor()
    sql = '''DELETE FROM productcontractlist WHERE idGovernmentContract=%s'''
    cur.execute(sql, (contract_id,))
    sql = '''DELETE FROM governmentcontract WHERE id=%s'''
    cur.execute(sql, (contract_id,))
    cur.close()
    con.commit()


def db_add_files(name):
    cur = con.cursor()
    sql = '''INSERT INTO file (name) VALUES (%s)'''
    cur.execute(sql, (name,))
    cur.execute('''SELECT LAST_INSERT_ID()''')
    file_id = cur.fetchone()
    cur.close()
    con.commit()
    return file_id


def db_add_product_file_list(file_id, prod_id):
    cur = con.cursor()
    sql = '''INSERT INTO productfilelist (idProduct, idFile) VALUES (%s, %s)'''
    cur.execute(sql, (prod_id, file_id))
    cur.close()
    con.commit()