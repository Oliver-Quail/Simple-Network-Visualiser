from . import app
import sqlite3



class InterceptRequestMiddleware:
    def __init__(self, wsgi_app):
        self.wsgi_app = wsgi_app

    def __call__(self, environ, start_response):
        environ['Access-Control-Allow-Origin'] = '*'
        return self.wsgi_app(environ, start_response)





@app.route("/test", methods=["GET"])
def start():
    return "hello"





@app.route("/api/network", methods=["GET"])
def getNetworkTraffic():
    connection = sqlite3.connect("Simple-Network-Visualiser/analysis.db")
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM data;")
    return cursor.fetchall()


@app.route("/api/nodes", methods=["GET"])
def getNodes():
    connection = sqlite3.connect("Simple-Network-Visualiser/analysis.db")
    cursor = connection.cursor()
    cursor.execute("SELECT DISTINCT d.source, d.destination, dns.common_name FROM data d LEFT JOIN dns_records dns ON d.destination = dns.ip_address;")
    return cursor.fetchall()

