sequenceDiagram
    participant browser
    participant server

    Note right of browser: The user types a note in the text field and clicks "Save"

    Note right of browser: JavaScript handles form submission, prevents default page reload, adds note to list, and redraws DOM

    browser->>server: POST https://studies.cs.helsinki.fi/exampleapp/new_note_spa
    activate server
    Note right of server: Server saves the new note sent as JSON payload
    server-->>browser: HTTP 201 Created
    deactivate server