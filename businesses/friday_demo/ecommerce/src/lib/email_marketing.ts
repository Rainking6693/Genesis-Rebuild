Okay, I'm ready to build the `email_marketing` application. Here's the plan and the generated production code.

**Plan:**

The `email_marketing` application will have the following core functionalities:

1.  **User Management:**
    *   Allow users to sign up and create accounts.
    *   Allow users to log in and log out.
    *   Store user information securely (e.g., using password hashing).

2.  **List Management:**
    *   Allow users to create and manage email lists.
    *   Allow users to import contacts (email addresses) into lists (e.g., from CSV).
    *   Allow users to add contacts manually.

3.  **Campaign Management:**
    *   Allow users to create email campaigns.
    *   Allow users to design email templates using a simple editor (plain text or basic HTML).
    *   Allow users to select the target list for a campaign.
    *   Allow users to schedule campaigns to be sent at a specific time.

4.  **Sending Emails:**
    *   Handle the actual sending of emails (using a library like `smtplib` or a service like SendGrid/Mailgun).
    *   Implement throttling to avoid being marked as spam.
    *   Track email sending status (sent, failed).

5.  **Reporting:**
    *   Track campaign performance (e.g., number of emails sent, delivery rate, open rate, click-through rate).

**Technology Stack:**

*   **Backend:** Python (Flask or Django)
*   **Database:** SQLite (for simplicity, can be easily switched to PostgreSQL or MySQL)
*   **Frontend:** HTML, CSS, JavaScript (basic, no complex framework initially)
*   **Email Sending:** `smtplib` (for basic sending) or a transactional email service (SendGrid, Mailgun, AWS SES)

**Production Code:**

Here's a basic Flask-based implementation.  This is a starting point, and many features are simplified or omitted for brevity.

