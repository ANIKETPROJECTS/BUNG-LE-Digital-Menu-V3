---
name: POS menu availability
description: How the POS and digital menu share menu-item availability
---

The POS database stores menu records in `POS.menuItems` and controls visibility with `available`. The digital menu stores its display records separately and expects `isAvailable`.

**Why:** Treating the digital-menu record as the only source leaves items visible after staff marks them unavailable in the POS.

**How to apply:** Customer-menu APIs should overlay the POS `available` value onto matching items by POS id when available, otherwise by normalized name and category; missing availability defaults to available.