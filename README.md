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

# Use this adapter

Reference it in your `package.json` of your project
```
  ...
  "config": {
    "commitizen": {
      "path": "node_modules/@sheba/cz-convention/"
    }
  }
  ...
```

# Usage
Traditionally,

```
git cz
```
With [husky](https://github.com/typicode/husky)
```
// .huskyrc
{
  "hooks": {
    ...
    "prepare-commit-msg": "exec < /dev/tty && git cz --hook",
    ...
  }
}
```
