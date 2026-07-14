// content/blog/posts/index.ts
//
// Ręczny rejestr postów. Przy dodawaniu nowego posta (np. 2.tsx):
//   import Post2, { meta as meta2 } from "./2";
// i dopisz go do tablicy POSTS poniżej.
//
// Kolejność w tablicy = kolejność wyświetlania (chyba że lista w Blog.tsx
// sortuje po dacie — wtedy kolejność w tej tablicy nie ma znaczenia).

import type { BlogPostEntry } from "@/lib/blog/types";
import Post1, { meta as meta1 } from "./1";
import Post2, { meta as meta2 } from "./2";

export const POSTS: BlogPostEntry[] = [
  { meta: meta1, Content: Post1 },
  { meta: meta2, Content: Post2 },
  // { meta: meta2, Content: Post2 }, // <- kolejny post dopisz tutaj
];