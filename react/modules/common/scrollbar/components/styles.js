module.exports = {
    containerStyleDefault: {
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%'
    },

    // Overrides containerStyleDefault properties
    containerStyleAutoHeight: {
        height: 'auto'
    },

    viewStyleDefault: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        paddingRight:10,
        overflow: 'scroll',
        WebkitOverflowScrolling: 'touch'
    },

    // Overrides viewStyleDefault properties
    viewStyleAutoHeight: {
        position: 'relative',
        top: undefined,
        left: undefined,
        right: undefined,
        bottom: undefined
    },

    viewStyleUniversalInitial: {
        overflow: 'hidden',
        marginRight: 0,
        marginBottom: 0,
    },

    trackHorizontalStyleDefault: {
        position: 'absolute',
        height: 6
    },

    trackVerticalStyleDefault: {
        position: 'absolute',
        width: 6
    },

    thumbHorizontalStyleDefault: {
        position: 'relative',
        display: 'block',
        height: '100%'
    },

    thumbVerticalStyleDefault: {
        position: 'relative',
        display: 'block',
        width: '100%'
    },

    disableSelectStyle: {
        userSelect: 'none'
    },

    disableSelectStyleReset: {
        userSelect: ''
    }
};
