import React from 'react';
import styled from 'styled-components';
import { Button, Image } from 'semantic-ui-react';

import Dialog from './Dialog';

const StyledButton = styled(Button)`
    background: rgb(162, 86, 235) !important;
    color: #ffffff !important;
`;

const InstallMetamask = () => (
    <Dialog>
        <Dialog.Header>
            <Image src="images/metamask.png" />
            MetaMask is Required
        </Dialog.Header>

        <Dialog.Body>
            To start using our games, please consider installing MetaMask
            wallet. <br />
            To do that, click the button below and follow the instruction.
        </Dialog.Body>

        <Dialog.Footer>
            <StyledButton
                href="https://chrome.google.com/webstore/detail/metamask/nkbihfbeogaeaoehlefnkodbefgpgknn?hl=en"
                target="_blank"
                link
            >
                Get MetaMask
            </StyledButton>
        </Dialog.Footer>
    </Dialog>
);

export default InstallMetamask;
