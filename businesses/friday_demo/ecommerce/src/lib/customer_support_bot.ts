```python
import os
import json
import time
import random
from datetime import datetime

# --- Core Components ---

class KnowledgeBase:
    """
    Manages the storage and retrieval of information for the bot.
    Uses a JSON file for persistence.  Can be extended to use a more
    robust database.
    """
    def __init__(self, filepath="knowledge_base.json"):
        self.filepath = filepath
        self.knowledge = self._load_knowledge()

    def _load_knowledge(self):
        """Loads knowledge from the JSON file."""
        if os.path.exists(self.filepath):
            try:
                with open(self.filepath, 'r') as f:
                    return json.load(f)
            except json.JSONDecodeError:
                print(f"Error decoding JSON from {self.filepath}.  Using an empty knowledge base.")
                return {}
        else:
            return {}

    def _save_knowledge(self):
        """Saves the knowledge to the JSON file."""
        try:
            with open(self.filepath, 'w') as f:
                json.dump(self.knowledge, f, indent=4)
        except Exception as e:
            print(f"Error saving knowledge to {self.filepath}: {e}")


    def get_answer(self, question):
        """Retrieves an answer based on the question."""
        question = question.lower() # Case-insensitive matching
        if question in self.knowledge:
            return self.knowledge[question]
        else:
            return None

    def add_qa(self, question, answer):
        """Adds a new question and answer to the knowledge base."""
        question = question.lower()
        if question not in self.knowledge:
            self.knowledge[question] = answer
            self._save_knowledge()
            return True
        else:
            return False # Question already exists

    def update_answer(self, question, new_answer):
        """Updates the answer to an existing question."""
        question = question.lower()
        if question in self.knowledge:
            self.knowledge[question] = new_answer
            self._save_knowledge()
            return True
        else:
            return False # Question doesn't exist

    def delete_qa(self, question):
        """Deletes a question and answer from the knowledge base."""
        question = question.lower()
        if question in self.knowledge:
            del self.knowledge[question]
            self._save_knowledge()
            return True
        else:
            return False

class Chatbot:
    """
    The main chatbot class.  Handles user interaction,
    question answering, and learning new information.
    """
    def __init__(self, knowledge_base):
        self.knowledge_base = knowledge_base
        self.greeting_messages = [
            "Hello! How can I help you today?",
            "Hi there! What can I do for you?",
            "Greetings! I'm here to assist you."
        ]
        self.farewell_messages = [
            "Goodbye!",
            "Have a great day!",
            "Thanks for chatting!"
        ]
        self.default_response = "I'm sorry, I don't have an answer for that.  Could you please rephrase your question, or would you like me to learn the answer?"
        self.learning_prompt = "What is the answer to this question?"
        self.confirmation_messages = [
            "Got it!",
            "Understood!",
            "Okay, I've added that to my knowledge."
        ]

    def greet(self):
        """Returns a random greeting message."""
        return random.choice(self.greeting_messages)

    def farewell(self):
        """Returns a random farewell message."""
        return random.choice(self.farewell_messages)

    def get_response(self, user_input):
        """
        Processes the user input and returns an appropriate response.
        Includes logic for:
            - Checking the knowledge base
            - Handling learning new information
            - Handling greetings and farewells
        """
        user_input = user_input.lower()

        if "hello" in user_input or "hi" in user_input or "greetings" in user_input:
            return self.greet()

        if "bye" in user_input or "goodbye" in user_input or "farewell" in user_input:
            return self.farewell()

        answer = self.knowledge_base.get_answer(user_input)
        if answer:
            return answer
        else:
            # Offer to learn the answer
            return self.default_response

    def learn_response(self, question, answer):
        """
        Learns a new question and answer pair.
        Returns True if successfully learned, False otherwise.
        """
        if self.knowledge_base.add_qa(question, answer):
            return random.choice(self.confirmation_messages)
        else:
            return "I already know the answer to that question."

    def update_response(self, question, new_answer):
        """
        Updates the answer to a question already in the knowledge base.
        Returns True if successfully updated, False otherwise.
        """
        if self.knowledge_base.update_answer(question, new_answer):
            return random.choice(self.confirmation_messages)
        else:
            return "I don't know that question yet."

    def delete_response(self, question):
        """
        Deletes a question and answer pair from the knowledge base.
        Returns True if successfully deleted, False otherwise.
        """
        if self.knowledge_base.delete_qa(question):
            return "Okay, I've forgotten that."
        else:
            return "I didn't know that question in the first place."


# --- User Interface (Console-based) ---

def run_chatbot(chatbot):
    """Runs the chatbot in a console-based interface."""
    print(chatbot.greet())
    while True:
        user_input = input("You: ")
        if user_input.lower() == "exit":
            print(chatbot.farewell())
            break

        response = chatbot.get_response(user_input)
        print("Bot:", response)

        if response == chatbot.default_response:
            learn_choice = input("Would you like me to learn the answer? (yes/no): ")
            if learn_choice.lower() == "yes":
                answer = input(chatbot.learning_prompt + ": ")
                learning_result = chatbot.learn_response(user_input, answer)
                print("Bot:", learning_result)
            elif learn_choice.lower() == "no":
                print("Bot: Okay.")
            else:
                print("Bot: Invalid choice.")


# --- Main Execution ---

if __name__ == "__main__":
    knowledge_base = KnowledgeBase()
    chatbot = Chatbot(knowledge_base)
    run_chatbot(chatbot)
```