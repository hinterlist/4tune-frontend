import React from 'react';
import { isEmpty } from 'lodash';
import { Table, Message, Segment, Header, Button } from 'semantic-ui-react';

import GameHistoryItem from './GameHistoryItem';
import FilterHistoryButton from '../containers/FilterHistoryButton';

/**
 * Message to show if list of games is empty
 */
const EmptyMessage = () => (
    <Message info>There are no games yet, be the first!</Message>
);

const GameHistoryTable = ({ history }) => (
    <Table basic="very" celled>
        <Table.Header>
            <Table.Row>
                <Table.HeaderCell>Player</Table.HeaderCell>
                <Table.HeaderCell>Bet</Table.HeaderCell>
                <Table.HeaderCell>Result</Table.HeaderCell>
                <Table.HeaderCell>Jackpot</Table.HeaderCell>
            </Table.Row>
        </Table.Header>

        <Table.Body>
            {history.map(game => (
                <GameHistoryItem key={game.id} game={game} />
            ))}
        </Table.Body>
    </Table>
);

const GameHistory = ({ loading, history }) => (
    <Segment loading={loading}>
        <Header floated="left">Games history</Header>
        <FilterHistoryButton floated="right" />
        {isEmpty(history) ? (
            <EmptyMessage />
        ) : (
            <GameHistoryTable history={history} />
        )}
    </Segment>
);

export default GameHistory;