```python
# app.py
from flask import Flask, render_template, request, redirect, url_for, session
import sqlite3
import hashlib
import os
import smtplib
from email.mime.text import MIMEText
from datetime import datetime
import csv

app = Flask(__name__)
app.secret_key = os.urandom(24)  # Change this in a real production environment!

DATABASE = 'email_marketing.db'

# Database initialization
def create_db():
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS email_lists (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            list_id INTEGER NOT NULL,
            email TEXT NOT NULL,
            FOREIGN KEY (list_id) REFERENCES email_lists (id)
        )
    ''')
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS campaigns (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            list_id INTEGER NOT NULL,
            name TEXT NOT NULL,
            subject TEXT NOT NULL,
            body TEXT NOT NULL,
            scheduled_time DATETIME,
            status TEXT DEFAULT 'pending',
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (list_id) REFERENCES email_lists (id)
        )
    ''')
    conn.commit()
    conn.close()

create_db()

# Helper functions
def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # Return rows as dictionaries
    return conn

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Email Sending (Basic - replace with a proper service)
def send_email(recipient, subject, body):
    sender_email = "your_email@example.com"  # Replace with your email
    sender_password = "your_password"       # Replace with your password (or use app password)

    message = MIMEText(body)
    message['Subject'] = subject
    message['From'] = sender_email
    message['To'] = recipient

    try:
        with smtplib.SMTP_SSL('smtp.gmail.com', 465) as server:  # Replace with your SMTP server
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, recipient, message.as_string())
        return True
    except Exception as e:
        print(f"Email sending failed: {e}")
        return False

# Routes

@app.route('/')
def index():
    if 'user_id' in session:
        return render_template('dashboard.html')
    return redirect(url_for('login'))

@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        email = request.form['email']

        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if username or email already exists
        cursor.execute("SELECT id FROM users WHERE username = ? OR email = ?", (username, email))
        existing_user = cursor.fetchone()

        if existing_user:
            conn.close()
            return render_template('register.html', error="Username or email already exists.")

        hashed_password = hash_password(password)
        try:
            cursor.execute("INSERT INTO users (username, password, email) VALUES (?, ?, ?)", (username, hashed_password, email))
            conn.commit()
            conn.close()
            return redirect(url_for('login'))
        except sqlite3.Error as e:
            conn.close()
            return render_template('register.html', error=f"Database error: {e}")

    return render_template('register.html')


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        hashed_password = hash_password(password)

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("SELECT id FROM users WHERE username = ? AND password = ?", (username, hashed_password))
        user = cursor.fetchone()
        conn.close()

        if user:
            session['user_id'] = user['id']
            return redirect(url_for('index'))
        else:
            return render_template('login.html', error='Invalid username or password')

    return render_template('login.html')


@app.route('/logout')
def logout():
    session.pop('user_id', None)
    return redirect(url_for('login'))

@app.route('/lists')
def lists():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM email_lists WHERE user_id = ?", (session['user_id'],))
    lists = cursor.fetchall()
    conn.close()

    return render_template('lists.html', lists=lists)

@app.route('/lists/create', methods=['GET', 'POST'])
def create_list():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    if request.method == 'POST':
        name = request.form['name']

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO email_lists (user_id, name) VALUES (?, ?)", (session['user_id'], name))
        conn.commit()
        conn.close()
        return redirect(url_for('lists'))

    return render_template('create_list.html')

@app.route('/lists/<int:list_id>')
def list_detail(list_id):
    if 'user_id' not in session:
        return redirect(url_for('login'))

    conn = get_db_connection()
    cursor = conn.cursor()

    #Check if the list belongs to the user
    cursor.execute("SELECT user_id FROM email_lists WHERE id = ?", (list_id,))
    list_owner = cursor.fetchone()

    if not list_owner or list_owner['user_id'] != session['user_id']:
        conn.close()
        return "Unauthorized", 403

    cursor.execute("SELECT * FROM contacts WHERE list_id = ?", (list_id,))
    contacts = cursor.fetchall()

    cursor.execute("SELECT name FROM email_lists WHERE id = ?", (list_id,))
    list_name = cursor.fetchone()['name']

    conn.close()
    return render_template('list_detail.html', contacts=contacts, list_id=list_id, list_name=list_name)

@app.route('/lists/<int:list_id>/add_contact', methods=['POST'])
def add_contact(list_id):
    if 'user_id' not in session:
        return redirect(url_for('login'))

    email = request.form['email']

    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if the list belongs to the user.  (Duplicate check, but important)
    cursor.execute("SELECT user_id FROM email_lists WHERE id = ?", (list_id,))
    list_owner = cursor.fetchone()

    if not list_owner or list_owner['user_id'] != session['user_id']:
        conn.close()
        return "Unauthorized", 403

    try:
        cursor.execute("INSERT INTO contacts (list_id, email) VALUES (?, ?)", (list_id, email))
        conn.commit()
    except sqlite3.IntegrityError:
        # Handle duplicate emails in the list (optional)
        print("Duplicate email attempted.")
    finally:
        conn.close()

    return redirect(url_for('list_detail', list_id=list_id))

@app.route('/lists/<int:list_id>/import_contacts', methods=['POST'])
def import_contacts(list_id):
    if 'user_id' not in session:
        return redirect(url_for('login'))

    if 'file' not in request.files:
        return redirect(request.url)  # Redirect back to the same page

    file = request.files['file']

    if file.filename == '':
        return redirect(request.url)

    if file and file.filename.endswith('.csv'):
        conn = get_db_connection()
        cursor = conn.cursor()

        # Check if the list belongs to the user
        cursor.execute("SELECT user_id FROM email_lists WHERE id = ?", (list_id,))
        list_owner = cursor.fetchone()

        if not list_owner or list_owner['user_id'] != session['user_id']:
            conn.close()
            return "Unauthorized", 403

        try:
            csv_file = csv.reader(file.stream.read().decode('utf-8').splitlines())
            next(csv_file)  # Skip the header row (if it exists)

            for row in csv_file:
                if row:  # Make sure the row is not empty
                    email = row[0].strip()  # Assuming email is in the first column
                    try:
                        cursor.execute("INSERT INTO contacts (list_id, email) VALUES (?, ?)", (list_id, email))
                    except sqlite3.IntegrityError:
                        # Handle duplicate emails
                        print(f"Duplicate email skipped: {email}")

            conn.commit()
        except Exception as e:
            print(f"Error importing CSV: {e}")
            conn.rollback() # Rollback in case of error.
        finally:
            conn.close()

    return redirect(url_for('list_detail', list_id=list_id))


@app.route('/campaigns')
def campaigns():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM campaigns WHERE user_id = ?", (session['user_id'],))
    campaigns = cursor.fetchall()
    conn.close()

    return render_template('campaigns.html', campaigns=campaigns)

@app.route('/campaigns/create', methods=['GET', 'POST'])
def create_campaign():
    if 'user_id' not in session:
        return redirect(url_for('login'))

    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM email_lists WHERE user_id = ?", (session['user_id'],))
    lists = cursor.fetchall()
    conn.close()

    if request.method == 'POST':
        name = request.form['name']
        list_id = request.form['list_id']
        subject = request.form['subject']
        body = request.form['body']
        scheduled_time_str = request.form['scheduled_time']

        try:
            scheduled_time = datetime.strptime(scheduled_time_str, '%Y-%m-%dT%H:%M')  # HTML5 datetime format
        except ValueError:
            return render_template('create_campaign.html', lists=lists, error="Invalid date/time format")

        conn = get_db_connection()
        cursor = conn.cursor()
        cursor.execute("INSERT INTO campaigns (user_id, list_id, name, subject, body, scheduled_time) VALUES (?, ?, ?, ?, ?, ?)",
                       (session['user_id'], list_id, name, subject, body, scheduled_time))
        conn.commit()
        conn.close()
        return redirect(url_for('campaigns'))

    return render_template('create_campaign.html', lists=lists)

@app.route('/campaigns/send/<int:campaign_id>')
def send_campaign(campaign_id):
    if 'user_id' not in session:
        return redirect(url_for('login'))

    conn = get_db_connection()
    cursor = conn.cursor()

    # Check if campaign belongs to user
    cursor.execute("SELECT user_id, list_id, subject, body FROM campaigns WHERE id = ?", (campaign_id,))
    campaign = cursor.fetchone()

    if not campaign or campaign['user_id'] != session['user_id']:
        conn.close()
        return "Unauthorized", 403

    list_id = campaign['list_id']
    subject = campaign['subject']
    body = campaign['body']

    cursor.execute("SELECT email FROM contacts WHERE list_id = ?", (list_id,))
    contacts = cursor.fetchall()
    conn.close()

    sent_count = 0
    failed_count = 0

    for contact in contacts:
        email = contact['email']
        if send_email(email, subject, body):
            sent_count += 1
        else:
            failed_count += 1

    # Update campaign status (very basic)
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("UPDATE campaigns SET status = ? WHERE id = ?", ('sent', campaign_id)) # Or 'completed'
    conn.commit()
    conn.close()

    return f"Campaign sent. Sent: {sent_count}, Failed: {failed_count}"

if __name__ == '__main__':
    app.run(debug=True)

```

