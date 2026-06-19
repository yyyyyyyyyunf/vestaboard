# Use GSAP as the Animation Engine

We chose GSAP to drive the FlipSlot animation because the core effect relies on "scrubbing" a looping timeline: the playhead is animated forward (not backward) to the desired character, with easing applied to time itself. This "ease the time" behavior is hard to replicate with WAAPI or CSS without writing a custom timeline scheduler. GSAP is tree-shakeable, so only the core timeline/tween code is included in the bundle, keeping the size impact reasonable.
