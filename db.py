import pymysql as ps

con = ps.connect(
    database="mydb",
    user="root",
    password="123",
    host="localhost",
    port=3306
)


def db_add_contact(data):
    cur = con.cursor()
    sql = '''INSERT INTO contact (name, phone) VALUES (%s, %s)'''
    cur.execute(sql, (data[0], data[1]))
    cur.close()
    con.commit()


def db_add_government_contract(data):
    cur = con.cursor()
    sql = '''INSERT INTO governmentcontract (number, innerNumber, city, startDate, endDate, isActive) VALUES (%s, %s, %s, %s, %s, %s)'''
    cur.execute(sql, (data['number'], data['innerNumber'], data['city'], data['startDate'], data['endDate'], 1))
    cur.close()
    con.commit()
    cur = con.cursor()
    sql = '''SELECT id FROM governmentcontract WHERE number=%s AND innerNumber=%s'''
    cur.execute(sql, (data['number'], data['innerNumber']))
    contract_id = cur.fetchone()
    cur.close()
    return contract_id

def db_add_product_contract_list(contract_id, product_id_list):
    for prod_id in product_id_list:
        cur = con.cursor()
        sql = '''INSERT INTO productcontractlist (idGovernmentContract, idProduct) VALUES (%s, %s)'''
        cur.execute(sql, (contract_id, prod_id))
        cur.close()
        con.commit()

def db_get_government_contracts():
    cur = con.cursor()
    sql = '''SELECT * FROM governmentcontract'''
    cur.execute(sql)
    contracts = cur.fetchall()
    cur.close()
    if contracts[0]:
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
    childs = cur.fetchall()
    childsData = list()
    for i in childs:
        tmp = db_get_product(i)
        if tmp[0]:
            childsData.append(tmp[1])
    cur.close()
    return childsData


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



def db_add_product(data, parentId=None):
    cur = con.cursor()
    sql = '''INSERT INTO product (name, code, number, companyId, typeId, stateId, count, description)
                VALUES (%s, %s, %s, %s, %s, %s, %s, %s)'''
    cur.execute(sql, (data[0], data[1], data[2], data[3],
                data[4], data[5], data[6], data[7]))
    if parentId:
        sql = '''SELECT idProduct FROM product WHERE name=%s'''
        cur.execute(sql, (data[0],))
        childId = cur.fetchone()

        sql = '''INSERT INTO parentchildlist (idParent, idChild) VALUES (%s, %s)'''
        cur.execute(sql, (parentId, childId))
    cur.close()
    con.commit()


def db_add_child(parentId, childId):
    cur = con.cursor()
    sql = '''INSERT INTO parentchildlist (idParent, idChild) VALUES (%s, %s)'''
    cur.execute(sql, (parentId, childId))
    cur.close()
    con.commit()


def db_get_product_state(id):
    cur = con.cursor()
    sql = '''SELECT description FROM product_state WHERE idProductState=%s'''
    cur.execute(sql, (id,))
    state = cur.fetchone()
    cur.close()
    return state


def db_get_product_type(id):
    cur = con.cursor()
    sql = '''SELECT description FROM product_type WHERE idProductType=%s'''
    cur.execute(sql, (id,))
    type = cur.fetchone()
    cur.close()
    return type


