# cz-convention

forked from [ngryman/cz-emoji](https://github.com/ngryman/cz-emoji) to suit [my taste](https://github.com/ShafiqIslam/dotfiles/blob/master/.gitmessage).

<br /><br />

# Pre Requisite

Install commitizen

```
npm install -g commitizen
```

<br /><br />

# Install this adapter

## Global Level (to use on any project)

```
npm install -g @polygontech/cz-convention
```

Then, Reference it:

```
echo '{ "path": "@polygontech/cz-convention" }' > ~/.czrc
```

<br />

## Or, Project Level (to use on only that project)

```
npm install @polygontech/cz-convention
```

Then, Reference it in your `package.json` of your project

```
  ...
  "config": {
    "commitizen": {
      "path": "node_modules/@polygontech/cz-convention/"
    }
  }
  ...
```

<br /><br />

# Usage

Traditionally,

```
# for minimal version:
git cz

# or the full version
git cz --full
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
