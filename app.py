import gspread
from flask import Flask, render_template, request
from google.oauth2.service_account import Credentials
import datetime as dt

app = Flask(__name__)

PRODUCTS = ["Alegra POS", "Alegra Contabilidad", "Alegra Nómina"]

SWITCH = '=SWITCH($E2, "0", "Negativo", "1", "Neutral", "2", "Positivo")'
SENTIMENT = "=sentiment()"
SUMMARY = "=summary()"

# Setup for the Google Sheets API
SCOPES = ["https://www.googleapis.com/auth/spreadsheets"]
creds = Credentials.from_service_account_file("./KEYS/alegra-feedback-032d95ea506d.json", scopes=SCOPES)
client = gspread.authorize(creds)
sheet = client.open_by_key("1llU1xHQS3loVhMLypi-ub3gym31dBz132xzm9ZSESmw").sheet1

# Ensure templates are auto-reloaded. For development purposes only.
app.config["TEMPLATES_AUTO_RELOAD"] = True

@app.route("/", methods=["POST", "GET"])
def index():
    if request.method == "POST":
        d = dt.datetime.now()
        currentTime = d.strftime("%Y-%m-%d %H:%M")

        name = sanitize(request.form.get("nombre"))
        if not name:
            name = "N/A"
        
        product = request.form.get("producto")
        if product not in PRODUCTS:
            return render_template("error.html", message="Error al seleccionar producto")
        
        comment = sanitize(request.form.get("comentario"))
        if not comment:
            return render_template("error.html", message="Error al registrar tu comentario")
        
        sheet.append_row([currentTime, product, comment, name, SENTIMENT, SWITCH, SUMMARY], value_input_option="USER_ENTERED")

        return render_template("success.html")
    if request.method == "GET":
        return render_template("index.html", PRODUCTS=PRODUCTS)


# Sanitizes the user input to prevent them from "injecting" a formula into the sheet
def sanitize(value):
    if value and value[0] in ("=", "+", "-", "@"):
        value = "'" + value
    return value