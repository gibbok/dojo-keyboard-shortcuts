// module:
//		shortcuts
// summary:
//      Set of shortcuts to be detected.
// description:
//      Set of shortcuts to be detected in your application.
//      Use a dash '-' betweens keys. ThecopyKey  is a “virtual key” that is either
//      CTRL on Windows or the CMD key on Macintoshes,
//      More information: https://dojotoolkit.org/reference-guide/1.10/dojo/keys.html
define({
        'undo': {
            'combo': 'copyKey-z'
        },
        'redo': {
            'combo': 'copyKey-y'
        },
        'group': {
            'combo': 'copyKey-g'
        },
        'ungroup': {
            'combo': 'copyKey-shift-g'
        }
});
