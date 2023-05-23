API Documentation
![Alt Text](./api.png)

# API Documentation

---

## Messages API

### **Add a new message**

**Endpoint:**
POST http://127.0.0.1:3000/api/messages/

**Request Body:**

```json
{
  "conversationId": "<conversationId>",
  "sender": "<sender>",
  "text": "<messageText>"
}
```

**Request Body Parameters:**

Parameter Type Description
conversationId String The unique identifier of the conversation this message belongs to.
sender String The identifier of the user who sends the message.
text String The text content of the message.
Example:

```json
{
  "conversationId": "9ZdC9xwFhrJdGsESZJmR",
  "sender": "user1",
  "text": "It works"
}
```

Conversations API
Create a new conversation
Endpoint:

ruby
Copy code
POST http://127.0.0.1:3000/api/conversations/
Request Body:

```json
Copy code
{
    "senderId": "<senderId>",
    "receiverId": "<receiverId>"
}
```

Request Body Parameters:

Parameter Type Description
senderId String The unique identifier of the user who initiates the conversation.
receiverId String The unique identifier of the user who is the recipient of the conversation.
Example:

json
Copy code
{
"senderId": "user1",
"receiverId": "user2"
}

```

```
