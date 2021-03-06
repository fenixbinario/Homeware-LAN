import time
from datetime import datetime
import json
import requests
from base64 import b64encode
from data import Data

#Init the data managment object
hData = Data()

hData.setVerbose(True)

def verifyTasks():
    tasks = hData.getTasks()
    status = hData.getStatus()

    for taskData in tasks:
        triggers = taskData['triggers']
        try:
            execution_value = operationExecutor('trigger', triggers, status)
            # print(taskData['title'], execution_value, sep=": ")
            if execution_value:
                for target in taskData['target']:
                    hData.updateParamStatus(target['device'], target['param'], target['value'])


        except Exception as e:
            hData.log('Alert', 'Catch an error on execution of' + taskData['title'] + 'task' + str(e))

def ddnsUpdater():
    ddns = hData.getDDNS()
    ipServer = 'http://ip1.dynupdate.no-ip.com/'
    if ddns['enabled']:

        ipRequest = requests.get(url=ipServer)
        newIP = ipRequest.text
        if not newIP == ddns['ip']:

            noipServer = 'https://dynupdate.no-ip.com/nic/update'
            params = {
                'hostname': ddns['hostname'],
                'myip': newIP
            }
            user = ddns['username'] + ':' + ddns['password']
            userEncoded = str(b64encode(bytes(user, 'utf-8')))
            headers = {
                'User-Agent': 'Homeware Homeware/v{} hola@rinconingenieril.es'.format(hData.getVersion()['version']),
                'Authorization': 'Basic ' + userEncoded[2:len(userEncoded)-1]
            }
            noipRequest = requests.get(url= noipServer, params=params, headers=headers)
            #Analyze the response
            code = noipRequest.text.split(' ')[0]
            hData.log('Log', 'IP update request sended to no-ip. Response: ' + noipRequest.text)
            status = {
                'good': 'Running',
                'nochg': 'Running, but the last request shouldn\'t have been done.',
                'nohost': 'Host name does not exists',
                'badauth': 'Invalid username and/or password',
                'badagent': 'Bad agent. Please open an issue on the Homeware-LAN github and do not enable the DDNS funtionality.',
                '!donator': 'Not donator. Please open an issue on the Homeware-LAN github and do not enable the DDNS funtionality.',
                'abuse': 'User blocked due to abuse',
                '911': 'Something goes wrong. Do not enabled until 30 minutes has pass.'
            }
            now = datetime.now()
            last = str(now.strftime("%m/%d/%Y, %H:%M:%S"))
            if not 'good' in code and not 'nochg' in code:
                code = noipRequest.text.split('\r')[0]
                hData.updateDDNS(newIP, status[code], code, False, last)
            else:
                hData.updateDDNS(newIP, status[code], code, True, last)

def operationExecutor(id, triggers, status):
    operation = triggers[str(id)]
    if operation['type'] == "d2b":
        return d2bExecutor(operation['operation'], status)
    elif operation['type'] == "d2d":
        return d2dExecutor(operation['operation'], status)
    elif operation['type'] == "d2i":
        return d2iExecutor(operation['operation'], status)
    elif operation['type'] == "d2l":
        return d2lExecutor(operation['operation'], status)
    elif operation['type'] == "time":
        return timeExecutor(operation['operation'])
    elif operation['type'] == "or":
        return orExecutor(operation['operation'], triggers, status)
    elif operation['type'] == "and":
        return andExecutor(operation['operation'], triggers, status)

def orExecutor(ids, triggers, status):
    execution_values = []
    for id in ids:
        execution_values.append(operationExecutor(id, triggers, status))
    return any(execution_values)

def andExecutor(ids, triggers, status):
    execution_values = []
    for id in ids:
        execution_values.append(operationExecutor(id, triggers, status))
    return all(execution_values)

def d2bExecutor(operation, status):
    op = operation.split(':')
    device = op[0]
    param = op[1]
    sign = op[2]
    value = True if op[3] == "true" else False

    if sign == '=' and status[device][param] == value:
        return True
    else:
        return False

def d2iExecutor(operation, status):
    op = operation.split(':')
    device = op[0]
    param = op[1]
    sign = op[2]
    value = 0
    try:
        value = int(op[3])
    except:
        hData.log('Alert', device + param + value + 'is not an int')

    if sign == '=' and status[device][param] == value:
        return True
    elif sign == '<' and status[device][param] < value:
        return True
    elif sign == '>' and status[device][param] > value:
        return True
    elif sign == '<=' and status[device][param] <= value:
        return True
    elif sign == '>=' and status[device][param] >= value:
        return True
    else:
        return False

def d2lExecutor(operation, status):
    op = operation.split(':')
    device = op[0]
    param = op[1]
    sign = op[2]
    value = ""

    try:
        value = str(op[3])
    except:
        hData.log('Alert', device + param + value + 'is not an string')

    if sign == '=' and status[device][param] == value:
        return True
    elif sign == '<' and status[device][param] < value:
        return True
    elif sign == '>' and status[device][param] > value:
        return True
    elif sign == '<=' and status[device][param] <= value:
        return True
    elif sign == '>=' and status[device][param] >= value:
        return True
    else:
        return False

def d2dExecutor(operation, status):
    op = operation.split(':')
    device_a = op[0]
    param_a = op[1]
    sign = op[2]
    device_b = op[3]
    param_b = op[4]

    if sign == '=' and status[device_a][param_a] == status[device_b][param_b]:
        return True
    elif sign == '<' and status[device_a][param_a] < status[device_b][param_b]:
        return True
    elif sign == '>' and status[device_a][param_a] > status[device_b][param_b]:
        return True
    elif sign == '<=' and status[device_a][param_a] <= status[device_b][param_b]:
        return True
    elif sign == '>=' and status[device_a][param_a] >= status[device_b][param_b]:
        return True
    else:
        return False

def timeExecutor(operation):
    op = operation.split(':')
    h_op = int(op[0])
    m_op = int(op[1])
    w_op = op[2]
    ts = time.localtime(time.time())
    h = ts.tm_hour
    m = ts.tm_min
    pw = ts.tm_wday
    week = [1,2,3,4,5,6,0]
    w = str(week[pw])

    if h == h_op and m == m_op and w in w_op:
        return True
    else:
        return False


if __name__ == "__main__":
    hData.log('Log', 'Starting HomewareTask core')
    while(True):
        ddnsUpdater()
        verifyTasks()
        hData.updateAlive('tasks')
        time.sleep(1)
