import logging
from app_init import create_initialized_flask_app

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = create_initialized_flask_app()

if __name__ == "__main__":
    # Run the Flask app using the built-in server on 0.0.0.0:8080.
    app.run(host="0.0.0.0", port=8080, threaded=True)
