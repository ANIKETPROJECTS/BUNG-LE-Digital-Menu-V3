# QR table/floor token format

The menu uses a signed, URL-safe token so customers cannot change the table or
floor by editing the URL. The server validates the signature with the
`SESSION_SECRET` environment secret; that secret must never be put in the
browser, QR code, or this document.

## Token algorithm

1. Create a compact JSON payload:

   ```json
   {"tableName":"T1","floorName":"Ground Floor","v":1}
   ```

2. Encode the UTF-8 JSON bytes using base64url without padding. Call this
   value `payload`.
3. Calculate `HMAC-SHA256(payload, SESSION_SECRET)`.
4. Encode the digest using base64url without padding. Call this `signature`.
5. The QR suffix is:

   ```text
   payload.signature
   ```

   Example URL:

   ```text
   https://bungle.atdigitalmenu.com/<payload.signature>
   ```

The application sends the suffix to `/api/qr-context/:token`, verifies the HMAC
with a timing-safe comparison, and only then reads `tableName` and `floorName`.
The payload is encoded, not encrypted; the signature provides authenticity and
prevents tampering. Do not include personal information.

## Generator feature prompt

> Add an admin-only QR token generator. Provide text inputs for table name and
> floor name plus a Generate button. Using the exact token algorithm in
> `encryt.md`, create `{"tableName": tableName, "floorName": floorName, "v": 1}`,
> base64url encode it without padding, sign that encoded payload with
> HMAC-SHA256 using the server-side `SESSION_SECRET`, base64url encode the
> digest without padding, and return `payload.signature`. Display the complete
> URL by appending the token to `https://bungle.atdigitalmenu.com/` and provide
> a QR-code download. Never expose `SESSION_SECRET` to client code or API
> responses; token generation must happen on the server.

## Guest mode

Opening `/menu` or any URL without a valid signed suffix is guest mode. Guest
mode displays the menu but does not show the customer form, profile/order
controls, or add-to-order controls. A valid QR URL enables customer details,
ordering, profile, and order history.