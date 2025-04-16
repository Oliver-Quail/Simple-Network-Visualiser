from scapy.all import *



for packet in PcapReader('samples/malware.pcap'):
    if IP in packet:
        print("a")