# cz-convention
forked from [ngryman/cz-emoji](https://github.com/ngryman/cz-emoji) to suit [my taste](https://github.com/ShafiqIslam/dotfiles/blob/master/.gitmessage).

# Pre Requisite
Install commitizen
```
npm install -g commitizen
```

# Install this adapter

```
npm install @sheba/cz-convention
```
Then, Reference it in your `package.json` of your project
```
  ...
  "config": {
    "commitizen": {
      "path": "node_modules/@sheba/cz-convention/"
    }
  }
  ...
```
Or, globally
```
npm install -g @sheba/cz-convention
```
Then, Reference it:
```
echo '{ "path": "@sheba/cz-convention" }' > ~/.czrc
```


# Usage
Traditionally,

```
git cz
```
With [husky](https://github.com/typicode/husky), in your runcom `.huskyrc` or `.huskyrc.js`:
```
{
  "hooks": {
    ...
    "prepare-commit-msg": "exec < /dev/tty && git cz --hook",
    ...
  }
}
```
