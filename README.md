# Dialect
## A modern, opinionated programming language that compiles to JS.
---
## CLI reference
The CLI has two modes, compile and run.  
```dialup <mode>```  

### Compile  
Compile generates an output javascript file you can run with node! (Notes on web further down in the options section.)  

#### Usage:  
```dialup compile [-o output] [options] <file>```
If you specify an output, then it will be saved there, otherwise it saves to out.js.

#### Options:
Currently, compile only has one extra option, that being `--skip-cps`.  
This does what it says, and skips the CPS phase, which is useful for using the generated JS in web.  
!!! NOTE !!! This breaks the normal standard library, but dom has been written with this in mind. This also breaks `let` nodes, so make sure to make all variables global.

### Run
Run just... runs the code!  
Note, no standard libraries are included, import them yourself!

#### Usage:
```dialup run <file>```


---

## Structure
The compiler is built from multiple modular components. They are used as follows:  

1. The raw file data is given to the preprocessor, which handles imports.
1. The sanitized data is then passed into an InputStream, which handles per-letter errors.
1. The InputStream is then fed into a TokenStream, which creates token out of the characters.
1. That is fed into the parser, which generates a basic AST for further use.  
   Note-- at this phase the AST is theoretically able to be compiled to JS, and that's exactl what `--skip-cps` does.
1. The AST is then given to the CPS generator, which will transform our normal code to CPS code.
1. Then we run the optimizer over that CPS AST, creating an optimized AST.
1. Lastly we feed the optimized AST into a code generator, which currently just generates JS, but maybe will do other languages in the future.

---
## Syntax overview
### `with`
`with` is how functions are defined (refered to as lambdas in source). You can have a function 'with' no inputs, or have inputs:
```
noInputs = with() |
    30 + 20;
|;

inputs = with(n) |
    n + 30;
|;
```

### `if/then/else`
These follow the normal way these work in other languages.
```
a = 2;
b = 3;

if b > a |
    print("yay");
|;
if a > b |
    print("nay");
|;

*** Result
yay
```
Or, inline!
```
a = 2;
b = 3;

print(if b > a then "yay" else "nay")
*** Result
yay
```
---
## Quirks
If you have recursive imports (smth like this):  
```
        test1                        test2
 ┌───────────────────┐       ┌───────────────────┐
 │                   ├──────►│                   │
 │  import test2;    │       │  import test1;    │
 │                   │       │                   │
 │                   │◄──────┤                   │
 └───────────────────┘       └───────────────────┘
```

Then you'll get a `RangeError: Maximum call stack size exceeded` during the Preprocessing phase