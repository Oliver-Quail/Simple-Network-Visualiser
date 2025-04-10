import os
import platform

enviroment = "python"

if platform.system() != "Windows":
    enviroment = "python3"

os.system("pip install venv")
os.system(enviroment + " -m venv .venv")

if platform.system() == "Windows":
    os.system("./.venv/Scripts/activate.ps1")
else:
    os.system("source ./.venv/bin/activate")

os.system("pip install pyshark")
os.system("mkdir samples")
#os.system("python")