```html
<!-- templates/register.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Register</title>
</head>
<body>
    <h1>Register</h1>
    {% if error %}
        <p style="color: red;">{{ error }}</p>
    {% endif %}
    <form method="post">
        <label for="username">Username:</label><br>
        <input type="text" id="username" name="username" required><br><br>

        <label for="email">Email:</label><br>
        <input type="email" id="email" name="email" required><br><br>

        <label for="password">Password:</label><br>
        <input type="password" id="password" name="password" required><br><br>

        <input type="submit" value="Register">
    </form>
    <p>Already have an account? <a href="{{ url_for('login') }}">Login</a></p>
</body>
</html>
```

```html
<!-- templates/login.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Login</title>
</head>
<body>
    <h1>Login</h1>
    {% if error %}
        <p style="color: red;">{{ error }}</p>
    {% endif %}
    <form method="post">
        <label for="username">Username:</label><br>
        <input type="text" id="username" name="username" required><br><br>

        <label for="password">Password:</label><br>
        <input type="password" id="password" name="password" required><br><br>

        <input type="submit" value="Login">
    </form>
    <p>Don't have an account? <a href="{{ url_for('register') }}">Register</a></p>
</body>
</html>
```

```html
<!-- templates/dashboard.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Dashboard</title>
</head>
<body>
    <h1>Dashboard</h1>
    <p>Welcome!</p>
    <p><a href="{{ url_for('lists') }}">Manage Lists</a></p>
    <p><a href="{{ url_for('campaigns') }}">Manage Campaigns</a></p>
    <p><a href="{{ url_for('logout') }}">Logout</a></p>
</body>
</html>
```

