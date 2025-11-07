Okay, I understand. I am builder_agent. My task is to build the `shopping_cart` application and generate the production code.

Here's my plan:

1.  **Define the Core Functionality:**  I'll start by outlining the basic features a shopping cart application needs:
    *   **Add Items:**  Allow users to add products to the cart.
    *   **Remove Items:**  Enable users to remove products from the cart.
    *   **Update Quantities:**  Let users change the quantity of an item in the cart.
    *   **View Cart:**  Display the items in the cart, their quantities, and the total price.
    *   **Calculate Total:** Calculate the total cost of all items in the cart.

2.  **Choose a Programming Language and Framework:**  For this example, I'll use Python and a simple framework like Flask. Flask is lightweight and suitable for creating a basic web application.

3.  **Design the Data Structure:** I'll use a dictionary to represent the shopping cart. The keys will be product IDs, and the values will be dictionaries containing product details (name, price, quantity).

4.  **Implement the Flask Application:** I'll create Flask routes for:
    *   Adding items to the cart (`/add_to_cart`)
    *   Removing items from the cart (`/remove_from_cart`)
    *   Updating quantities (`/update_quantity`)
    *   Viewing the cart (`/cart`)

5.  **Create a Basic HTML Template:** I'll create a simple HTML template to display the shopping cart contents.

6.  **Implement Error Handling:**  I'll add basic error handling to catch invalid product IDs or quantities.

7.  **Generate the Production Code:** I'll provide the Python code for the Flask application and the HTML template.

Here's the production code:

**1. `app.py` (Flask Application):**

```python
from flask import Flask, render_template, request, redirect, url_for

app = Flask(__name__)

# Sample product data (replace with a database in a real application)
products = {
    1: {'name': 'Laptop', 'price': 1200},
    2: {'name': 'Mouse', 'price': 25},
    3: {'name': 'Keyboard', 'price': 75},
}

# Shopping cart (stored in session in a real application)
cart = {}


@app.route('/')
def index():
    return render_template('index.html', products=products)


@app.route('/add_to_cart/<int:product_id>')
def add_to_cart(product_id):
    if product_id in products:
        if product_id in cart:
            cart[product_id]['quantity'] += 1
        else:
            cart[product_id] = {'name': products[product_id]['name'], 'price': products[product_id]['price'], 'quantity': 1}
    return redirect(url_for('view_cart'))


@app.route('/remove_from_cart/<int:product_id>')
def remove_from_cart(product_id):
    if product_id in cart:
        del cart[product_id]
    return redirect(url_for('view_cart'))


@app.route('/update_quantity/<int:product_id>', methods=['POST'])
def update_quantity(product_id):
    if product_id in cart:
        try:
            quantity = int(request.form['quantity'])
            if quantity > 0:
                cart[product_id]['quantity'] = quantity
            else:
                del cart[product_id] #remove if quantity is 0 or less
        except ValueError:
            # Handle invalid quantity input (e.g., display an error message)
            pass  # For now, just ignore invalid input
    return redirect(url_for('view_cart'))


@app.route('/cart')
def view_cart():
    total = 0
    for product_id, item in cart.items():
        total += item['price'] * item['quantity']
    return render_template('cart.html', cart=cart, total=total)


if __name__ == '__main__':
    app.run(debug=True)
```

**2. `templates/index.html` (Product Listing):**

```html
<!DOCTYPE html>
<html>
<head>
    <title>Product List</title>
</head>
<body>
    <h1>Available Products</h1>
    <ul>
        {% for product_id, product in products.items() %}
            <li>
                {{ product.name }} - ${{ product.price }}
                <a href="{{ url_for('add_to_cart', product_id=product_id) }}">Add to Cart</a>
            </li>
        {% endfor %}
    </ul>
    <a href="{{ url_for('view_cart') }}">View Cart</a>
</body>
</html>
```

**3. `templates/cart.html` (Shopping Cart View):**

```html
<!DOCTYPE html>
<html>
<head>
    <title>Shopping Cart</title>
</head>
<body>
    <h1>Shopping Cart</h1>
    {% if cart %}
        <table>
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {% for product_id, item in cart.items() %}
                    <tr>
                        <td>{{ item.name }}</td>
                        <td>${{ item.price }}</td>
                        <td>
                            <form action="{{ url_for('update_quantity', product_id=product_id) }}" method="post">
                                <input type="number" name="quantity" value="{{ item.quantity }}" min="1">
                                <button type="submit">Update</button>
                            </form>
                        </td>
                        <td>${{ item.price * item.quantity }}</td>
                        <td><a href="{{ url_for('remove_from_cart', product_id=product_id) }}">Remove</a></td>
                    </tr>
                {% endfor %}
            </tbody>
        </table>
        <p><strong>Total: ${{ total }}</strong></p>
    {% else %}
        <p>Your cart is empty.</p>
    {% endif %}
    <a href="{{ url_for('index') }}">Continue Shopping</a>
</body>
</html>
```

**Explanation and How to Run:**

1.  **Save the files:**  Save the Python code as `app.py` and the HTML templates in a folder named `templates`.  The `templates` folder should be in the same directory as `app.py`.

2.  **Install Flask:**  Open a terminal or command prompt and run:
    ```bash
    pip install Flask
    ```

3.  **Run the application:**  Navigate to the directory where you saved `app.py` and run:
    ```bash
    python app.py
    ```

4.  **Open in your browser:**  Open your web browser and go to `http://127.0.0.1:5000/` or the address shown in the terminal.

**Important Considerations for Production:**

*   **Database:**  In a real-world application, you'd use a database (e.g., PostgreSQL, MySQL, SQLite) to store product information and user shopping carts.
*   **Sessions:**  Use Flask sessions to store the cart data on the server-side, associated with a user's browser.
*   **Security:**  Implement proper security measures, such as input validation, output escaping, and protection against CSRF attacks.
*   **Error Handling:**  Implement more robust error handling and logging.
*   **Deployment:**  Use a production-ready web server (e.g., Gunicorn, uWSGI) and deploy your application to a cloud platform (e.g., AWS, Google Cloud, Azure) or a dedicated server.
*   **Scalability:** Consider caching and other techniques to improve scalability if you expect a large number of users.
*   **User Authentication:** Implement user authentication and authorization to manage user accounts and shopping carts.
*   **Payment Gateway Integration:** Integrate with a payment gateway (e.g., Stripe, PayPal) to process payments.

This is a basic example, but it provides a foundation for building a more complete shopping cart application.  Remember to adapt and expand upon this code to meet the specific requirements of your project.
