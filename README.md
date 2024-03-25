# atproto-tid

Create and parse AT Protocol TID's format.

```ts
create(1709512159544000, 24); // -> 3kmtfck6kq22s

now(); // -> 3kmtfb5wxvk2e

parse('3kmtfb5wxvk2e'); // -> { timestamp: 1709512113158000, clockid: 10 }
```
