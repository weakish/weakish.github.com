---
title: Test Wiki Links
---

# Test Wiki Links

This is a test page to verify wiki link resolution:

## Basic Wiki Links
- Link to [[1a]] should resolve to /zk/1a/
- Link to [[Sascha2020]] should resolve to /zk/Register/Sascha2020/
- Link to [[0b1a]] should resolve to /zk/0b1a/
- Link to [[nonexistent]] should fallback to /nonexistent/

## Advanced Wiki Link Syntax
- Link with custom text: [[1a|My Custom Text]]
- Link with heading: [[1a#introduction]]
- Link with heading and custom text: [[1a#introduction|Custom Heading Link]]

## Highlight Syntax
This ==highlighted text== should be marked as highlighted.

## Escaping Tests (should NOT be converted)

### In inline code:
This `[[1a]]` should not be converted to a link.
The `==highlight==` should not be processed.

### In code blocks:
```
[[1a]] should not be a link here
==highlight== should not be processed
```

```markdown
[[example]] wiki link in markdown code block
==highlight== in code block
```

These links should work correctly after our fix.