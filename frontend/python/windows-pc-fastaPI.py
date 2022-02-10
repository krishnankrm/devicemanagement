from json.encoder import JSONEncoder
from fastapi import FastAPI,Request
import uvicorn
import json
import csv
from fastapi.middleware.cors import CORSMiddleware
from datetime import date
import psutil
import shutil
import os, string
import subprocess as sp
import urllib.request


app = FastAPI()
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


obj_Disk = psutil.disk_usage('/')


def connect(host='http://google.com'):
    try:
        urllib.request.urlopen(host)
        return True
    except:
        return False


@app.get("/status")
async def root():
    b={}
    available_drives = ['%s:' % d for d in string.ascii_uppercase if os.path.exists('%s:' % d)]
    print('Available drives are ',available_drives)
    b['Available_drives']=available_drives
    print(' ')
    print('The CPU utilization is: ', psutil.cpu_percent(2))
    b['CPU Utilization']=psutil.cpu_percent(2)

    print(' ')
    # print('RAM memory % used:', psutil.virtual_memory()[2])
    print('RAM memory Free:', float("{:.2f}".format(psutil.virtual_memory()[3]/ (1024.0 ** 3))),' GB')
    print('RAM memory Total:', float("{:.2f}".format(psutil.virtual_memory()[0]/ (1024.0 ** 3))),' GB')
    print('RAM memory Available:', float("{:.2f}".format(psutil.virtual_memory()[1]/ (1024.0 ** 3))),' GB')
    b['RAM memory Free']=str(float("{:.2f}".format(psutil.virtual_memory()[3]/ (1024.0 ** 3))))+' GB'
    b['RAM memory Total']=str(float("{:.2f}".format(psutil.virtual_memory()[0]/ (1024.0 ** 3))))+' GB'
    b['RAM memory Available']=str(float("{:.2f}".format(psutil.virtual_memory()[1]/ (1024.0 ** 3))))+' GB'
    print('')

    sysTotal=int(0)
    sysused=int(0)
    sysFree=int(0)


    for i in available_drives:
        print(i)
        total, used, free = shutil.disk_usage(i)
        sysTotal+=total
        sysused+=used
        sysFree+=free
        print("Total Hard-disk %s drive: %d GB" %(i,total // (2**30)*1.07374))
        print("Used Hard-disk %s drive: %d GB" %(i,used // (2**30)*1.07374))
        print("Free Hard-disk %s drive: %d GB" %(i,free // (2**30)*1.07374))
        print(' ')

    print("Total Hard-disk of the entire system: %d GB" %(sysTotal // (2**30)*1.07374))
    print("Used Hard-disk of the entire system: %d GB" %(sysused // (2**30)*1.07374))
    print("Free Hard-disk of the entire system: %d GB" %(sysFree // (2**30)*1.07374))

    b['Total Hard-disk']=str("{:.2f}".format(sysTotal // (2**30)*1.07374))+' GB'
    b['Used Hard-disk']=str("{:.2f}".format(sysused // (2**30)*1.07374))+' GB'
    b['Free Hard-disk']=str("{:.2f}".format(sysFree // (2**30)*1.07374))+' GB'
    print(' ')

    print("CPU Statistics  Interrupts", psutil.cpu_stats().interrupts)
    b['CPU Statistics Interrupts']=psutil.cpu_stats().interrupts
    print(' ')


    print( 'Internet connected' if connect() else 'No internet!' )
    if connect():
        b['Internet Status']='Connected'
    else:
        b['Internet Status']='Disconnected'

    print(' ')
    return(b)

 

@app.get("/logoff")
async def root():
    os.system("shutdown -l")

@app.get("/shutdown")
async def root():
    os.system('shutdown -s')

@app.post("/ping")
async def root(request:Request):
    hostname =(await request.json())['ip']
    
    response = os.system("ping -c 1 " + hostname)
    if response == 0:
        return('Connected')
    else:
        return('Not Connected')

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=9000)