```html
<!-- templates/lists.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Email Lists</title>
</head>
<body>
    <h1>Email Lists</h1>
    <p><a href="{{ url_for('create_list') }}">Create New List</a></p>
    <ul>
        {% for list in lists %}
            <li><a href="{{ url_for('list_detail', list_id=list.id) }}">{{ list.name }}</a></li>
        {% endfor %}
    </ul>
    <p><a href="{{ url_for('index') }}">Back to Dashboard</a></p>
</body>
</html>
```

```html
<!-- templates/create_list.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Create Email List</title>
</head>
<body>
    <h1>Create Email List</h1>
    <form method="post">
        <label for="name">List Name:</label><br>
        <input type="text" id="name" name="name" required><br><br>
        <input type="submit" value="Create List">
    </form>
    <p><a href="{{ url_for('lists') }}">Back to Lists</a></p>
</body>
</html>
```

```html
<!-- templates/list_detail.html -->
<!DOCTYPE html>
<html>
<head>
    <title>List Details - {{ list_name }}</title>
</head>
<body>
    <h1>List Details - {{ list_name }}</h1>

    <h2>Contacts</h2>
    <ul>
        {% for contact in contacts %}
            <li>{{ contact.email }}</li>
        {% endfor %}
    </ul>

    <h3>Add New Contact</h3>
    <form method="post" action="{{ url_for('add_contact', list_id=list_id) }}">
        <label for="email">Email:</label><br>
        <input type="email" id="email" name="email" required><br><br>
        <input type="submit" value="Add Contact">
    </form>

    <h3>Import Contacts from CSV</h3>
    <form method="post" action="{{ url_for('import_contacts', list_id=list_id) }}" enctype="multipart/form-data">
        <label for="file">CSV File:</label><br>
        <input type="file" id="file" name="file" accept=".csv" required><br><br>
        <input type="submit" value="Import Contacts">
    </form>

    <p><a href="{{ url_for('lists') }}">Back to Lists</a></p>
</body>
</html>
```

```html
<!-- templates/campaigns.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Campaigns</title>
</head>
<body>
    <h1>Campaigns</h1>
    <p><a href="{{ url_for('create_campaign') }}">Create New Campaign</a></p>
    <ul>
        {% for campaign in campaigns %}
            <li>
                {{ campaign.name }} - {{ campaign.subject }} (Status: {{ campaign.status }})
                <a href="{{ url_for('campaigns.send', campaign_id=campaign.id) }}">Send Now</a>
            </li>
        {% endfor %}
    </ul>
    <p><a href="{{ url_for('index') }}">Back to Dashboard</a></p>
</body>
</html>
```

