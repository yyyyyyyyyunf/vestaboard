# Vestaboard

A React component library for rendering split-flap display effects, where characters flip from one glyph to another like an airport departure board.

## Language

**FlipSlot**:
A single split-flap character unit that animates from one character to another.
_Avoid_: flap, cell, tile

**Vestaboard**:
A display board composed of multiple FlipSlots arranged in a grid to show strings of characters.
_Avoid_: board, panel, display (without qualification)

**Character**:
A single glyph that a FlipSlot can render, including letters, numbers, spaces, and emoji.
_Avoid_: letter, symbol (when spaces or emoji are possible)
