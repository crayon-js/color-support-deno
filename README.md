<font size="6"><p align="center"><b>🖍️ Crayon.js color support for 🦕 Deno</b></p></font>
<hr />

## :books: About
##### This module is extension for [crayon.js](https://github.com/crayon-js/crayon) however it can still be used by other modules.

This module is permission-safe module. It'll still work without giving it permission by default, however you can force/ask for permissions by setting appropriate options.

However as for now `Deno.osRelease` is still unsafe you need to use `--unsafe`

## Syntax
```ts
async function getColorSupport(options?: {
	requestPermissions?: boolean;
  	forcePermissions?: boolean;
}): CrayonColorSupport;

function supportedColors(): CrayonColorSupport;

function getWindowsVersion(): number[];

interface CrayonColorSupport {
	threeBitColor: boolean
	fourBitColor: boolean
	highColor: boolean
	trueColor: boolean
}
```

## Usage
```ts
import { getColorSupport, supportedColors, getWindowsVersion } from 'https://deno.land/x/crayon_color_support/mod.ts';

const support = await getColorSupport(); // detect terminal color support
const cached = supportedColors(); // cached getColorSupport (it just returns cached object)
const windowsVersion = getWindowsVersion(); // Reusable function [version (7/8/10...), versionId (14931...)], empty if detected system is not Windows
```

## Usage with crayon.js
```ts
import crayon from 'https://deno.land/x/crayon/mod.ts'; // it'll still work with modules that extend crayon instance as its config is global
import { getColorSupport } from 'https://deno.land/x/crayon_color_support/mod.ts';

crayon.config.colorSupport = await getColorSupport();
```

### Wiki
To learn more about Crayon and its API look [here](https://github.com/crayon-js/crayon/wiki)

## :handshake: Contributing
#### Feel free to add any commits, issues and pull requests

## :memo: Licensing
#### This project is available under MIT License conditions.