# Dive into Base64

Base64 index table
------------------

Upper case (26) and lower case (26) letters, with 10 digitals,
contribute 62 characters.
Index 63 and 64 are `+` and `/` in standard Base64,
`-` and `_` in `base64url`.

Padding
-------

Assuming a byte has 8 bits, we have `8 ** 2 = 64`.
Thus odd numbers of bytes would have needed padding.
In fact, base64 works directly on bits, not assuming a 8-bit clean environment.
For bits, we have `2 ** 6 = 64`.
Thus bytes are grouped by 3 (`lcm(6, 8) / 8 = 18 / 8 = 3`).
When encoding a 1-byte or 2-byte group, it is padded with `0`.
In encoded output, a final `==`/`=` sequence indicates the last group contains only 1/2 bytes.