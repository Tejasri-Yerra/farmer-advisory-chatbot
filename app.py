from flask import Flask, render_template, request, jsonify
from data.farmer_faq import FARMER_FAQ

app = Flask(__name__)

WELCOME_MESSAGE = (
    "Welcome to Farmer Advisory Chatbot 🌾\n"
    "Ask about crops, soil, irrigation, fertilizers, pests and schemes."
)

def intelligent_reply(user_msg):
    user_msg = user_msg.lower()

    for key, answer in FARMER_FAQ.items():
        if key in user_msg or user_msg in key:
            return answer

    return (
        "Thank you for your question 🌱\n"
        "Please ask about crops, kharif, rabi, soil or irrigation."
    )


@app.route("/")
def home():
    return render_template("index.html", welcome=WELCOME_MESSAGE)

@app.route("/chat", methods=["POST"])
def chat():
    msg = request.json.get("message", "")
    reply = intelligent_reply(msg)
    return jsonify({"reply": reply})

if __name__ == "__main__":
    app.run(debug=True)
