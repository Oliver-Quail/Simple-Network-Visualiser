from . import app


@app.route("/api/register", methods=["POST"])
def sign_up():
    return "hello"