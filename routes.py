import logging
from flask import render_template
from flask import current_app as app

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def register_routes(app):
    @app.route("/")
    def home_route():
        return render_template("home.html")

    @app.route("/binary-operations")
    def binary_operations_route():
        return render_template("binary_operations.html")

    @app.route("/number-conversion")
    def number_conversion_route():
        return render_template("number_conversion.html")

    