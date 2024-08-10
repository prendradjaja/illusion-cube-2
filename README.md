# Illusion Cube

https://illusion-cube.netlify.app/

Bootstrapped with `create-react-app`. ([CRA readme](./create-react-app.readme.md))

## Development setup instructions

```bash
npm install
npm start
```

Then visit <http://localhost:3000/>.

## Example "impossible" state

- `1F` (i.e. F on cube 1, which is the left cube)
    - Now there are 10 white stickers on cube 2
    - But the 10th sticker is kinda still on cube 1, so
- `2D`
    - Now it's unambiguously on cube 2

Optionally, you can then do

- `1F` again
    - Now cube 1 also unambiguously has >9 orange stickers
