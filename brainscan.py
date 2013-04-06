import logging
import time
import pprint
import datetime
import sys
import os
import json
import urllib2
import base64
import httplib2 as http
import serial
import json
import string
import pymongo

#third party libs
from daemon import runner
from datetime import datetime
from os import environ
from config import Config
from pymongo import Connection


class App():
   
    def __init__(self):
        self.stdin_path = '/dev/null'
        self.stdout_path = '/dev/tty'
        self.stderr_path = '/dev/tty'
        self.pidfile_path =  '/var/run/brainscan.pid'
        self.pidfile_timeout = 5
        
        self.connection = Connection('localhost', 27017)
        self.usb = '/dev/ttyUSB0'
        self.db = self.connection.brainscan
        self.waves = self.db.waves
        
    def run(self):
        
        try:

            while True:
                ##\x00
                ser = serial.Serial(self.usb, 9600)
                s = ser.readline().strip()
                ar = s.split(',')
                
                if len(ar) == 11 and '\x00' not in ar[0]:
                    pprint.pprint(ar)
                    
                    data = {
                        'datetime' : datetime.now().isoformat(' '),
                        'date_struct' : {
                                    'date_year' : datetime.now().strftime("%Y"),
                                    'date_month' : datetime.now().strftime("%m"),
                                    'date_day' : datetime.now().strftime("%d"),
                                    'date_hour' : datetime.now().strftime("%H"),
                                    'date_min' : datetime.now().strftime("%M"),
                                    'date_sec' : datetime.now().strftime("%s")
                                },
                        'data' : ar
                    }
                    
                    self.waves.insert(data)
                
        except:
            self.log('Global', 'brainscan', "Uncaught Exception: " + str(sys.exc_info()), 'error')


    def log(self, guid, action, msg, level = 'event'):
        pprint.pprint(action + ': ' + msg)
        if level == 'event':
            logger.info(action + ': ' + msg)
        elif level == 'error':
            logger.error(action + ': ' + msg)

app = App()
logger = logging.getLogger("DaemonLog")
logger.setLevel(logging.DEBUG)
formatter = logging.Formatter("%(asctime)s - %(name)s - %(levelname)s - %(message)s")
handler = logging.FileHandler("/var/log/brainscan.log")
handler.setFormatter(formatter)
logger.addHandler(handler)

daemon_runner = runner.DaemonRunner(app)
#This ensures that the logger file handle does not get closed during daemonization
daemon_runner.daemon_context.files_preserve=[handler.stream]
daemon_runner.do_action()