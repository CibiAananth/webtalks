# Exercise 07: The Component Waterfall

See how React's component model creates fetch waterfalls.

## How to run

```bash
cd 03-react
npm run dev
```

Navigate to http://localhost:5173/07, click 'Load Profile', and watch the waterfall chart.

## What you'll see

Three requests fire sequentially because each child component waits for its parent to render before it can mount and start fetching:

1. `GET /users/1` - UserInfo loads
2. `GET /users/1/posts` - UserPosts loads (after UserInfo renders)
3. `GET /posts/1/comments` - PostComments loads (after UserPosts renders)

Total time: ~2400ms (3 x 800ms delays, sequential)

## Learning objectives

- Understand why nested component fetching creates waterfalls
- See that this is a fundamental React architecture issue, not a coding mistake
- Recognize that Promise.all can't help when components don't exist yet
