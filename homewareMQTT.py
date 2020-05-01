import requests
import json
import paho.mqtt.publish as publish
import paho.mqtt.client as mqtt
from data import Data

#Init the data managment object
hData = Data()

#Constants
TOPICS = ["device/control"]

########################### MQTT reader ###########################

def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))
    # Suscribe to topics
    for topic in TOPICS:
        client.subscribe(topic)

def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))

    if msg.topic in TOPICS:
        if msg.topic == "device/control":
            payload = json.loads(msg.payload)
            control(payload)
    else:
        print('Alert')

# MQTT reader
def mqttReader():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect("192.168.1.5", 1883, 60)
    client.loop_forever()

def control(payload):
    id = payload['id']
    param = payload['param']
    value = payload['value']
    intent = payload['intent']

    # Analyze the message
    if intent == 'execute':
        hData.updateParamStatus(id,param,value)
        publish.single("device/"+id, hData.getStatus()[id], hostname="localhost")
    elif intent == 'rules':
        hData.updateParamStatus(id,param,value)
    elif intent == 'request':
        publish.single("device/"+id, hData.getStatus()[id], hostname="localhost")



if __name__ == "__main__":
    print("Starting HomewareMQTT core")
    print('Version:',hData.getVersion()['version'])
    mqttReader()
