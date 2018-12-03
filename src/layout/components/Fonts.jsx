import { createGlobalStyle } from 'styled-components';

const Fonts = createGlobalStyle`
    @font-face {
        font-family: "Helvetica Neue LT Std";
        src: url("fonts/HelveticaNeueLTStd-Bold.otf") format("opentype");
    }
    @font-face {
        font-family: "Proxima Nova Light";
        src: url("fonts/ProximaNova-Light.woff") format("woff");
    }
    @font-face {
        font-family: "Proxima Nova Regular";
        src: url("fonts/ProximaNova-Regular.woff") format("woff");
    }
    @font-face {
        font-family: "Proxima Nova Semibold";
        src: url("fonts/ProximaNova-Semibold.woff") format("woff");
    }

    body {
        font-family: "Proxima Nova Light" !important;
    }
`;

export default Fonts;