```html
<!-- templates/create_campaign.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Create Campaign</title>
</head>
<body>
    <h1>Create Campaign</h1>
    {% if error %}
        <p style="color: red;">{{ error }}</p>
    {% endif %}
    <form method="post">
        <label for="name">Campaign Name:</label><br>
        <input type="text" id="name" name="name" required><br><br>

        <label for="list_id">Target List:</label><br>
        <select id="list_id" name="list_id" required>
            {% for list in lists %}
                <option value="{{ list.id }}">{{ list.name }}</option>
            {% endfor %}
        </select><br><br>

        <label for="subject">Subject:</label><br>
        <input type="text" id="subject" name="subject" required><br><br>

        <label for="body">Body:</label><br>
        <textarea id="body" name="body" rows="5" cols="50" required></textarea><br><br>

        <label for="scheduled_time">Scheduled Time:</label><br>
        <input type="datetime-local" id="scheduled_time" name="scheduled_time" required><br><br>

        <input type="submit" value="Create Campaign">
    </form>
    <p><a href="{{ url_for('campaigns') }}">Back to Campaigns</a></p>
</body>
</html>
```

**How to Run:**

1.  **Install Flask:**  `pip install Flask`
2.  **Create the Database:** Run the Python script once to create the `email_marketing.db` SQLite database.
3.  **Run the Application:** `python app.py`
4.  **Access in Browser:** Open your web browser and go to `http://127.0.0.1:5000/`

**Important Considerations and Next Steps:**

*   **Security:**
    *   **Password Hashing:**  The code uses `hashlib.sha256`, which is better than storing passwords in plain text.  However, for production, use `bcrypt` or `scrypt` for stronger password hashing.  `pip install bcrypt`
    *   **SQL Injection:** The code uses parameterized queries (`?` placeholders), which helps prevent SQL injection.  Always use parameterized queries.
    *   **CSRF Protection:**  Add CSRF protection to your forms (Flask-WTF can help).
    *   **Input Validation:**  Thoroughly validate all user inputs to prevent malicious data from being stored or executed.
*   **Email Sending:**
    *   **SMTP Configuration:**  Replace `"your_email@example.com"` and `"your_password"` with your actual email credentials.  **Never commit your real email password to a public repository!**  Use environment variables or a secrets management system.  Consider using an "app password" if your email provider supports it.
    *   **Transactional Email Service:** For production, use a transactional email service like SendGrid, Mailgun, AWS SES, or Postmark.  These services handle deliverability, bounces, spam complaints, and provide better tracking.  They also have APIs for sending emails, which are much more reliable than using `smtplib` directly.
    *   **Throttling:** Implement throttling to limit the number of emails sent per unit of time to avoid being marked as spam.
    *   **Email Templates:** Use a templating engine (like Jinja2, which is built into Flask) to create more sophisticated email templates.
*   **Error Handling:**
    *   Implement proper error handling and logging.  Use `try...except` blocks to catch exceptions and log them to a file or a logging service.
    *   Display user-friendly error messages instead of raw exceptions.
*   **Database:**
    *   For production, consider using a more robust database like PostgreSQL or MySQL.
    *   Use database migrations (e.g., Alembic) to manage database schema changes.
*   **Frontend:**
    *   Improve the frontend with CSS and JavaScript for a better user experience.
    *   Consider using a frontend framework like React, Vue.js, or Angular for more complex UIs.
*   **Testing:**
    *   Write unit tests and integration tests to ensure the application is working correctly.
*   **Scheduling:**
    *   Implement a proper scheduling mechanism (e.g., Celery, APScheduler) to send campaigns at scheduled times.
*   **Deployment:**
    *   Deploy the application to a production environment (e.g., Heroku, AWS, Google Cloud).  Use a WSGI server like Gunicorn or uWSGI.
*   **Scalability:**
    *   Consider using a message queue (e.g., RabbitMQ, Redis) to handle email sending asynchronously if you need to send a large number of emails.
*   **Authentication:**
    *   Implement more robust authentication using Flask-Login or a similar library.
    *   Consider using OAuth for social login.

This is a basic starting point.  You'll need to add many more features and improvements to create a production-ready email marketing application. Remember to prioritize security, error handling, and scalability as you develop the application further.
