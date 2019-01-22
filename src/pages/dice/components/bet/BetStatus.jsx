import React from 'react';
import styled from 'styled-components';
import { lifecycle } from 'recompose';
import { Dimmer, Loader, Button } from 'semantic-ui-react';
import { Howl } from 'howler';

import { SimpleDialog, Dice } from '../../../../common';
import { FormattedMessage } from 'react-intl';
import BetErrorMessage from './BetErrorMessage';

const Title = styled.div`
    font-size: 18px;
    color: rgba(255, 255, 255, 0.5);
    padding-bottom: 15px;
`;

const StyledLoader = styled(Loader)`
    margin-top: 25px !important;
    color: rgba(255, 255, 255, 0.5) !important;
`;

const StyledButton = styled(Button)`
    background: rgb(162, 86, 235) !important;
    color: #ffffff !important;
    margin-top: 20px !important;
`;

const Dices = styled.div`
    margin-top: 10px;
`;

const StyledSimpleDialog = styled(SimpleDialog)`
    max-width: 400px;
`;

const BetStatusStart = ({ dices, amount }) => (
    <SimpleDialog.Body>
        <Title padding>
            <FormattedMessage
                id="page.dice.bet.BetStatusStart.title"
                defaultMessage="Please confirm bet transaction"
            />
        </Title>

        <Dices>
            {dices.map(option => (
                <Dice key={option} option={option} size={36} />
            ))}
        </Dices>
    </SimpleDialog.Body>
);

const BetStatusSuccess = ({ dices, amount }) => (
    <SimpleDialog.Body>
        <Title padding>
            <FormattedMessage
                id="page.dice.bet.BetStatusSuccess.title"
                defaultMessage="You bet {amount} ETH on"
                values={{ amount }}
            />
        </Title>

        {dices.map(option => (
            <Dice key={option} option={option} size={36} />
        ))}

        <StyledLoader inline centered>
            <FormattedMessage
                id="page.dice.bet.BetStatusSuccess.loader"
                defaultMessage="Waiting for Ethereum network"
            />
        </StyledLoader>
    </SimpleDialog.Body>
);

const PlayAgainButton = ({ onClick }) => (
    <StyledButton onClick={onClick} size="large" fluid>
        <FormattedMessage
            id="page.dice.bet.PlayAgainButton"
            defaultMessage="Play again"
        />
    </StyledButton>
);

const BetStatusFailed = ({ error, onClose }) => (
    <SimpleDialog.Body>
        <Title padding>
            <BetErrorMessage error={error} />
        </Title>

        <PlayAgainButton onClick={onClose} />
    </SimpleDialog.Body>
);

const BetResultFail = ({ onClose }) => (
    <SimpleDialog.Body>
        <Title padding>
            <FormattedMessage
                id="page.dice.bet.BetResultFail.title"
                defaultMessage="Bet has failed"
            />
        </Title>

        <FormattedMessage
            id="page.dice.bet.BetResultFail.body"
            defaultMessage="We were not able to process your bet, but don't worry, your funds are safe and will be refunded automatically. That may take up to 1 hour, unfortunatelu we can't speed up this process."
        />

        <PlayAgainButton onClick={onClose} />
    </SimpleDialog.Body>
);

const BetResultWin = ({ dices, win, payment, onClose }) => (
    <SimpleDialog.Body>
        <Title padding>
            <FormattedMessage
                id="page.dice.bet.BetResultWin.title"
                defaultMessage="You won {amount} ETH!"
                values={{ amount: payment }}
            />
        </Title>

        <Dice
            option={win}
            size={96}
            color={'linear-gradient(45deg, #62fd9e, #168aa3)'}
        />

        <Dices>
            {dices.map(option => (
                <Dice key={option} option={option} size={36} />
            ))}
        </Dices>

        <PlayAgainButton onClick={onClose} />
    </SimpleDialog.Body>
);

const BetResultLoose = ({ dices, win, amount, onClose }) => (
    <SimpleDialog.Body>
        <Title padding>
            <FormattedMessage
                id="page.dice.bet.BetResultLoose.title"
                defaultMessage="You loose {amount} ETH :("
                values={{ amount }}
            />
        </Title>

        <Dice
            option={win}
            size={96}
            color={'linear-gradient(45deg, #62fd9e, #168aa3)'}
        />

        <Dices>
            {dices.map(option => (
                <Dice key={option} option={option} size={36} />
            ))}
        </Dices>

        <PlayAgainButton onClick={onClose} />
    </SimpleDialog.Body>
);

const BetStatusResult = ({ result, ...props }) => {
    let Component = null;

    switch (result) {
        case 'WIN':
            Component = BetResultWin;
            break;
        case 'LOOSE':
            Component = BetResultLoose;
            break;
        case 'FAIL':
            Component = BetResultFail;
            break;
        default:
            return null;
    }

    return <Component {...props} />;
};

const BetStatusContent = ({ status, ...props }) => {
    let Component = null;
    switch (status) {
        case 'START':
            Component = BetStatusStart;
            break;
        case 'SUCCESS':
            Component = BetStatusSuccess;
            break;
        case 'FAIL':
            Component = BetStatusFailed;
            break;
        case 'RESULT':
            Component = BetStatusResult;
            break;
        default:
            return null;
    }

    return <Component {...props} />;
};

const BetStatus = ({ status, ...props }) => (
    <Dimmer page active>
        <StyledSimpleDialog>
            <BetStatusContent status={status} {...props} />
        </StyledSimpleDialog>
    </Dimmer>
);

/**
 * Play sound depending on game result
 */
const withSound = lifecycle({
    componentWillReceiveProps({ result, status }) {
        if (status === 'RESULT') {
            let file = null;
            switch (result) {
                case 'WIN':
                    file = '/sounds/win.mp3';
                    break;
                case 'LOOSE':
                    file = '/sounds/loose.mp3';
                    break;
                default: {
                }
            }

            if (file) {
                setTimeout(() => {
                    const sound = new Howl({
                        src: [file],
                        volume: 0.5,
                    });
                    sound.play();
                }, 0);
            }
        }
    },
});

export default withSound(BetStatus);
