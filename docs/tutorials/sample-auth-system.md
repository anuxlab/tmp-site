# Sample Auth System (FastAPI + JWT)

> Minimal illustration of register, login, logout. NOT production-hardened (no DB, rate limiting, rotation, refresh tokens, CSRF defenses for browser use, etc.).

---
## 1. Dependencies
```bash
pip install fastapi uvicorn "passlib[bcrypt]" pyjwt python-multipart
```

---
## 2. Core Concepts
| Feature | Approach |
|---------|----------|
| Password storage | Bcrypt hash via Passlib |
| Identity | Username (unique) |
| Token | JWT (HS256) with exp + jti |
| Logout | Blacklist (in-memory set of revoked jti) |
| Persistence | In-memory dict (replace w/ DB) |

---
## 3. App Structure
```
auth_app/
  main.py
  security.py
```

---
## 4. security.py
```python
# security.py
import os, time, uuid, jwt
from passlib.context import CryptContext

SECRET = os.getenv("AUTH_SECRET", "dev-secret-change")
ALGO = "HS256"
ACCESS_TTL = 900  # 15 min
pwd_ctx = CryptContext(schemes=["bcrypt"], deprecated="auto")
revoked_jti: set[str] = set()

def hash_pwd(p: str) -> str:
    return pwd_ctx.hash(p)

def verify_pwd(p: str, h: str) -> bool:
    return pwd_ctx.verify(p, h)

def create_token(sub: str) -> dict:
    jti = str(uuid.uuid4())
    now = int(time.time())
    payload = {"sub": sub, "iat": now, "exp": now + ACCESS_TTL, "jti": jti}
    token = jwt.encode(payload, SECRET, algorithm=ALGO)
    return {"access_token": token, "token_type": "bearer", "jti": jti, "expires_in": ACCESS_TTL}

def decode(token: str) -> dict:
    return jwt.decode(token, SECRET, algorithms=[ALGO])

def revoke(jti: str):
    revoked_jti.add(jti)

def is_revoked(jti: str) -> bool:
    return jti in revoked_jti
```

---
## 5. main.py
```python
from fastapi import FastAPI, HTTPException, Depends, status, Header
from fastapi.security import OAuth2PasswordRequestForm
from pydantic import BaseModel
from security import hash_pwd, verify_pwd, create_token, decode, revoke, is_revoked

app = FastAPI(title="Sample Auth")

# In-memory user store; replace with DB
USERS: dict[str, dict] = {}

class RegisterIn(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    username: str

@app.post("/register", response_model=UserOut, status_code=201)
def register(body: RegisterIn):
    if body.username in USERS:
        raise HTTPException(409, "username taken")
    USERS[body.username] = {"pwd": hash_pwd(body.password)}
    return {"username": body.username}

@app.post("/login")
def login(form: OAuth2PasswordRequestForm = Depends()):
    rec = USERS.get(form.username)
    if not rec or not verify_pwd(form.password, rec["pwd"]):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "invalid creds")
    return create_token(form.username)

def current_user(authorization: str = Header(...)) -> str:
    if not authorization.lower().startswith("bearer "):
        raise HTTPException(401, "missing bearer token")
    token = authorization.split(" ", 1)[1]
    try:
        data = decode(token)
    except Exception:
        raise HTTPException(401, "invalid token")
    if is_revoked(data.get("jti", "")):
        raise HTTPException(401, "token revoked")
    return data["sub"]

@app.post("/logout")
def logout(authorization: str = Header(...)):
    if not authorization.lower().startswith("bearer "):
        raise HTTPException(401, "missing bearer token")
    token = authorization.split(" ", 1)[1]
    try:
        data = decode(token)
    except Exception:
        raise HTTPException(401, "invalid token")
    revoke(data.get("jti"))
    return {"revoked": True}

@app.get("/me", response_model=UserOut)
def me(user: str = Depends(current_user)):
    return {"username": user}
```
Run: `uvicorn main:app --reload` (inside `auth_app/`).

---
## 6. Example Interaction (HTTP)
```bash
# Register
curl -X POST localhost:8000/register -H 'Content-Type: application/json' \
  -d '{"username":"alice","password":"secret"}'

# Login (OAuth2 form)
TOKEN=$(curl -s -X POST -F 'username=alice' -F 'password=secret' localhost:8000/login | jq -r .access_token)

echo $TOKEN

# Authenticated
curl -H "Authorization: Bearer $TOKEN" localhost:8000/me

# Logout (revoke token)
curl -X POST -H "Authorization: Bearer $TOKEN" localhost:8000/logout

# Subsequent use fails
curl -H "Authorization: Bearer $TOKEN" localhost:8000/me  # 401
```

---
## 7. Hardening Checklist (Beyond Sample)
| Area | Improvement |
|------|------------|
| Storage | Real DB + migrations |
| Password Policies | Min length, complexity, breach check |
| Token | Refresh + rotation, shorter access TTL |
| Logout | Central store / redis for revocations |
| Rate Limiting | Prevent brute force (IP + user) |
| Monitoring | Audit logs, anomaly detection |
| Secrets | External secret manager |
| TLS | Enforce HTTPS only |
| CSRF | Needed if cookies used (SameSite + token) |
| MFA | TOTP / WebAuthn for sensitive actions |

---
## 8. Interview Q & A (Auth Basics)
1. Why hash passwords? Irreversible storage limits impact of breach; bcrypt adds salt + work factor.
2. Stateless logout challenge? JWT valid until expiry; need revocation list or short TTL + rotation.
3. Difference between auth & authz? Authentication = identity verification; Authorization = permission check.
4. Prevent brute force? Rate limit, exponential backoff, IP reputation, MFA.
5. Why avoid storing JWT in localStorage for browsers? Susceptible to XSS extraction; httpOnly secure cookies safer (plus CSRF defenses).
6. Refresh token purpose? Obtain new access tokens without re-login, enabling short-lived access tokens for security.
7. Risks of long-lived tokens? Replay window, harder revocation; mitigated by rotation and device binding.
8. Session fixation? Attacker sets known session ID; mitigate by regenerating ID post-auth.
9. Password reset security? Use single-use, time-bound tokens and invalidation after use.
10. OWASP relevance? Provides top risks guidance (injection, broken auth, sensitive data exposure, etc.).

---
*Last updated: Sep 2025*
