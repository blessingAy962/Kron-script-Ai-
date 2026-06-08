# Security Specification & Test-Driven Design (Phase 0)

This document outlines the security specifications, data invariants, and negative test targets ("The Dirty Dozen" payloads) of the Kron Script AI application database.

## 1. Data Invariants

- **Ownership Integrity**: No image/video asset, script, user coin balance, or video entry can be read, created, updated, or deleted by any user other than the explicit owner whose `user_id` matches `request.auth.uid`.
- **System-only Coins**: Coins cannot be self-edited or self-granted. Updates to user coins must be validated under strict conditions or restricted to administrators (`isAdmin()`).
- **No Shadow Fields**: Strict JSON schema matching prevents the injection of undocumented properties.
- **Timestamp Immutability**: All timestamps (e.g., `created_at`) must align exactly to `request.time` during creation, and are completely immutable on updates.
- **ID Hardening**: Handled path variables (document IDs) must never exceed 128 characters and must match safety regex `^[a-zA-Z0-9_\-]+$`.

---

## 2. The "Dirty Dozen" Spoof/Attack Payloads

The following payloads represent attempt-profiles that must return `PERMISSION_DENIED` on writes or reads:

```json
[
  {
    "id": "Attack_01_IdentitySpoof",
    "description": "User 'JohnDoe' attempts to write a screenplay document claiming ownership of 'TargetUser_456'.",
    "payload": {
      "id": "johns_stolen_script",
      "user_id": "TargetUser_456",
      "title": "Stolen Film Project",
      "hook": "Unauthorised access hook",
      "content": "A story about identity theft.",
      "status": "draft",
      "word_count": 500,
      "created_at": "request.time"
    }
  },
  {
    "id": "Attack_02_ShadowFields",
    "description": "User attempts to inject arbitrary tracking parameters ('isVerifiedCreator': true) to elevate status.",
    "payload": {
      "id": "script_hack",
      "user_id": "JohnDoe",
      "title": "Normal Title",
      "hook": "Normal Hook",
      "content": "Content",
      "status": "draft",
      "word_count": 300,
      "created_at": "request.time",
      "isVerifiedCreator": true
    }
  },
  {
    "id": "Attack_03_ImmutabilityViolation",
    "description": "User attempts to change 'created_at' during update to lock system timing records.",
    "payload": {
      "id": "script_123",
      "user_id": "JohnDoe",
      "title": "Modified Title",
      "hook": "Modified Hook",
      "content": "Modified Content",
      "status": "draft",
      "word_count": 300,
      "created_at": "2020-01-01T00:00:00Z"
    }
  },
  {
    "id": "Attack_04_PrivilegeEscalationCoins",
    "description": "User attempts to write direct balance changes to increase their own KRON coins.",
    "payload": {
      "id": "JohnDoe",
      "user_id": "JohnDoe",
      "coins": 999999,
      "created_at": "request.time"
    }
  },
  {
    "id": "Attack_05_EmailSpoofingAdmin",
    "description": "User with fake unverified email attempts to log in or write to user coins pretending to be the official admin.",
    "payload": {
      "user_email": "starbruce91@gmail.com",
      "email_verified": false
    }
  },
  {
    "id": "Attack_06_XSS_ID_Poisoning",
    "description": "Attacker attempts to inject malicious script code / payload in the script path ID key to exploit UI loading.",
    "path": "/scripts/<script>alert('xss')</script>"
  },
  {
    "id": "Attack_07_InfiniteStringInjection",
    "description": "User attempts to push a massive block of 10MB data string as the hook field to trigger excessive storage costs.",
    "payload": {
      "id": "script_size_poison",
      "user_id": "JohnDoe",
      "title": "A Title",
      "hook": "[Super Huge 10MB String]",
      "content": "Content",
      "status": "draft",
      "word_count": 100,
      "created_at": "request.time"
    }
  },
  {
    "id": "Attack_08_ReferralSpoofing",
    "description": "User tries to self-verify as a successful referral referee to arbitrarily gain credits.",
    "payload": {
      "id": "ref_987",
      "referrer_id": "Attacker_777",
      "referred_email": "spoof@gmail.com",
      "status": "completed",
      "created_at": "request.time"
    }
  },
  {
    "id": "Attack_09_VideoCostSpoof",
    "description": "User attempts to generate video doc claiming 'coins_deducted': 0.",
    "payload": {
      "id": "vid_abc",
      "user_id": "JohnDoe",
      "video_url": "https://veo.google/video.mp4",
      "prompt": "Cinematic visual of space",
      "duration": 5,
      "aspect_ratio": "16:9",
      "coins_deducted": 0,
      "created_at": "request.time"
    }
  },
  {
    "id": "Attack_10_QueryListHarvesting",
    "description": "User attempts to list entire image index without restriction of ownerId in request query.",
    "action": "list"
  },
  {
    "id": "Attack_11_PublicUnsignedDataCreation",
    "description": "Anonymous unauthenticated user attempts to draft a document or change state.",
    "payload": {}
  },
  {
    "id": "Attack_12_InvalidTypeEnforcement",
    "description": "Attacker writes word_count as boolean true instead of number to break statistical calculations.",
    "payload": {
      "id": "type_hack",
      "user_id": "JohnDoe",
      "title": "Incorrect Types",
      "hook": "Hook",
      "content": "Content",
      "status": "draft",
      "word_count": true,
      "created_at": "request.time"
    }
  }
]
```

---

## 3. The Test Runner Specification (`firestore.rules.test.ts`)

```typescript
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import * as fs from "fs";

describe("Kron Script AI - Level 5 Firestore Security Rules Verification", () => {
  let testEnv: RulesTestEnvironment;

  before(async () => {
    testEnv = await initializeTestEnvironment({
      projectId: "ai-studio-d937aa55-d9b3-4946-a19e-a80fd986d103",
      firestore: {
        rules: fs.readFileSync("firestore.rules", "utf8"),
      },
    });
  });

  after(async () => {
    await testEnv.cleanup();
  });

  beforeEach(async () => {
    await testEnv.clearFirestore();
  });

  it("Attack 01 / 11: Should reject writes with spoofed userId or missing auth", async () => {
    const unauthedDb = testEnv.unauthenticatedContext().firestore();
    const badScript = unauthedDb.collection("scripts").doc("unauthed_script");
    await assertFails(badScript.set({
      id: "unauthed_script",
      user_id: "JohnDoe",
      title: "Title",
      hook: "Hook",
      content: "Content",
      status: "draft",
      word_count: 100,
      created_at: new Date()
    }));
  });

  it("Attack 04: Should refuse direct client updates to balance unless from authorized admin source", async () => {
    const normalUserDb = testEnv.authenticatedContext("JohnDoe").firestore();
    const coinsDoc = normalUserDb.collection("user_coins").doc("JohnDoe");
    await assertFails(coinsDoc.set({
      id: "JohnDoe",
      user_id: "JohnDoe",
      coins: 999999,
      created_at: new Date()
    }));
  });
});
```
