/// <reference path="react.d.ts" />
// To use JSX with React you should use the React typings.
/*
JSX is an embeddable XML-like syntax.
It came to popularity with the React framework.

TypeScript supports embedding, type checking, and compiling JSX
directly into JavaScript.

To use JSX:

- Name the file with `.tsx`.
- Enable `jsx` option.

TypeScript ships with two JSX modes: preserve and react.
The preserve mode will produces `.jsx` files for other transformers (e.g. Babel).
The react mode will emit `React.createElement`,
does not need to go through a JSX transformation before use (`.js`).
JSX modes can be specified using either `--jsx` command line option,
or in `tsconfig.json`.
*/


// Intrinsic elements (html tags) defined in special interface `JSX.IntrinsicElements`.
<br />;

// To limit tags can be used,
// declare `JSX.IntrinsicElements` interface with allowed tags.

// value-based elements (React components )
const ByConventionUsingUpperCase = <br />;
<ByConventionUsingUpperCase />;
// This is a bit confusing
// because TypeScript by convertion uses upper case for classes and interfaces.
//
// Similar to intrinsic elements,
// declare `JSX.ElementClass` interface to limit value-based elements.
//
// Attribute type checking
//
// Attributes of intrinsic elements are type checked
// against the property on `JSX.IntrinsicElements`.
//
// Attributes of value-based elements are type checked
// against a property on the element instance type.
// The (single) property is specified in `JSX.ElementAttributesProperty`.
//
// An example from Handbook:
declare namespace JSX {
  interface ElementAttributesProperty {
    props; // specify the property name to use
  }
}
class MyComponent {
  // specify the property on the element instance type
  props: {
    foo?: string;
  }
}

// By default the result of a JSX expression is typed as `any`.
// You can customize the type by specifying the `JSX.Element` interface.
// However, it is not possible to retrieve type information
// about the element, attributes or children of the JSX from this interface.


