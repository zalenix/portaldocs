<a name="style-guide-for-designers"></a>
## Style Guide: For designers
For an overall style guide refer to the [design-patterns-style-guide.md](design-patterns-style-guide.md)

<a name="style-style-sanitization"></a>
## Style: Style Sanitization

CSS is analyzed at runtime to filter out disallowed properties or values.

Apart from the few exceptions documented below, most CSS properties should be allowed. You may encounter CSS properties being erroneously filtered out. Shall this occur, report the issue on [Stack Overflow](https://stackoverflow.microsoft.com/).

Properties that allow specific values:

* `position`: [ `static` | `relative` | `absolute` ]
    * [ `fixed` ] is disallowed
* `text-transform`: [ `none` | `uppercase` | `lowercase` ]

Properties that are sanitized out:

* `font`
    * Use `font-*` properties instead of the shorthand
* `font-family`
    * Use `msportalfx-font-*` instead
* `list-style`
    * Use `list-style-*` properties instead of the shorthand
* `user-select`
    * Use class `msportalfx-unselectable` to normalize support across browsers
* `z-index`
