# Kill Console Log

Hey there, fellow coders! 👋 I'm excited to introduce you to **Kill Console Log** - your new go-to tool for cleaning up those pesky console logs. We've all been there, right? Debugging code and leaving a trail of `console.log` statements behind. Well, it's time to say goodbye to that mess with just a few keystrokes!

## What's This All About?

**Kill Console Log** is a sleek VS Code extension that helps you quickly and efficiently remove all the console logs from your code. Whether it's the current file, the changes in your git repo, or your entire project - we've got you covered!

## Features

- **Kill Console Logs in Current File**: Got a file littered with logs? We'll clean that up in a jiffy.
- **Kill Console Logs in Git Changes**: Only want to clean up your current work? No problem!
- **Eradicate All Console Logs**: Feeling brave? Wipe out every single console log in your project with one bold move.

## Keybindings

We've set up some handy keybindings to make your life even easier. Feel free to customize them to fit your workflow:

- `Ctrl+Alt+Shift+L` (or `Cmd+Alt+Shift+L` on Mac) for killing logs in the current file.
- `Ctrl+Alt+Shift+G` (or `Cmd+Alt+Shift+G` on Mac) for eliminating logs in git changes.
- `Ctrl+Alt+Shift+P` (or `Cmd+Alt+Shift+P` on Mac) for the full eradication.

## Getting Started

1. **Install the Extension**: Just search for "Kill Console Log" in the VS Code Extensions view and hit install. Easy peasy.
2. **Use the Commands**: Access our commands through the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P`), and start killing those logs.
3. **Customize Keybindings**: If our defaults don't vibe with you, change them up through VS Code's Keyboard Shortcuts editor.

## Limitations
Currently, Kill Console Log only supports Javascript. Additionally, as I have made this extension for my own use case, it supports the react-js stack I am using on a regular basis. <br />
Currently the extension is limited to these file types: `JS, TS, JSX, TSX, HTML`. I am more than happy to add any additional file types to the checker, please just contact me, or make a pull request.

## Contributing

Got ideas on how to make this even better? I'm all ears! Feel free to open an issue or submit a pull request. <br />
[You can check out the repository here](https://github.com/Snowcart/kill-console-log) <br />
You can also contact me on twitter: [@carterjsnowden](https://twitter.com/carterjsnowden)

## Future
There are future plans to also support C# Debug.Logs and its contemporaries. As Microsoft sunsets Visual Studio for Mac, and moves further to use of Visual Studio Code for their C# stack, I believe there will be more of a need for it. Please let me know if this is something you would like to see development on.

## License

This project is licensed under [MIT License](LICENSE) - because keeping things open and easy is how we roll.

---

Happy coding, and remember: keep your console clean! 😉