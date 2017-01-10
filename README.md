# randomart-js

Generates a randomart image from a buffer or hexadecimal string. This implementation is based off of the "drunken bishop" paper:

[The drunken bishop: An analysis of the OpenSSH fingerprint visualization algorithm][paper]  
*Dirk Loss, Tobias Limmer<sup>&dagger;</sup>, Alexander von Gernler<sup>&Dagger;</sup>*

Here is an example animation of the walk for the hash used in the paper:

![Example animation][example]

## Usage

Node:

```js
var randomart = require('randomart-js')
randomart.render('fc94b0c1e5b0987c5843997697ee9fb7')
```

Standalone:

```js
randomart.render('fc94b0c1e5b0987c5843997697ee9fb7')
```

## API

`render`(*String or Buffer*, *[Object]*): *[[String]]*

Renders the randomart image as a 2d array. It takes the following properties in the optional config object:

- height: *Int* (default: `9`)
- width: *Int* (default: `17`)
- trail: *Boolean* (default: `false`)
- values: *Array* (default: `[' ','.','o','+','=','*','B','O','X','@','%','&','#','/','^']`)

The `trail` property will return an array of randomart images, showing the progression from start to end.
The `values` property determines how the trail in the walk is encoded. It defaults to the canonical representation.

- - -

`hexToBuffer`(*String*): *Buffer*

Creates a buffer out of a hexadecimal string. Useful for the browser standalone.

- - -

`gridToString`(*[[String]]*): *String*

Takes a 2d array (the randomart image) and converts it into a pretty printed string.

- - -

`bufferToBinaryPairs`(*Buffer*): *[String]*

Converts a buffer into an array of binary pairs, ie. `['11', '01', '00', ...]`.

- - -

`getWalk`(*[String]*): *[Object]*

Takes an array of binary pairs and returns the walk of coordinates, ie. `[{ x: 8, y: 4 }, { x: 7, y: 3 }, ...]`.

- - -

`walkToNumeric`(*[Object]*): *[Int]*

Takes a walk in the format from `getWalk` and returns the walk formatted in the representation given in the 
"drunken bishop" paper, ie. `[76, 58, 76, ...]`.


## Example

See the `example` folder and this [JSbin](http://jsbin.com/dugenuwiqe/1/embed?live)


[paper]: http://www.dirk-loss.de/sshvis/drunken_bishop.pdf
[example]: https://raw.githubusercontent.com/Risto-Stevcev/randomart-js/master/example.gif
