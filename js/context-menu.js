export var tinyPopupMenu = new TinyPopupMenu({
    /**
     * Close menu after selecting an item
     * Defaults is true;
     */
    autoclose: true,

    /**
     * Show the menu at top or at bottom of the toggler
     * Default is 'bottom'
     */
    position: TinyPopupMenu.Position.Bottom,

    /**
     * Margin between the menu and the toggler button.
     * Default is 10 if `arrow` is true, otherwise is 5
     */
    margin: 5,
    
    /**
     * Offset to display the menu
     */
    offset: {
        x: 0,
        y: 0
    },

    /**
     * Custom classname to add to the popup menu
     */
    className: '',

    /**
     * Show css arrow
     * Default is `true`
     */
    arrow: true,

    /**
     * Prevent event propagation
     * Default is `true`
     */
    stopClick: true,

    /**
     * Menu items to display in the menu
     */
    menuItems: [
        {
            content: 'Display alert 😎',
            callback: () => alert('Alert')
        },
        {
            content: 'Display another alert',
            callback: () => alert('Another alert')
        },
        '-', // separator
        {
            content: 'Delete',
            callback: () => alert('Delete!'),
            className: 'delete'
        }
    ]
});