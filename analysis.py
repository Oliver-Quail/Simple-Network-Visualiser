import pyshark
from database import dataHandler
from datetime import datetime
import math

#file_location = input("Please enter the location of the pcap file: ")
file_location = "./samples/malware.pcap"

try:
    capture = pyshark.FileCapture(file_location)
    print("Loaded capture")
except FileNotFoundError:
    print("The file name you entered is invalid!")
    print("Exiting...")
    exit()


handler = dataHandler()

data = {}

keys = data.keys()

times = []

index = 0
for packet in capture:

    try:
        
        # fetch the source IP
        source_ip = packet.ip.src

        if source_ip not in keys:
            data[source_ip] = {}
            keys = data.keys()

        destination_ip = packet.ip.dst

        sniff_time = packet.sniff_time
        
        unix_time = sniff_time.timestamp()


        if math.floor(float(unix_time)) not in times:
            times.append(math.floor(float(unix_time)))
            print(math.floor(float(unix_time)))


        if destination_ip not in data[source_ip]:
            data[source_ip][destination_ip] = 0
        
        data[source_ip][destination_ip] += 1

    except:
        print("Packet did not contain IP address")
        continue
    
    index += 1

    if index >= 200:
        break
    
    
print(data)
