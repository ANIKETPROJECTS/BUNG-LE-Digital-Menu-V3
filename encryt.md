# QR Table and Floor String Generator

Create a feature that asks the user for:

- Table name
- Floor name

After the user submits both values, generate a URL-safe string that can be
appended to the digital menu URL:

```text
https://bungle.atdigitalmenu.com/<generated-string>
```

The generated string must use the exact QR-token logic already expected by the
digital menu:

1. Create a JSON payload containing:

   ```json
   {
     "tableName": "<table name>",
     "floorName": "<floor name>",
     "v": 1
   }
   ```

2. Encode the JSON payload as base64url without padding.
3. Create an HMAC-SHA256 signature of the encoded payload using the server-side
   `SESSION_SECRET`.
4. Encode the signature as base64url without padding.
5. Return the final string in this format:

   ```text
   <encoded-payload>.<encoded-signature>
   ```

The generator must perform signing on the server. Never expose
`SESSION_SECRET` in browser code, frontend bundles, API responses, or generated
files.

The feature should display the generated full URL so the user can copy it and
use it when creating a table/floor QR code. Optionally provide a QR image
download for the generated URL.

The digital menu will validate the signature server-side and read the table and
floor values only after successful validation. Do not use plain base64 without
the HMAC signature, because users must not be able to modify the table or floor
name by editing the URL.